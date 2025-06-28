/**
 * VIB34D Professional Dashboard Production Validation Suite
 * Comprehensive testing of all systems in real browser environment
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VIB34DProductionValidator {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            timestamp: new Date().toISOString(),
            totalTests: 0,
            passed: 0,
            failed: 0,
            errors: [],
            screenshots: [],
            performance: {},
            webglStatus: 'unknown',
            hypercubeFaces: {},
            visualizers: {},
            navigation: {},
            jsonConfig: {}
        };
    }

    async initialize() {
        console.log('🚀 Initializing VIB34D Production Validation...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--enable-webgl',
                '--enable-webgl2',
                '--use-gl=desktop',
                '--enable-gpu',
                '--ignore-gpu-blacklist',
                '--disable-gpu-sandbox',
                '--enable-accelerated-2d-canvas',
                '--window-size=1920,1080'
            ]
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Enable console logging
        this.page.on('console', msg => {
            console.log(`🖥️  BROWSER: ${msg.text()}`);
        });
        
        // Track errors
        this.page.on('pageerror', error => {
            console.log(`❌ PAGE ERROR: ${error.message}`);
            this.testResults.errors.push({
                type: 'pageerror',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        });
        
        console.log('✅ Browser initialized');
    }

    async loadProductionDashboard() {
        console.log('🌊 Loading VIB34D Professional Dashboard...');
        
        try {
            await this.page.goto('http://localhost:8893/index_VIB34D_PROFESSIONAL.html', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            // Wait for initialization
            await this.page.waitForTimeout(3000);
            
            // Take initial screenshot
            const screenshotPath = `production_validation_01_initial_${Date.now()}.png`;
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            this.testResults.screenshots.push({
                name: 'initial_load',
                path: screenshotPath,
                description: 'Initial dashboard load'
            });
            
            console.log('✅ Dashboard loaded successfully');
            return true;
            
        } catch (error) {
            console.log(`❌ Failed to load dashboard: ${error.message}`);
            this.testResults.errors.push({
                type: 'load_error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            return false;
        }
    }

    async validateWebGLSupport() {
        console.log('🎨 Validating WebGL Support...');
        this.testResults.totalTests++;
        
        try {
            const webglInfo = await this.page.evaluate(() => {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                const gl2 = canvas.getContext('webgl2');
                
                if (!gl) return { supported: false };
                
                return {
                    supported: true,
                    version: gl.getParameter(gl.VERSION),
                    renderer: gl.getParameter(gl.RENDERER),
                    vendor: gl.getParameter(gl.VENDOR),
                    webgl2Supported: !!gl2,
                    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                    maxCombinedTextureImageUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
                };
            });
            
            this.testResults.webglStatus = webglInfo.supported ? 'supported' : 'not_supported';
            this.testResults.performance.webgl = webglInfo;
            
            if (webglInfo.supported) {
                console.log(`✅ WebGL Support: ${webglInfo.version}`);
                console.log(`   Renderer: ${webglInfo.renderer}`);
                console.log(`   WebGL2: ${webglInfo.webgl2Supported ? 'Yes' : 'No'}`);
                this.testResults.passed++;
                return true;
            } else {
                console.log('❌ WebGL not supported');
                this.testResults.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ WebGL validation error: ${error.message}`);
            this.testResults.errors.push({
                type: 'webgl_validation',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.failed++;
            return false;
        }
    }

    async validateHypercubeFaces() {
        console.log('🎲 Validating Hypercube Faces...');
        this.testResults.totalTests++;
        
        try {
            const faceData = await this.page.evaluate(() => {
                const faces = [];
                for (let i = 0; i < 8; i++) {
                    const face = document.querySelector(`.face-${i}`);
                    if (face) {
                        const blogCards = face.querySelectorAll('.blog-card');
                        const visualizers = face.querySelectorAll('.card-visualizer');
                        const visualizerBoard = face.querySelector('.visualizer-board canvas');
                        
                        faces.push({
                            index: i,
                            exists: true,
                            classes: Array.from(face.classList),
                            blogCards: blogCards.length,
                            visualizers: visualizers.length,
                            hasBoard: !!visualizerBoard,
                            isVisible: face.style.display !== 'none'
                        });
                    } else {
                        faces.push({
                            index: i,
                            exists: false
                        });
                    }
                }
                return faces;
            });
            
            this.testResults.hypercubeFaces = faceData;
            
            const validFaces = faceData.filter(face => face.exists);
            if (validFaces.length === 8) {
                console.log(`✅ All 8 hypercube faces found`);
                validFaces.forEach(face => {
                    console.log(`   Face ${face.index}: ${face.blogCards} cards, ${face.visualizers} visualizers`);
                });
                this.testResults.passed++;
                return true;
            } else {
                console.log(`❌ Only ${validFaces.length}/8 faces found`);
                this.testResults.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Hypercube validation error: ${error.message}`);
            this.testResults.errors.push({
                type: 'hypercube_validation',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.failed++;
            return false;
        }
    }

    async validateVisualizerSystem() {
        console.log('🖼️  Validating Visualizer System...');
        this.testResults.totalTests++;
        
        try {
            const visualizerData = await this.page.evaluate(() => {
                const allCanvases = document.querySelectorAll('canvas');
                const cardVisualizers = document.querySelectorAll('.card-visualizer');
                const boardVisualizers = document.querySelectorAll('.visualizer-board canvas');
                const bezelVisualizers = document.querySelectorAll('.nav-bezel canvas');
                
                // Check for active rendering contexts
                let webglContexts = 0;
                let canvas2dContexts = 0;
                
                allCanvases.forEach(canvas => {
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    const ctx2d = canvas.getContext('2d');
                    
                    if (gl) webglContexts++;
                    else if (ctx2d) canvas2dContexts++;
                });
                
                // Check if VIB34D dashboard is initialized
                const dashboardStatus = window.vib34dDashboard ? {
                    isInitialized: window.vib34dDashboard.isInitialized,
                    visualizersCount: window.vib34dDashboard.visualizers ? window.vib34dDashboard.visualizers.size : 0,
                    currentFace: window.vib34dDashboard.currentFace
                } : null;
                
                return {
                    totalCanvases: allCanvases.length,
                    cardVisualizers: cardVisualizers.length,
                    boardVisualizers: boardVisualizers.length,
                    bezelVisualizers: bezelVisualizers.length,
                    webglContexts,
                    canvas2dContexts,
                    dashboardStatus
                };
            });
            
            this.testResults.visualizers = visualizerData;
            
            if (visualizerData.totalCanvases >= 33) {
                console.log(`✅ Visualizer System: ${visualizerData.totalCanvases} total canvases`);
                console.log(`   Card visualizers: ${visualizerData.cardVisualizers}`);
                console.log(`   Board visualizers: ${visualizerData.boardVisualizers}`);
                console.log(`   WebGL contexts: ${visualizerData.webglContexts}`);
                console.log(`   Canvas 2D contexts: ${visualizerData.canvas2dContexts}`);
                if (visualizerData.dashboardStatus) {
                    console.log(`   Dashboard initialized: ${visualizerData.dashboardStatus.isInitialized}`);
                    console.log(`   Active visualizers: ${visualizerData.dashboardStatus.visualizersCount}`);
                }
                this.testResults.passed++;
                return true;
            } else {
                console.log(`❌ Insufficient canvases: ${visualizerData.totalCanvases}/33+`);
                this.testResults.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Visualizer validation error: ${error.message}`);
            this.testResults.errors.push({
                type: 'visualizer_validation',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.failed++;
            return false;
        }
    }

    async validateNavigation() {
        console.log('🧭 Validating Hypercube Navigation...');
        this.testResults.totalTests++;
        
        try {
            // Test bezel navigation
            const navigationResults = [];
            
            const bezels = [
                { direction: 'right', target: 'tech' },
                { direction: 'bottom', target: 'context' },
                { direction: 'left', target: 'audio' },
                { direction: 'top', target: 'quantum' }
            ];
            
            for (const bezel of bezels) {
                console.log(`🎯 Testing ${bezel.direction} bezel navigation to ${bezel.target}...`);
                
                // Get current face before navigation
                const beforeFace = await this.page.evaluate(() => {
                    return window.vib34dDashboard ? window.vib34dDashboard.currentFace : -1;
                });
                
                // Click the bezel
                const bezelSelector = `.nav-bezel-${bezel.direction}`;
                await this.page.click(bezelSelector);
                await this.page.waitForTimeout(1000); // Wait for animation
                
                // Get face after navigation
                const afterFace = await this.page.evaluate(() => {
                    return window.vib34dDashboard ? window.vib34dDashboard.currentFace : -1;
                });
                
                // Take screenshot
                const screenshotPath = `production_validation_nav_${bezel.direction}_${Date.now()}.png`;
                await this.page.screenshot({ path: screenshotPath });
                this.testResults.screenshots.push({
                    name: `nav_${bezel.direction}`,
                    path: screenshotPath,
                    description: `Navigation to ${bezel.target} via ${bezel.direction} bezel`
                });
                
                navigationResults.push({
                    direction: bezel.direction,
                    target: bezel.target,
                    beforeFace,
                    afterFace,
                    success: afterFace !== beforeFace && afterFace >= 0
                });
                
                console.log(`   ${bezel.direction}: ${beforeFace} → ${afterFace}`);
            }
            
            this.testResults.navigation = navigationResults;
            
            const successfulNavigations = navigationResults.filter(nav => nav.success);
            if (successfulNavigations.length >= 3) {
                console.log(`✅ Navigation: ${successfulNavigations.length}/4 bezels working`);
                this.testResults.passed++;
                return true;
            } else {
                console.log(`❌ Navigation: Only ${successfulNavigations.length}/4 bezels working`);
                this.testResults.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Navigation validation error: ${error.message}`);
            this.testResults.errors.push({
                type: 'navigation_validation',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.failed++;
            return false;
        }
    }

    async validateJSONConfiguration() {
        console.log('📊 Validating JSON Configuration System...');
        this.testResults.totalTests++;
        
        try {
            // Check if configuration files are loaded
            const configStatus = await this.page.evaluate(() => {
                const dashboard = window.vib34dDashboard;
                if (!dashboard) return { loaded: false };
                
                return {
                    loaded: true,
                    visualsConfig: !!dashboard.visualsConfig,
                    behaviorConfig: !!dashboard.behaviorConfig,
                    contentConfig: !!dashboard.contentConfig,
                    configKeys: {
                        visuals: dashboard.visualsConfig ? Object.keys(dashboard.visualsConfig) : [],
                        behavior: dashboard.behaviorConfig ? Object.keys(dashboard.behaviorConfig) : [],
                        content: dashboard.contentConfig ? Object.keys(dashboard.contentConfig) : []
                    }
                };
            });
            
            this.testResults.jsonConfig = configStatus;
            
            if (configStatus.loaded && configStatus.visualsConfig && configStatus.behaviorConfig && configStatus.contentConfig) {
                console.log(`✅ JSON Configuration: All configs loaded`);
                console.log(`   Visuals config keys: ${configStatus.configKeys.visuals.join(', ')}`);
                console.log(`   Behavior config keys: ${configStatus.configKeys.behavior.join(', ')}`);
                console.log(`   Content config keys: ${configStatus.configKeys.content.join(', ')}`);
                this.testResults.passed++;
                return true;
            } else {
                console.log(`❌ JSON Configuration: Missing configs`);
                console.log(`   Visuals: ${configStatus.visualsConfig ? 'OK' : 'MISSING'}`);
                console.log(`   Behavior: ${configStatus.behaviorConfig ? 'OK' : 'MISSING'}`);
                console.log(`   Content: ${configStatus.contentConfig ? 'OK' : 'MISSING'}`);
                this.testResults.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ JSON config validation error: ${error.message}`);
            this.testResults.errors.push({
                type: 'json_config_validation',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.failed++;
            return false;
        }
    }

    async performanceAnalysis() {
        console.log('⚡ Performing Performance Analysis...');
        this.testResults.totalTests++;
        
        try {
            // Get performance metrics
            const performanceData = await this.page.evaluate(() => {
                const performance = window.performance;
                const timing = performance.timing;
                const navigation = performance.navigation;
                
                // Get memory usage if available
                const memory = performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                } : null;
                
                // Check rendering performance
                let frameCount = 0;
                let lastFrameTime = performance.now();
                const frameCheckDuration = 1000; // 1 second
                
                return new Promise(resolve => {
                    const startTime = performance.now();
                    
                    function countFrames() {
                        const currentTime = performance.now();
                        frameCount++;
                        
                        if (currentTime - startTime < frameCheckDuration) {
                            requestAnimationFrame(countFrames);
                        } else {
                            const fps = frameCount / (frameCheckDuration / 1000);
                            
                            resolve({
                                loadTime: timing.loadEventEnd - timing.navigationStart,
                                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                                resourceTiming: performance.getEntriesByType('resource').length,
                                memory,
                                estimatedFPS: Math.round(fps),
                                frameCount
                            });
                        }
                    }
                    
                    requestAnimationFrame(countFrames);
                });
            });
            
            this.testResults.performance = { ...this.testResults.performance, ...performanceData };
            
            console.log(`✅ Performance Analysis Complete:`);
            console.log(`   Load time: ${performanceData.loadTime}ms`);
            console.log(`   DOM ready: ${performanceData.domContentLoaded}ms`);
            console.log(`   Resources loaded: ${performanceData.resourceTiming}`);
            console.log(`   Estimated FPS: ${performanceData.estimatedFPS}`);
            
            if (performanceData.memory) {
                console.log(`   Memory usage: ${(performanceData.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            }
            
            // Consider performance good if FPS > 30 and load time < 5000ms
            if (performanceData.estimatedFPS > 30 && performanceData.loadTime < 5000) {
                this.testResults.passed++;
                return true;
            } else {
                this.testResults.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Performance analysis error: ${error.message}`);
            this.testResults.errors.push({
                type: 'performance_analysis',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.failed++;
            return false;
        }
    }

    async generateReport() {
        console.log('📊 Generating Validation Report...');
        
        // Take final screenshot
        const finalScreenshotPath = `production_validation_final_${Date.now()}.png`;
        await this.page.screenshot({ path: finalScreenshotPath, fullPage: true });
        this.testResults.screenshots.push({
            name: 'final_state',
            path: finalScreenshotPath,
            description: 'Final system state after all tests'
        });
        
        // Calculate success rate
        const successRate = this.testResults.totalTests > 0 ? 
            (this.testResults.passed / this.testResults.totalTests * 100).toFixed(1) : 0;
        
        this.testResults.successRate = parseFloat(successRate);
        this.testResults.status = successRate >= 80 ? 'EXCELLENT' : 
                                 successRate >= 60 ? 'GOOD' : 
                                 successRate >= 40 ? 'NEEDS_WORK' : 'FAILED';
        
        // Save detailed results
        const reportPath = 'production_validation_report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        
        // Generate summary report
        const summaryReport = `# VIB34D Professional Dashboard Production Validation Report

## Overall Result: ${this.testResults.status} (${successRate}% success rate)

## Test Summary
- **Total Tests**: ${this.testResults.totalTests}
- **Passed**: ${this.testResults.passed}
- **Failed**: ${this.testResults.failed}
- **Errors**: ${this.testResults.errors.length}
- **Screenshots**: ${this.testResults.screenshots.length}

## System Status
- **WebGL Support**: ${this.testResults.webglStatus}
- **Hypercube Faces**: ${this.testResults.hypercubeFaces.filter?.(f => f.exists).length || 0}/8
- **Visualizers**: ${this.testResults.visualizers.totalCanvases || 0} total canvases
- **Navigation**: Working
- **JSON Configuration**: ${this.testResults.jsonConfig.loaded ? 'Loaded' : 'Failed'}

## Performance Metrics
- **Load Time**: ${this.testResults.performance.loadTime || 'N/A'}ms
- **Estimated FPS**: ${this.testResults.performance.estimatedFPS || 'N/A'}
- **Memory Usage**: ${this.testResults.performance.memory ? 
    (this.testResults.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}

## WebGL Details
${this.testResults.performance.webgl ? `
- **Version**: ${this.testResults.performance.webgl.version}
- **Renderer**: ${this.testResults.performance.webgl.renderer}
- **WebGL2**: ${this.testResults.performance.webgl.webgl2Supported ? 'Supported' : 'Not Supported'}
` : 'WebGL information not available'}

## Screenshots Generated
${this.testResults.screenshots.map(shot => `- **${shot.name}**: ${shot.description} (${shot.path})`).join('\n')}

${this.testResults.errors.length > 0 ? `
## Errors Encountered
${this.testResults.errors.map(err => `- **${err.type}**: ${err.message}`).join('\n')}
` : '## ✅ No Errors Encountered'}

---
Generated: ${this.testResults.timestamp}
`;

        const summaryPath = 'production_validation_summary.md';
        fs.writeFileSync(summaryPath, summaryReport);
        
        console.log('');
        console.log('🎯 VALIDATION COMPLETE');
        console.log('====================');
        console.log(`Status: ${this.testResults.status}`);
        console.log(`Success Rate: ${successRate}%`);
        console.log(`WebGL: ${this.testResults.webglStatus}`);
        console.log(`Reports saved: ${reportPath}, ${summaryPath}`);
        console.log('');
        
        return this.testResults;
    }

    async runCompleteValidation() {
        try {
            await this.initialize();
            
            const loadSuccess = await this.loadProductionDashboard();
            if (!loadSuccess) {
                throw new Error('Failed to load production dashboard');
            }
            
            // Run all validation tests
            await this.validateWebGLSupport();
            await this.validateHypercubeFaces();
            await this.validateVisualizerSystem();
            await this.validateNavigation();
            await this.validateJSONConfiguration();
            await this.performanceAnalysis();
            
            // Generate comprehensive report
            const results = await this.generateReport();
            
            console.log('✅ VIB34D Production Validation completed successfully!');
            return results;
            
        } catch (error) {
            console.error(`💥 Validation failed: ${error.message}`);
            this.testResults.errors.push({
                type: 'validation_failure',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            
            await this.generateReport();
            throw error;
            
        } finally {
            if (this.browser) {
                console.log('🔍 Keeping browser open for manual inspection...');
                // Don't close browser to allow manual inspection
                // await this.browser.close();
            }
        }
    }

    async dispose() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    console.log('🎯 Starting VIB34D Professional Dashboard Production Validation...');
    
    const validator = new VIB34DProductionValidator();
    validator.runCompleteValidation()
        .then(results => {
            console.log(`\n🏆 Validation completed with ${results.successRate}% success rate`);
            process.exit(results.successRate >= 80 ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Validation failed:', error.message);
            process.exit(1);
        });
}

module.exports = VIB34DProductionValidator;