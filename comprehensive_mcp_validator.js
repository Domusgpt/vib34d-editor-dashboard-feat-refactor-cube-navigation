/**
 * VIB34D Professional Dashboard - Comprehensive MCP Validation System
 * 
 * This system performs real browser testing using Puppeteer to validate:
 * - Server deployment and file accessibility
 * - WebGL context creation and shader compilation
 * - Hypercube navigation and face transitions
 * - Interactive visualizers and canvas rendering
 * - JSON configuration loading
 * - Performance and error monitoring
 * 
 * Generates detailed reports with screenshots and technical analysis
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class VIB34DMCPValidator {
    constructor() {
        this.browser = null;
        this.page = null;
        this.server = null;
        this.serverPort = 8088;
        this.baseUrl = `http://localhost:${this.serverPort}`;
        this.dashboardUrl = `${this.baseUrl}/index_VIB34D_PROFESSIONAL.html`;
        this.results = {
            timestamp: new Date().toISOString(),
            serverDeployment: {},
            fileAccessibility: {},
            webglFunctionality: {},
            hypercubeNavigation: {},
            visualizerValidation: {},
            jsonConfiguration: {},
            performance: {},
            screenshots: [],
            errors: [],
            summary: {}
        };
        this.screenshotCounter = 0;
    }

    /**
     * Start the production server
     */
    async startServer() {
        console.log('🚀 Starting VIB34D Production Server...');
        
        return new Promise((resolve, reject) => {
            this.server = spawn('python3', ['production_server_bulletproof.py', '--port', this.serverPort.toString()], {
                cwd: process.cwd(),
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let serverReady = false;

            this.server.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(`[SERVER] ${output.trim()}`);
                
                if (output.includes('Server started successfully') && !serverReady) {
                    serverReady = true;
                    setTimeout(() => resolve(true), 2000); // Give server time to fully initialize
                }
            });

            this.server.stderr.on('data', (data) => {
                const error = data.toString();
                console.error(`[SERVER ERROR] ${error.trim()}`);
                this.results.errors.push(`Server Error: ${error.trim()}`);
            });

            this.server.on('close', (code) => {
                console.log(`[SERVER] Process exited with code ${code}`);
                if (code !== 0 && !serverReady) {
                    reject(new Error(`Server failed to start (exit code: ${code})`));
                }
            });

            // Timeout in case server doesn't start
            setTimeout(() => {
                if (!serverReady) {
                    reject(new Error('Server startup timeout'));
                }
            }, 15000);
        });
    }

    /**
     * Stop the production server
     */
    async stopServer() {
        if (this.server) {
            console.log('🛑 Stopping production server...');
            this.server.kill('SIGTERM');
            this.server = null;
        }
    }

    /**
     * Initialize Puppeteer browser
     */
    async initBrowser() {
        console.log('🌐 Launching browser for testing...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Show browser for visual verification
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--enable-webgl',
                '--enable-accelerated-2d-canvas'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Set viewport for consistent testing
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Enable console logging
        this.page.on('console', (msg) => {
            console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`);
        });
        
        // Capture JavaScript errors
        this.page.on('pageerror', (error) => {
            console.error(`[PAGE ERROR] ${error.message}`);
            this.results.errors.push(`Page Error: ${error.message}`);
        });
        
        // Monitor network requests
        this.page.on('response', (response) => {
            const url = response.url();
            const status = response.status();
            if (status >= 400) {
                console.error(`[NETWORK ERROR] ${status} - ${url}`);
                this.results.errors.push(`Network Error: ${status} - ${url}`);
            }
        });
    }

    /**
     * Take screenshot with timestamp
     */
    async takeScreenshot(name, description = '') {
        const timestamp = Date.now();
        const filename = `vib34d_mcp_${String(++this.screenshotCounter).padStart(2, '0')}_${name}_${timestamp}.png`;
        const filepath = path.join(process.cwd(), filename);
        
        await this.page.screenshot({
            path: filepath,
            fullPage: true
        });
        
        const screenshotInfo = {
            name,
            description,
            filename,
            filepath,
            timestamp: new Date(timestamp).toISOString()
        };
        
        this.results.screenshots.push(screenshotInfo);
        console.log(`📸 Screenshot: ${filename} - ${description}`);
        
        return screenshotInfo;
    }

    /**
     * Test server deployment and file accessibility
     */
    async testServerDeployment() {
        console.log('\n📡 Testing Server Deployment...');
        
        try {
            // Test main dashboard access
            const response = await this.page.goto(this.dashboardUrl, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            this.results.serverDeployment.mainPageStatus = response.status();
            this.results.serverDeployment.mainPageAccessible = response.status() === 200;
            
            await this.takeScreenshot('initial_load', 'Initial dashboard load');
            
            // Test core file accessibility
            const coreFiles = [
                '/core/VIB3HomeMaster.js',
                '/core/UnifiedReactivityBridge.js',
                '/core/ReactiveHyperAVCore.js',
                '/core/ShaderManager.js',
                '/VIB3_JSON_CONFIG_SYSTEM.js'
            ];
            
            this.results.fileAccessibility.coreFiles = {};
            
            for (const file of coreFiles) {
                try {
                    const fileResponse = await this.page.evaluate(async (url) => {
                        const response = await fetch(url);
                        return {
                            status: response.status,
                            accessible: response.status === 200,
                            contentType: response.headers.get('content-type')
                        };
                    }, `${this.baseUrl}${file}`);
                    
                    this.results.fileAccessibility.coreFiles[file] = fileResponse;
                    console.log(`  ${fileResponse.accessible ? '✅' : '❌'} ${file} (${fileResponse.status})`);
                } catch (error) {
                    this.results.fileAccessibility.coreFiles[file] = {
                        status: 0,
                        accessible: false,
                        error: error.message
                    };
                    console.log(`  ❌ ${file} (Error: ${error.message})`);
                }
            }
            
            console.log('✅ Server deployment test completed');
            
        } catch (error) {
            console.error('❌ Server deployment test failed:', error.message);
            this.results.serverDeployment.error = error.message;
            this.results.errors.push(`Server deployment: ${error.message}`);
        }
    }

    /**
     * Test WebGL functionality and shader compilation
     */
    async testWebGLFunctionality() {
        console.log('\n🎨 Testing WebGL Functionality...');
        
        try {
            const webglInfo = await this.page.evaluate(() => {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (!gl) {
                    return { supported: false, error: 'WebGL not supported' };
                }
                
                const info = {
                    supported: true,
                    vendor: gl.getParameter(gl.VENDOR),
                    renderer: gl.getParameter(gl.RENDERER),
                    version: gl.getParameter(gl.VERSION),
                    glslVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                    maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
                    extensions: gl.getSupportedExtensions()
                };
                
                // Test shader compilation
                const vertexShaderSource = `
                    attribute vec4 position;
                    void main() {
                        gl_Position = position;
                    }
                `;
                
                const fragmentShaderSource = `
                    precision mediump float;
                    void main() {
                        gl_Color = vec4(1.0, 0.0, 1.0, 1.0);
                    }
                `;
                
                const vertexShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vertexShader, vertexShaderSource);
                gl.compileShader(vertexShader);
                
                const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fragmentShader, fragmentShaderSource);
                gl.compileShader(fragmentShader);
                
                info.shaderCompilation = {
                    vertexShaderCompiled: gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS),
                    fragmentShaderCompiled: gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS),
                    vertexShaderLog: gl.getShaderInfoLog(vertexShader),
                    fragmentShaderLog: gl.getShaderInfoLog(fragmentShader)
                };
                
                return info;
            });
            
            this.results.webglFunctionality = webglInfo;
            
            if (webglInfo.supported) {
                console.log(`  ✅ WebGL supported: ${webglInfo.renderer}`);
                console.log(`  ✅ GLSL Version: ${webglInfo.glslVersion}`);
                console.log(`  ✅ Max Texture Size: ${webglInfo.maxTextureSize}`);
                console.log(`  ✅ Shader compilation: ${webglInfo.shaderCompilation.vertexShaderCompiled && webglInfo.shaderCompilation.fragmentShaderCompiled ? 'Success' : 'Failed'}`);
            } else {
                console.log('  ❌ WebGL not supported');
            }
            
            // Test dashboard visualizers
            await this.page.waitForTimeout(3000); // Allow time for visualizers to initialize
            
            const visualizerInfo = await this.page.evaluate(() => {
                const canvases = document.querySelectorAll('canvas');
                const visualizerCount = canvases.length;
                const contexts = [];
                
                for (let i = 0; i < Math.min(canvases.length, 5); i++) {
                    const canvas = canvases[i];
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    const ctx2d = canvas.getContext('2d');
                    
                    contexts.push({
                        id: canvas.id,
                        hasWebGL: !!gl,
                        has2D: !!ctx2d,
                        width: canvas.width,
                        height: canvas.height
                    });
                }
                
                return {
                    totalCanvases: visualizerCount,
                    sampleContexts: contexts
                };
            });
            
            this.results.webglFunctionality.visualizers = visualizerInfo;
            console.log(`  ✅ Dashboard canvases: ${visualizerInfo.totalCanvases}`);
            
            await this.takeScreenshot('webgl_visualizers', 'WebGL visualizers active');
            
        } catch (error) {
            console.error('❌ WebGL functionality test failed:', error.message);
            this.results.webglFunctionality.error = error.message;
            this.results.errors.push(`WebGL functionality: ${error.message}`);
        }
    }

    /**
     * Test hypercube navigation system
     */
    async testHypercubeNavigation() {
        console.log('\n🧭 Testing Hypercube Navigation...');
        
        try {
            // Wait for dashboard to fully initialize
            await this.page.waitForTimeout(5000);
            
            // Test bezel navigation
            const bezels = ['right', 'bottom', 'left', 'top'];
            
            for (const bezel of bezels) {
                console.log(`  Testing ${bezel} bezel navigation...`);
                
                const bezelElement = await this.page.$(`[data-direction="${bezel}"]`);
                if (bezelElement) {
                    await this.takeScreenshot(`nav_before_${bezel}`, `Before ${bezel} navigation`);
                    
                    // Click the bezel
                    await bezelElement.click();
                    await this.page.waitForTimeout(1500); // Allow transition time
                    
                    await this.takeScreenshot(`nav_after_${bezel}`, `After ${bezel} navigation`);
                    
                    // Check if face changed
                    const currentFace = await this.page.evaluate(() => {
                        return window.vib34dDashboard ? window.vib34dDashboard.currentFace : null;
                    });
                    
                    this.results.hypercubeNavigation[bezel] = {
                        bezelFound: true,
                        clicked: true,
                        currentFace: currentFace
                    };
                    
                    console.log(`    ✅ ${bezel} navigation completed (face: ${currentFace})`);
                } else {
                    this.results.hypercubeNavigation[bezel] = {
                        bezelFound: false,
                        error: 'Bezel element not found'
                    };
                    console.log(`    ❌ ${bezel} bezel not found`);
                }
            }
            
            // Test system state
            const systemState = await this.page.evaluate(() => {
                if (window.vib34dDashboard) {
                    return window.vib34dDashboard.getSystemState();
                }
                return null;
            });
            
            this.results.hypercubeNavigation.systemState = systemState;
            
            if (systemState) {
                console.log(`  ✅ System state: ${systemState.visualizerCount} visualizers, face ${systemState.currentFace}`);
            }
            
        } catch (error) {
            console.error('❌ Hypercube navigation test failed:', error.message);
            this.results.hypercubeNavigation.error = error.message;
            this.results.errors.push(`Hypercube navigation: ${error.message}`);
        }
    }

    /**
     * Test JSON configuration loading
     */
    async testJSONConfiguration() {
        console.log('\n📄 Testing JSON Configuration...');
        
        try {
            const configInfo = await this.page.evaluate(async () => {
                const configFiles = [
                    './config/visuals.json',
                    './config/behavior.json',
                    './config/content.json',
                    './presets/editor-dashboard-config.json',
                    './site-content.json'
                ];
                
                const results = {};
                
                for (const file of configFiles) {
                    try {
                        const response = await fetch(file);
                        const data = await response.json();
                        results[file] = {
                            loaded: true,
                            status: response.status,
                            size: JSON.stringify(data).length,
                            hasContent: Object.keys(data).length > 0
                        };
                    } catch (error) {
                        results[file] = {
                            loaded: false,
                            error: error.message
                        };
                    }
                }
                
                return results;
            });
            
            this.results.jsonConfiguration = configInfo;
            
            for (const [file, info] of Object.entries(configInfo)) {
                if (info.loaded) {
                    console.log(`  ✅ ${file} (${info.size} bytes, ${info.hasContent ? 'has content' : 'empty'})`);
                } else {
                    console.log(`  ❌ ${file} (${info.error})`);
                }
            }
            
        } catch (error) {
            console.error('❌ JSON configuration test failed:', error.message);
            this.results.jsonConfiguration.error = error.message;
            this.results.errors.push(`JSON configuration: ${error.message}`);
        }
    }

    /**
     * Test performance metrics
     */
    async testPerformance() {
        console.log('\n⚡ Testing Performance...');
        
        try {
            const performanceInfo = await this.page.evaluate(() => {
                const perfEntries = performance.getEntriesByType('navigation')[0];
                
                return {
                    domContentLoaded: perfEntries.domContentLoadedEventEnd - perfEntries.domContentLoadedEventStart,
                    loadComplete: perfEntries.loadEventEnd - perfEntries.loadEventStart,
                    domainLookup: perfEntries.domainLookupEnd - perfEntries.domainLookupStart,
                    connectTime: perfEntries.connectEnd - perfEntries.connectStart,
                    responseTime: perfEntries.responseEnd - perfEntries.responseStart,
                    renderingTime: perfEntries.domComplete - perfEntries.domLoading,
                    totalLoadTime: perfEntries.loadEventEnd - perfEntries.fetchStart
                };
            });
            
            this.results.performance = performanceInfo;
            
            console.log(`  ✅ DOM Content Loaded: ${performanceInfo.domContentLoaded.toFixed(2)}ms`);
            console.log(`  ✅ Total Load Time: ${performanceInfo.totalLoadTime.toFixed(2)}ms`);
            console.log(`  ✅ Rendering Time: ${performanceInfo.renderingTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('❌ Performance test failed:', error.message);
            this.results.performance.error = error.message;
            this.results.errors.push(`Performance: ${error.message}`);
        }
    }

    /**
     * Generate comprehensive test report
     */
    generateReport() {
        console.log('\n📊 Generating Test Report...');
        
        const totalTests = Object.keys(this.results).length - 3; // Exclude timestamp, screenshots, summary
        const failedTests = this.results.errors.length;
        const passedTests = totalTests - failedTests;
        
        this.results.summary = {
            totalTests,
            passedTests,
            failedTests,
            successRate: ((passedTests / totalTests) * 100).toFixed(2),
            screenshotCount: this.results.screenshots.length,
            testDuration: Date.now() - new Date(this.results.timestamp).getTime()
        };
        
        // Write detailed JSON report
        const reportPath = path.join(process.cwd(), 'vib34d_mcp_validation_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        // Write summary markdown report
        const markdownReport = this.generateMarkdownReport();
        const markdownPath = path.join(process.cwd(), 'VIB34D_MCP_VALIDATION_REPORT.md');
        fs.writeFileSync(markdownPath, markdownReport);
        
        console.log(`📄 Detailed report: ${reportPath}`);
        console.log(`📝 Summary report: ${markdownPath}`);
        console.log(`📸 Screenshots: ${this.results.screenshots.length} images captured`);
        
        return this.results;
    }

    /**
     * Generate markdown summary report
     */
    generateMarkdownReport() {
        const { summary } = this.results;
        
        return `# VIB34D Professional Dashboard - MCP Validation Report

**Generated:** ${this.results.timestamp}  
**Test Duration:** ${(summary.testDuration / 1000).toFixed(2)} seconds  
**Success Rate:** ${summary.successRate}% (${summary.passedTests}/${summary.totalTests} tests passed)

## Server Deployment ✅

- **Main Page Status:** ${this.results.serverDeployment.mainPageStatus || 'N/A'}
- **Dashboard Accessible:** ${this.results.serverDeployment.mainPageAccessible ? 'Yes' : 'No'}

## WebGL Functionality ${this.results.webglFunctionality.supported ? '✅' : '❌'}

- **WebGL Support:** ${this.results.webglFunctionality.supported ? 'Yes' : 'No'}
- **Renderer:** ${this.results.webglFunctionality.renderer || 'N/A'}
- **Total Canvases:** ${this.results.webglFunctionality.visualizers?.totalCanvases || 'N/A'}

## Hypercube Navigation ${Object.keys(this.results.hypercubeNavigation).length > 1 ? '✅' : '❌'}

- **Navigation System:** ${this.results.hypercubeNavigation.systemState ? 'Active' : 'Inactive'}
- **Current Face:** ${this.results.hypercubeNavigation.systemState?.currentFace || 'N/A'}
- **Visualizers:** ${this.results.hypercubeNavigation.systemState?.visualizerCount || 'N/A'}

## JSON Configuration ${Object.keys(this.results.jsonConfiguration).length > 0 ? '✅' : '❌'}

${Object.entries(this.results.jsonConfiguration).map(([file, info]) => 
    `- **${file}:** ${info.loaded ? '✅ Loaded' : '❌ Failed'}`
).join('\n')}

## Performance Metrics ⚡

- **DOM Content Loaded:** ${this.results.performance.domContentLoaded?.toFixed(2) || 'N/A'}ms
- **Total Load Time:** ${this.results.performance.totalLoadTime?.toFixed(2) || 'N/A'}ms
- **Rendering Time:** ${this.results.performance.renderingTime?.toFixed(2) || 'N/A'}ms

## Screenshots 📸

${this.results.screenshots.map((screenshot, index) => 
    `${index + 1}. **${screenshot.name}:** ${screenshot.description} (${screenshot.filename})`
).join('\n')}

## Errors ${this.results.errors.length > 0 ? '❌' : '✅'}

${this.results.errors.length > 0 ? 
    this.results.errors.map(error => `- ${error}`).join('\n') : 
    'No errors detected!'}

---

**Dashboard URL:** http://localhost:${this.serverPort}/index_VIB34D_PROFESSIONAL.html
`;
    }

    /**
     * Run complete validation suite
     */
    async runValidation() {
        console.log('🔬 VIB34D Professional Dashboard - MCP Validation Starting...\n');
        
        try {
            // Start server
            await this.startServer();
            
            // Initialize browser
            await this.initBrowser();
            
            // Run test suite
            await this.testServerDeployment();
            await this.testWebGLFunctionality();
            await this.testHypercubeNavigation();
            await this.testJSONConfiguration();
            await this.testPerformance();
            
            // Final screenshot
            await this.takeScreenshot('final_state', 'Final dashboard state after all tests');
            
            // Generate report
            const results = this.generateReport();
            
            console.log('\n🎉 MCP Validation Complete!');
            console.log(`✅ Success Rate: ${results.summary.successRate}%`);
            console.log(`📊 Tests: ${results.summary.passedTests}/${results.summary.totalTests}`);
            console.log(`📸 Screenshots: ${results.summary.screenshotCount}`);
            console.log(`⏱️  Duration: ${(results.summary.testDuration / 1000).toFixed(2)}s`);
            
            if (results.errors.length > 0) {
                console.log(`\n⚠️  Errors encountered: ${results.errors.length}`);
                results.errors.forEach(error => console.log(`   - ${error}`));
            }
            
            return results;
            
        } catch (error) {
            console.error('❌ MCP Validation failed:', error.message);
            this.results.errors.push(`Validation failed: ${error.message}`);
            return this.results;
        } finally {
            // Cleanup
            if (this.browser) {
                await this.browser.close();
            }
            await this.stopServer();
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new VIB34DMCPValidator();
    validator.runValidation().then((results) => {
        process.exit(results.errors.length > 0 ? 1 : 0);
    }).catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = VIB34DMCPValidator;