#!/usr/bin/env node
/**
 * VIB34D Professional Dashboard Production Testing Suite
 * Comprehensive testing of all WebGL visualizers and hypercube navigation
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class VIB34DProductionTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.serverProcess = null;
        this.serverUrl = null;
        this.testResults = {
            timestamp: new Date().toISOString(),
            server: {},
            webgl: {},
            navigation: {},
            visualizers: {},
            performance: {},
            configuration: {},
            summary: {}
        };
    }

    async startServer() {
        console.log('🚀 Starting production server...');
        
        return new Promise((resolve, reject) => {
            this.serverProcess = spawn('python3', ['production-server.py'], {
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let serverOutput = '';
            
            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                serverOutput += output;
                console.log(output.trim());
                
                // Look for server URL
                const urlMatch = output.match(/Server URL: (http:\/\/[^\s]+)/);
                if (urlMatch) {
                    this.serverUrl = urlMatch[1];
                    setTimeout(() => resolve(this.serverUrl), 2000); // Give server time to fully start
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                console.error('Server error:', data.toString());
            });

            this.serverProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Server process exited with code ${code}`));
                }
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!this.serverUrl) {
                    reject(new Error('Server failed to start within timeout'));
                }
            }, 10000);
        });
    }

    async initBrowser() {
        console.log('🌐 Launching browser for testing...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Show browser for visual verification
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--enable-webgl',
                '--enable-accelerated-2d-canvas',
                '--disable-gpu-sandbox',
                '--allow-running-insecure-content',
                '--disable-web-security'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Enhanced console logging
        this.page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            
            if (type === 'error') {
                console.error('🔴 Browser Error:', text);
            } else if (text.includes('VIB34D') || text.includes('WebGL') || text.includes('Dashboard')) {
                console.log(`📝 ${type.toUpperCase()}: ${text}`);
            }
        });

        // Track page errors
        this.page.on('pageerror', error => {
            console.error('🔴 Page Error:', error.message);
            this.testResults.errors = this.testResults.errors || [];
            this.testResults.errors.push({
                type: 'page_error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        });

        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    }

    async testServerStatus() {
        console.log('\n📊 Testing server status...');
        
        try {
            const response = await this.page.goto(`${this.serverUrl}/api/status`, { 
                waitUntil: 'networkidle0',
                timeout: 10000 
            });
            
            const statusData = await response.json();
            
            this.testResults.server = {
                status: 'running',
                response_code: response.status(),
                data: statusData,
                url: this.serverUrl
            };
            
            console.log('✅ Server status test passed');
            return true;
            
        } catch (error) {
            console.error('❌ Server status test failed:', error.message);
            this.testResults.server = { status: 'failed', error: error.message };
            return false;
        }
    }

    async testWebGLSupport() {
        console.log('\n🎨 Testing WebGL support...');
        
        await this.page.goto(`${this.serverUrl}/professional`, { 
            waitUntil: 'networkidle0',
            timeout: 15000 
        });

        const webglResults = await this.page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                return { supported: false, error: 'WebGL context not available' };
            }

            const info = {
                supported: true,
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION),
                shading_language_version: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                max_texture_size: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                max_vertex_attribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
                max_varying_vectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
                max_fragment_uniform_vectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
                extensions: gl.getSupportedExtensions()
            };

            return info;
        });

        this.testResults.webgl = webglResults;
        
        if (webglResults.supported) {
            console.log('✅ WebGL fully supported');
            console.log(`   Renderer: ${webglResults.renderer}`);
            console.log(`   Version: ${webglResults.version}`);
        } else {
            console.error('❌ WebGL not supported:', webglResults.error);
        }

        return webglResults.supported;
    }

    async testVisualizerInitialization() {
        console.log('\n🔮 Testing visualizer initialization...');
        
        // Wait for dashboard to load
        await this.page.waitForTimeout(3000);
        
        const visualizerResults = await this.page.evaluate(() => {
            const results = {
                total_canvases: 0,
                webgl_canvases: 0,
                fallback_canvases: 0,
                canvases_by_type: {},
                visualizer_system: null,
                home_master: null,
                reactivity_bridge: null
            };

            // Count all canvas elements
            const canvases = document.querySelectorAll('canvas');
            results.total_canvases = canvases.length;

            // Test each canvas for WebGL
            canvases.forEach((canvas, index) => {
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    results.webgl_canvases++;
                } else {
                    results.fallback_canvases++;
                }

                // Categorize by ID
                const id = canvas.id;
                if (id.includes('board')) {
                    results.canvases_by_type.board = (results.canvases_by_type.board || 0) + 1;
                } else if (id.includes('card')) {
                    results.canvases_by_type.card = (results.canvases_by_type.card || 0) + 1;
                } else if (id.includes('bezel')) {
                    results.canvases_by_type.bezel = (results.canvases_by_type.bezel || 0) + 1;
                }
            });

            // Check for dashboard systems
            if (window.vib34dDashboard) {
                results.visualizer_system = {
                    initialized: window.vib34dDashboard.isInitialized,
                    current_face: window.vib34dDashboard.currentFace,
                    visualizer_count: window.vib34dDashboard.visualizers?.size || 0,
                    system_state: window.vib34dDashboard.getSystemState?.() || null
                };
            }

            if (window.vib34dDashboard?.homeMaster) {
                results.home_master = {
                    available: true,
                    state: window.vib34dDashboard.homeMaster.getSystemState?.() || 'unknown'
                };
            }

            if (window.vib34dDashboard?.reactivityBridge) {
                results.reactivity_bridge = {
                    available: true,
                    state: window.vib34dDashboard.reactivityBridge.getSystemState?.() || 'unknown'
                };
            }

            return results;
        });

        this.testResults.visualizers = visualizerResults;

        console.log(`✅ Found ${visualizerResults.total_canvases} total canvases`);
        console.log(`   🎨 WebGL: ${visualizerResults.webgl_canvases}`);
        console.log(`   📝 Fallback: ${visualizerResults.fallback_canvases}`);
        console.log(`   📋 Board visualizers: ${visualizerResults.canvases_by_type.board || 0}`);
        console.log(`   🃏 Card visualizers: ${visualizerResults.canvases_by_type.card || 0}`);
        console.log(`   🔘 Bezel visualizers: ${visualizerResults.canvases_by_type.bezel || 0}`);

        if (visualizerResults.visualizer_system?.initialized) {
            console.log('✅ Dashboard system fully initialized');
        } else {
            console.warn('⚠️ Dashboard system not fully initialized');
        }

        return visualizerResults.total_canvases >= 30; // Should have 33+ canvases
    }

    async testHypercubeNavigation() {
        console.log('\n🧭 Testing hypercube navigation...');
        
        const navigationResults = {
            faces_tested: 0,
            successful_transitions: 0,
            failed_transitions: 0,
            transition_times: [],
            face_data: {}
        };

        const faces = ['home', 'tech', 'media', 'audio', 'quantum', 'context', 'innovation', 'research'];
        const bezels = [
            { selector: '.nav-bezel-right', target: 'tech', direction: 'right' },
            { selector: '.nav-bezel-bottom', target: 'context', direction: 'down' },
            { selector: '.nav-bezel-left', target: 'audio', direction: 'left' },
            { selector: '.nav-bezel-top', target: 'quantum', direction: 'up' }
        ];

        try {
            for (const bezel of bezels) {
                console.log(`   Testing navigation: ${bezel.direction} → ${bezel.target}`);
                
                const startTime = Date.now();
                
                // Click the bezel
                await this.page.click(bezel.selector);
                await this.page.waitForTimeout(1000); // Wait for transition
                
                const endTime = Date.now();
                const transitionTime = endTime - startTime;
                navigationResults.transition_times.push(transitionTime);
                
                // Verify navigation worked
                const currentFace = await this.page.evaluate(() => {
                    return window.vib34dDashboard?.currentFace || -1;
                });
                
                const targetIndex = faces.indexOf(bezel.target);
                if (currentFace === targetIndex) {
                    navigationResults.successful_transitions++;
                    console.log(`   ✅ Navigation successful (${transitionTime}ms)`);
                } else {
                    navigationResults.failed_transitions++;
                    console.log(`   ❌ Navigation failed: expected ${targetIndex}, got ${currentFace}`);
                }
                
                navigationResults.faces_tested++;
                
                // Capture face data
                const faceData = await this.page.evaluate((faceName) => {
                    const faceElement = document.getElementById(`face-${window.vib34dDashboard?.currentFace}`);
                    return {
                        visible: faceElement ? faceElement.style.opacity !== '0' : false,
                        cards_count: faceElement ? faceElement.querySelectorAll('.blog-card').length : 0,
                        canvases_count: faceElement ? faceElement.querySelectorAll('canvas').length : 0
                    };
                }, bezel.target);
                
                navigationResults.face_data[bezel.target] = faceData;
            }
            
        } catch (error) {
            console.error('❌ Navigation test error:', error.message);
            navigationResults.error = error.message;
        }

        this.testResults.navigation = navigationResults;
        
        const successRate = (navigationResults.successful_transitions / navigationResults.faces_tested) * 100;
        console.log(`✅ Navigation success rate: ${successRate.toFixed(1)}%`);
        
        return successRate >= 75; // 75% success rate minimum
    }

    async testPerformance() {
        console.log('\n⚡ Testing performance...');
        
        // Measure page load performance
        const performanceData = await this.page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const resources = performance.getEntriesByType('resource');
            
            return {
                page_load_time: navigation.loadEventEnd - navigation.navigationStart,
                dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
                first_paint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
                resource_count: resources.length,
                total_resource_size: resources.reduce((total, resource) => total + (resource.transferSize || 0), 0),
                js_resources: resources.filter(r => r.name.endsWith('.js')).length,
                css_resources: resources.filter(r => r.name.endsWith('.css')).length,
                canvas_elements: document.querySelectorAll('canvas').length
            };
        });

        // Test frame rate
        const frameRateData = await this.page.evaluate(() => {
            return new Promise((resolve) => {
                let frameCount = 0;
                const startTime = performance.now();
                const duration = 2000; // Test for 2 seconds

                function countFrame() {
                    frameCount++;
                    const elapsed = performance.now() - startTime;
                    
                    if (elapsed < duration) {
                        requestAnimationFrame(countFrame);
                    } else {
                        const fps = (frameCount / elapsed) * 1000;
                        resolve({
                            fps: Math.round(fps),
                            frame_count: frameCount,
                            test_duration: elapsed
                        });
                    }
                }
                
                requestAnimationFrame(countFrame);
            });
        });

        this.testResults.performance = {
            ...performanceData,
            ...frameRateData,
            memory_usage: await this.page.evaluate(() => {
                return performance.memory ? {
                    used_js_heap_size: performance.memory.usedJSHeapSize,
                    total_js_heap_size: performance.memory.totalJSHeapSize,
                    js_heap_size_limit: performance.memory.jsHeapSizeLimit
                } : null;
            })
        };

        console.log(`✅ Page load time: ${performanceData.page_load_time.toFixed(0)}ms`);
        console.log(`✅ Frame rate: ${frameRateData.fps} FPS`);
        console.log(`✅ Canvas elements: ${performanceData.canvas_elements}`);

        return frameRateData.fps >= 30; // Minimum 30 FPS
    }

    async testJSONConfiguration() {
        console.log('\n⚙️ Testing JSON configuration system...');
        
        const configResults = await this.page.evaluate(async () => {
            const results = {
                config_files_loaded: 0,
                total_config_files: 3,
                configurations: {}
            };

            // Test config API
            try {
                const response = await fetch('/api/config');
                if (response.ok) {
                    const configData = await response.json();
                    results.configurations = configData;
                    results.config_files_loaded = Object.keys(configData).filter(key => !configData[key].error).length;
                }
            } catch (error) {
                results.error = error.message;
            }

            return results;
        });

        this.testResults.configuration = configResults;

        console.log(`✅ Configuration files loaded: ${configResults.config_files_loaded}/${configResults.total_config_files}`);
        
        return configResults.config_files_loaded >= 2; // At least 2 config files should load
    }

    async takeScreenshots() {
        console.log('\n📸 Taking system screenshots...');
        
        const screenshots = [];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        try {
            // Main dashboard screenshot
            const mainScreenshot = `vib34d_production_test_${timestamp}_main.png`;
            await this.page.screenshot({ 
                path: mainScreenshot,
                fullPage: true
            });
            screenshots.push(mainScreenshot);
            console.log(`   📷 Main dashboard: ${mainScreenshot}`);
            
            // Test different faces
            const faces = ['tech', 'media', 'audio', 'quantum'];
            for (const face of faces) {
                try {
                    await this.page.click(`.nav-bezel[data-target="${face}"]`);
                    await this.page.waitForTimeout(1000);
                    
                    const faceScreenshot = `vib34d_production_test_${timestamp}_${face}.png`;
                    await this.page.screenshot({ 
                        path: faceScreenshot,
                        fullPage: true
                    });
                    screenshots.push(faceScreenshot);
                    console.log(`   📷 ${face} face: ${faceScreenshot}`);
                } catch (error) {
                    console.warn(`   ⚠️ Could not screenshot ${face} face: ${error.message}`);
                }
            }
            
        } catch (error) {
            console.error('❌ Screenshot error:', error.message);
        }
        
        return screenshots;
    }

    async generateReport() {
        console.log('\n📋 Generating comprehensive test report...');
        
        // Calculate summary
        const summary = {
            overall_score: 0,
            tests_passed: 0,
            total_tests: 6,
            recommendations: []
        };

        // Score individual tests
        if (this.testResults.server.status === 'running') summary.tests_passed++;
        if (this.testResults.webgl.supported) summary.tests_passed++;
        if (this.testResults.visualizers.total_canvases >= 30) summary.tests_passed++;
        if (this.testResults.navigation.successful_transitions >= 3) summary.tests_passed++;
        if (this.testResults.performance.fps >= 30) summary.tests_passed++;
        if (this.testResults.configuration.config_files_loaded >= 2) summary.tests_passed++;

        summary.overall_score = (summary.tests_passed / summary.total_tests) * 100;

        // Add recommendations
        if (!this.testResults.webgl.supported) {
            summary.recommendations.push('Enable WebGL in browser settings');
        }
        if (this.testResults.performance.fps < 60) {
            summary.recommendations.push('Consider hardware acceleration for better performance');
        }
        if (this.testResults.navigation.failed_transitions > 0) {
            summary.recommendations.push('Check hypercube navigation timing and event handlers');
        }

        this.testResults.summary = summary;

        // Save report
        const reportPath = `vib34d_production_test_report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        await fs.writeFile(reportPath, JSON.stringify(this.testResults, null, 2));
        
        console.log('\n🎯 TEST SUMMARY');
        console.log('================');
        console.log(`Overall Score: ${summary.overall_score.toFixed(1)}%`);
        console.log(`Tests Passed: ${summary.tests_passed}/${summary.total_tests}`);
        console.log(`Report saved: ${reportPath}`);
        
        if (summary.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            summary.recommendations.forEach(rec => console.log(`   • ${rec}`));
        }

        return reportPath;
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up test environment...');
        
        if (this.page) {
            await this.page.close();
        }
        
        if (this.browser) {
            await this.browser.close();
        }
        
        if (this.serverProcess) {
            this.serverProcess.kill();
            console.log('✅ Server stopped');
        }
    }

    async runCompleteTest() {
        console.log('🔮 VIB34D Professional Dashboard Production Test Suite');
        console.log('======================================================\n');
        
        try {
            // Start server and browser
            await this.startServer();
            await this.initBrowser();
            
            // Run all tests
            await this.testServerStatus();
            await this.testWebGLSupport();
            await this.testVisualizerInitialization();
            await this.testHypercubeNavigation();
            await this.testPerformance();
            await this.testJSONConfiguration();
            
            // Take screenshots
            const screenshots = await this.takeScreenshots();
            this.testResults.screenshots = screenshots;
            
            // Generate report
            const reportPath = await this.generateReport();
            
            console.log('\n🌟 Production test completed successfully!');
            console.log(`📊 Full report: ${reportPath}`);
            
            return this.testResults;
            
        } catch (error) {
            console.error('❌ Test suite error:', error);
            throw error;
        } finally {
            await this.cleanup();
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new VIB34DProductionTester();
    tester.runCompleteTest().catch(console.error);
}

module.exports = VIB34DProductionTester;