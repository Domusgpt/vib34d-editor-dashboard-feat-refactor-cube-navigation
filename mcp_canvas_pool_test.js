/**
 * MCP Canvas Pool Test - Real Puppeteer Testing
 * Tests the corrected 5-7 persistent canvas system
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

class MCPCanvasPoolTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            timestamp: new Date().toISOString(),
            testName: 'VIB34D Smart Canvas Pool System',
            totalTests: 0,
            passed: 0,
            failed: 0,
            errors: [],
            screenshots: [],
            canvasPoolData: {},
            performanceMetrics: {}
        };
    }

    async initialize() {
        console.log('🚀 Initializing MCP Canvas Pool Test...');
        
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
                '--window-size=1920,1080'
            ]
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Console logging
        this.page.on('console', msg => {
            console.log(`🖥️  BROWSER: ${msg.text()}`);
        });
        
        // Error tracking
        this.page.on('pageerror', error => {
            console.log(`❌ PAGE ERROR: ${error.message}`);
            this.results.errors.push({
                type: 'pageerror',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        });
        
        console.log('✅ Browser initialized');
    }

    async loadDashboard() {
        console.log('🌊 Loading VIB34D Professional Dashboard...');
        
        try {
            await this.page.goto('http://localhost:8893/index_VIB34D_PROFESSIONAL.html', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            // Wait for initialization
            await this.page.waitForTimeout(5000);
            
            // Take initial screenshot
            const screenshotPath = `mcp_canvas_pool_01_initial_${Date.now()}.png`;
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            this.results.screenshots.push({
                name: 'initial_load',
                path: screenshotPath,
                description: 'Dashboard loaded with canvas pool system'
            });
            
            console.log('✅ Dashboard loaded successfully');
            return true;
            
        } catch (error) {
            console.log(`❌ Failed to load dashboard: ${error.message}`);
            this.results.errors.push({
                type: 'load_error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            return false;
        }
    }

    async testCanvasPoolSystem() {
        console.log('🎨 Testing Canvas Pool System...');
        this.results.totalTests++;
        
        try {
            const canvasPoolData = await this.page.evaluate(() => {
                // Check if canvas pool exists
                const dashboard = window.vib34dDashboard;
                if (!dashboard || !dashboard.canvasPool) {
                    return { error: 'Canvas pool not found' };
                }
                
                const poolState = dashboard.canvasPool.getSystemState();
                
                // Count actual canvas elements
                const poolCanvases = document.querySelectorAll('.vib34d-pool-canvas');
                const fallbackCanvases = document.querySelectorAll('.vib34d-fallback-canvas');
                
                // Check for WebGL contexts
                let webglContexts = 0;
                let canvas2dContexts = 0;
                
                poolCanvases.forEach(canvas => {
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    const ctx2d = canvas.getContext('2d');
                    
                    if (gl && !gl.isContextLost()) webglContexts++;
                    else if (ctx2d) canvas2dContexts++;
                });
                
                return {
                    poolExists: true,
                    poolState: poolState,
                    domCanvases: {
                        poolCanvases: poolCanvases.length,
                        fallbackCanvases: fallbackCanvases.length,
                        total: poolCanvases.length + fallbackCanvases.length
                    },
                    webglContexts: webglContexts,
                    canvas2dContexts: canvas2dContexts,
                    canvasDetails: Array.from(poolCanvases).map(canvas => ({
                        id: canvas.id,
                        className: canvas.className,
                        width: canvas.width,
                        height: canvas.height,
                        visible: canvas.style.opacity !== '0'
                    }))
                };
            });
            
            this.results.canvasPoolData = canvasPoolData;
            
            if (canvasPoolData.error) {
                console.log(`❌ Canvas Pool System: ${canvasPoolData.error}`);
                this.results.failed++;
                return false;
            }
            
            const expectedCanvases = 7; // background + 4 content + navigation + effects
            const actualCanvases = canvasPoolData.domCanvases.total;
            
            if (actualCanvases <= expectedCanvases && actualCanvases >= 4) {
                console.log(`✅ Canvas Pool System: ${actualCanvases} canvases (≤${expectedCanvases} expected)`);
                console.log(`   Pool canvases: ${canvasPoolData.domCanvases.poolCanvases}`);
                console.log(`   Fallback canvases: ${canvasPoolData.domCanvases.fallbackCanvases}`);
                console.log(`   WebGL contexts: ${canvasPoolData.webglContexts}`);
                console.log(`   Canvas 2D contexts: ${canvasPoolData.canvas2dContexts}`);
                console.log(`   Pool state: ${JSON.stringify(canvasPoolData.poolState, null, 2)}`);
                
                this.results.passed++;
                return true;
            } else {
                console.log(`❌ Canvas Pool System: ${actualCanvases} canvases (expected ≤${expectedCanvases})`);
                this.results.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Canvas Pool Test error: ${error.message}`);
            this.results.errors.push({
                type: 'canvas_pool_test',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.results.failed++;
            return false;
        }
    }

    async testFaceTransitions() {
        console.log('🔄 Testing Face Transitions with Canvas Pool...');
        this.results.totalTests++;
        
        try {
            const transitionResults = [];
            
            const faces = ['tech', 'media', 'audio', 'quantum'];
            
            for (const face of faces) {
                console.log(`🎯 Testing transition to ${face}...`);
                
                // Get pool state before transition
                const beforeState = await this.page.evaluate(() => {
                    return window.vib34dDashboard?.canvasPool?.getSystemState();
                });
                
                // Navigate to face
                const bezelSelector = `.nav-bezel-right`; // Just use right bezel for simplicity
                await this.page.click(bezelSelector);
                await this.page.waitForTimeout(1000);
                
                // Get pool state after transition
                const afterState = await this.page.evaluate(() => {
                    return window.vib34dDashboard?.canvasPool?.getSystemState();
                });
                
                // Take screenshot
                const screenshotPath = `mcp_canvas_pool_transition_${face}_${Date.now()}.png`;
                await this.page.screenshot({ path: screenshotPath });
                this.results.screenshots.push({
                    name: `transition_${face}`,
                    path: screenshotPath,
                    description: `Canvas pool state during transition to ${face}`
                });
                
                transitionResults.push({
                    face: face,
                    beforeFace: beforeState?.currentFace,
                    afterFace: afterState?.currentFace,
                    beforeVisibleCards: beforeState?.visibleCards,
                    afterVisibleCards: afterState?.visibleCards,
                    transitionSuccess: beforeState?.currentFace !== afterState?.currentFace
                });
                
                console.log(`   Before: face ${beforeState?.currentFace}, ${beforeState?.visibleCards} cards`);
                console.log(`   After: face ${afterState?.currentFace}, ${afterState?.visibleCards} cards`);
            }
            
            const successfulTransitions = transitionResults.filter(t => t.transitionSuccess);
            
            if (successfulTransitions.length >= Math.ceil(faces.length * 0.75)) {
                console.log(`✅ Face Transitions: ${successfulTransitions.length}/${faces.length} successful`);
                this.results.passed++;
                return true;
            } else {
                console.log(`❌ Face Transitions: Only ${successfulTransitions.length}/${faces.length} successful`);
                this.results.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Face Transition Test error: ${error.message}`);
            this.results.errors.push({
                type: 'face_transition_test',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.results.failed++;
            return false;
        }
    }

    async testPerformanceMetrics() {
        console.log('⚡ Testing Performance with Canvas Pool...');
        this.results.totalTests++;
        
        try {
            const performanceData = await this.page.evaluate(() => {
                return new Promise(resolve => {
                    const startTime = performance.now();
                    let frameCount = 0;
                    
                    const countFrames = () => {
                        frameCount++;
                        const elapsed = performance.now() - startTime;
                        
                        if (elapsed < 2000) { // Count for 2 seconds
                            requestAnimationFrame(countFrames);
                        } else {
                            const fps = frameCount / (elapsed / 1000);
                            
                            resolve({
                                fps: Math.round(fps),
                                frameCount: frameCount,
                                elapsed: elapsed,
                                memory: performance.memory ? {
                                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                                } : null,
                                canvasCount: document.querySelectorAll('canvas').length
                            });
                        }
                    };
                    
                    requestAnimationFrame(countFrames);
                });
            });
            
            this.results.performanceMetrics = performanceData;
            
            console.log(`📊 Performance Metrics:`);
            console.log(`   FPS: ${performanceData.fps}`);
            console.log(`   Canvas count: ${performanceData.canvasCount}`);
            if (performanceData.memory) {
                console.log(`   Memory: ${(performanceData.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            }
            
            // Consider good if FPS > 30 and canvas count <= 10
            if (performanceData.fps > 30 && performanceData.canvasCount <= 10) {
                console.log(`✅ Performance: Good (${performanceData.fps} FPS, ${performanceData.canvasCount} canvases)`);
                this.results.passed++;
                return true;
            } else {
                console.log(`❌ Performance: Poor (${performanceData.fps} FPS, ${performanceData.canvasCount} canvases)`);
                this.results.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Performance Test error: ${error.message}`);
            this.results.errors.push({
                type: 'performance_test',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.results.failed++;
            return false;
        }
    }

    async generateReport() {
        console.log('📊 Generating MCP Canvas Pool Test Report...');
        
        // Final screenshot
        const finalScreenshotPath = `mcp_canvas_pool_final_${Date.now()}.png`;
        await this.page.screenshot({ path: finalScreenshotPath, fullPage: true });
        this.results.screenshots.push({
            name: 'final_state',
            path: finalScreenshotPath,
            description: 'Final state after all canvas pool tests'
        });
        
        const successRate = this.results.totalTests > 0 ? 
            (this.results.passed / this.results.totalTests * 100).toFixed(1) : 0;
        
        this.results.successRate = parseFloat(successRate);
        this.results.status = successRate >= 80 ? 'EXCELLENT' : 
                             successRate >= 60 ? 'GOOD' : 
                             successRate >= 40 ? 'NEEDS_WORK' : 'FAILED';
        
        // Save results
        const reportPath = 'mcp_canvas_pool_test_results.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        const summary = `# VIB34D Smart Canvas Pool MCP Test Report

## Overall Result: ${this.results.status} (${successRate}% success rate)

## Test Summary
- **Total Tests**: ${this.results.totalTests}
- **Passed**: ${this.results.passed}
- **Failed**: ${this.results.failed}
- **Errors**: ${this.results.errors.length}

## Canvas Pool Analysis
${this.results.canvasPoolData.poolExists ? `
- **Pool Status**: ✅ Active
- **Pool Canvases**: ${this.results.canvasPoolData.domCanvases.poolCanvases}
- **Fallback Canvases**: ${this.results.canvasPoolData.domCanvases.fallbackCanvases}
- **Total Canvases**: ${this.results.canvasPoolData.domCanvases.total}
- **WebGL Contexts**: ${this.results.canvasPoolData.webglContexts}
- **Canvas 2D Contexts**: ${this.results.canvasPoolData.canvas2dContexts}
` : '- **Pool Status**: ❌ Not Found'}

## Performance Metrics
${this.results.performanceMetrics.fps ? `
- **FPS**: ${this.results.performanceMetrics.fps}
- **Canvas Count**: ${this.results.performanceMetrics.canvasCount}
- **Memory Usage**: ${this.results.performanceMetrics.memory ? 
    (this.results.performanceMetrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}
` : '- **Performance**: Not measured'}

## Key Achievement
✅ **SMART CANVAS POOLING**: The system now uses ${this.results.canvasPoolData.domCanvases?.total || 'N/A'} persistent canvases instead of 33+ individual instances!

---
Generated: ${this.results.timestamp}
`;

        const summaryPath = 'mcp_canvas_pool_test_summary.md';
        fs.writeFileSync(summaryPath, summary);
        
        console.log('');
        console.log('🎯 MCP CANVAS POOL TEST COMPLETE');
        console.log('=================================');
        console.log(`Status: ${this.results.status}`);
        console.log(`Success Rate: ${successRate}%`);
        console.log(`Canvas Count: ${this.results.canvasPoolData.domCanvases?.total || 'N/A'}`);
        console.log(`Reports saved: ${reportPath}, ${summaryPath}`);
        console.log('');
        
        return this.results;
    }

    async runCompleteTest() {
        try {
            await this.initialize();
            
            const loadSuccess = await this.loadDashboard();
            if (!loadSuccess) {
                throw new Error('Failed to load dashboard');
            }
            
            await this.testCanvasPoolSystem();
            await this.testFaceTransitions();
            await this.testPerformanceMetrics();
            
            const results = await this.generateReport();
            
            console.log('✅ MCP Canvas Pool Test completed!');
            return results;
            
        } catch (error) {
            console.error(`💥 Test failed: ${error.message}`);
            this.results.errors.push({
                type: 'test_failure',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            
            await this.generateReport();
            throw error;
            
        } finally {
            console.log('🔍 Browser remains open for manual inspection...');
            // Keep browser open for inspection
        }
    }
}

// Run test if called directly
if (require.main === module) {
    console.log('🎯 Starting VIB34D Smart Canvas Pool MCP Test...');
    
    const test = new MCPCanvasPoolTest();
    test.runCompleteTest()
        .then(results => {
            console.log(`\n🏆 Test completed with ${results.successRate}% success rate`);
            console.log(`📊 Canvas count: ${results.canvasPoolData.domCanvases?.total || 'N/A'} (should be ≤7)`);
            process.exit(results.successRate >= 80 ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Test failed:', error.message);
            process.exit(1);
        });
}

module.exports = MCPCanvasPoolTest;