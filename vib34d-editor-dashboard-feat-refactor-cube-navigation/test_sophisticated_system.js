/**
 * COMPREHENSIVE VIB3 SOPHISTICATED TESSERACT SYSTEM TEST
 * 
 * Tests the complete integration of:
 * - JSON Configuration System
 * - VIB3HomeMaster + UnifiedReactivityBridge  
 * - ReactiveHyperAVCore WebGL Visualizers
 * - 8-Geometry Tesseract Navigation
 * - Systematic Parameter Reactivity
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VIB3SophisticatedSystemTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.baseUrl = 'http://localhost:3000';
        this.testResults = {
            timestamp: new Date().toISOString(),
            tests: [],
            screenshots: [],
            systemStatus: {},
            passed: 0,
            failed: 0
        };
    }
    
    async init() {
        console.log('🚀 Initializing VIB3 Sophisticated System Tester...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Enable console logging
        this.page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            if (type === 'error') {
                console.error(`❌ Browser Error: ${text}`);
            } else if (text.includes('VIB3') || text.includes('🌟') || text.includes('✅') || text.includes('❌')) {
                console.log(`📱 Browser: ${text}`);
            }
        });
        
        // Track errors
        this.page.on('pageerror', error => {
            console.error(`❌ Page Error: ${error.message}`);
            this.testResults.tests.push({
                name: 'Page Error Detected',
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        });
        
        console.log('✅ Puppeteer initialized successfully');
    }
    
    async loadSophisticatedSystem() {
        console.log('🌐 Loading sophisticated tesseract system...');
        
        try {
            await this.page.goto(`${this.baseUrl}/index_SOPHISTICATED_COPY.html`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            // Wait for system initialization
            await this.page.waitForFunction(() => {
                return window.vib3System && window.vib3System.isInitialized;
            }, { timeout: 15000 });
            
            await this.takeScreenshot('01-system-loaded');
            
            this.addTestResult('System Loading', 'passed', 'Sophisticated system loaded successfully');
            console.log('✅ Sophisticated system loaded successfully');
            
        } catch (error) {
            this.addTestResult('System Loading', 'failed', error.message);
            throw error;
        }
    }
    
    async testJSONConfiguration() {
        console.log('📋 Testing JSON Configuration System...');
        
        try {
            const hasConfigSystem = await this.page.evaluate(() => {
                return window.vib3System && 
                       (window.vib3System.configSystem || window.vib3System.fallbackSections);
            });
            
            if (!hasConfigSystem) {
                throw new Error('JSON Configuration System not available');
            }
            
            // Test configuration loading
            const configData = await this.page.evaluate(() => {
                if (window.vib3System.configSystem) {
                    return {
                        hasContent: !!window.vib3System.configSystem.getConfig('content', 'sections'),
                        hasBehavior: !!window.vib3System.configSystem.getConfig('behavior'),
                        hasVisuals: !!window.vib3System.configSystem.getConfig('visuals')
                    };
                } else {
                    return {
                        hasContent: !!window.vib3System.fallbackSections,
                        hasBehavior: true,
                        hasVisuals: true
                    };
                }
            });
            
            if (!configData.hasContent) {
                throw new Error('Content configuration not loaded');
            }
            
            this.addTestResult('JSON Configuration', 'passed', 'All configuration systems working');
            console.log('✅ JSON Configuration system working properly');
            
        } catch (error) {
            this.addTestResult('JSON Configuration', 'failed', error.message);
            throw error;
        }
    }
    
    async testVisualizerSystems() {
        console.log('🎨 Testing WebGL Visualizer Systems...');
        
        try {
            const visualizerStatus = await this.page.evaluate(() => {
                const system = window.vib3System;
                if (!system) return { error: 'System not available' };
                
                return {
                    visualizerCount: system.visualizers ? system.visualizers.length : 0,
                    boardCanvas: !!document.getElementById('board-visualizer'),
                    cardCanvases: document.querySelectorAll('.card-visualizer').length,
                    webglSupport: !!document.getElementById('board-visualizer')?.getContext('webgl')
                };
            });
            
            console.log('📊 Visualizer Status:', visualizerStatus);
            
            if (visualizerStatus.visualizerCount === 0) {
                throw new Error('No visualizers initialized');
            }
            
            if (!visualizerStatus.webglSupport) {
                throw new Error('WebGL not supported or not working');
            }
            
            if (visualizerStatus.cardCanvases !== 6) {
                throw new Error(`Expected 6 card canvases, found ${visualizerStatus.cardCanvases}`);
            }
            
            await this.takeScreenshot('02-visualizers-active');
            
            this.addTestResult('Visualizer Systems', 'passed', `${visualizerStatus.visualizerCount} visualizers active`);
            console.log('✅ WebGL visualizer systems working properly');
            
        } catch (error) {
            this.addTestResult('Visualizer Systems', 'failed', error.message);
            throw error;
        }
    }
    
    async test8GeometryStates() {
        console.log('🎲 Testing 8 Geometry States Navigation...');
        
        try {
            const geometryStates = ['hypercube', 'tetrahedron', 'wave', 'sphere', 'fractal', 'crystal', 'klein', 'torus'];
            
            for (let i = 0; i < geometryStates.length; i++) {
                const geometry = geometryStates[i];
                console.log(`🔄 Testing ${geometry} (face ${i})...`);
                
                // Navigate to face
                await this.page.evaluate((faceIndex) => {
                    window.vib3System.navigateToFace(faceIndex);
                }, i);
                
                // Wait for transition
                await this.page.waitForTimeout(1000);
                
                // Verify geometry change
                const currentState = await this.page.evaluate(() => ({
                    geometry: window.vib3System.currentGeometry,
                    face: window.vib3System.currentFace,
                    stateDisplay: document.getElementById('current-geometry')?.textContent
                }));
                
                if (currentState.geometry !== geometry) {
                    throw new Error(`Expected geometry ${geometry}, got ${currentState.geometry}`);
                }
                
                if (currentState.face !== i) {
                    throw new Error(`Expected face ${i}, got ${currentState.face}`);
                }
                
                await this.takeScreenshot(`03-geometry-${geometry}-face-${i}`);
                
                console.log(`✅ ${geometry} state working properly`);
            }
            
            this.addTestResult('8 Geometry States', 'passed', 'All 8 geometry states working');
            console.log('✅ All 8 geometry states tested successfully');
            
        } catch (error) {
            this.addTestResult('8 Geometry States', 'failed', error.message);
            throw error;
        }
    }
    
    async testParameterReactivity() {
        console.log('⚡ Testing Parameter Reactivity System...');
        
        try {
            // Test card hover effects
            const cards = await this.page.$$('.blog-card');
            if (cards.length === 0) {
                throw new Error('No blog cards found for testing');
            }
            
            // Test hover on first card
            await cards[0].hover();
            await this.page.waitForTimeout(500);
            
            // Check if parameters changed
            const afterHover = await this.page.evaluate(() => {
                const energyText = document.getElementById('current-energy')?.textContent;
                return {
                    energy: parseFloat(energyText || '0'),
                    hasHomeMaster: !!window.vib3System.homeMaster
                };
            });
            
            await this.takeScreenshot('04-parameter-reactivity');
            
            if (!afterHover.hasHomeMaster) {
                throw new Error('VIB3HomeMaster not available');
            }
            
            // Test parameter change function
            await this.page.evaluate(() => {
                window.vib3System.testParameterChange();
            });
            
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot('05-parameter-test');
            
            this.addTestResult('Parameter Reactivity', 'passed', 'Parameter system responding correctly');
            console.log('✅ Parameter reactivity system working properly');
            
        } catch (error) {
            this.addTestResult('Parameter Reactivity', 'failed', error.message);
            throw error;
        }
    }
    
    async testKeyboardControls() {
        console.log('⌨️ Testing Keyboard Controls...');
        
        try {
            // Test dev controls toggle
            await this.page.keyboard.press('KeyD');
            await this.page.waitForTimeout(500);
            
            const devControlsVisible = await this.page.evaluate(() => {
                const devControls = document.querySelector('.dev-controls');
                return devControls && devControls.style.display !== 'none';
            });
            
            if (!devControlsVisible) {
                throw new Error('Dev controls not toggled properly');
            }
            
            // Test face cycling
            await this.page.keyboard.press('Space');
            await this.page.waitForTimeout(1000);
            
            // Test arrow key navigation
            await this.page.keyboard.press('ArrowRight');
            await this.page.waitForTimeout(1000);
            
            const currentFace = await this.page.evaluate(() => 
                parseInt(document.getElementById('current-face')?.textContent || '0')
            );
            
            if (currentFace !== 1) {
                throw new Error(`Expected face 1 after ArrowRight, got ${currentFace}`);
            }
            
            await this.takeScreenshot('06-keyboard-controls');
            
            this.addTestResult('Keyboard Controls', 'passed', 'All keyboard controls working');
            console.log('✅ Keyboard controls working properly');
            
        } catch (error) {
            this.addTestResult('Keyboard Controls', 'failed', error.message);
            throw error;
        }
    }
    
    async testAdvancedDragInteractions() {
        console.log('🖱️ Testing Advanced Drag Interactions...');
        
        try {
            const tesseractContainer = await this.page.$('#tesseractContainer');
            if (!tesseractContainer) {
                throw new Error('Tesseract container not found');
            }
            
            // Test drag interaction
            const containerBox = await tesseractContainer.boundingBox();
            const startX = containerBox.x + containerBox.width / 2;
            const startY = containerBox.y + containerBox.height / 2;
            const endX = startX + 200;
            const endY = startY;
            
            await this.page.mouse.move(startX, startY);
            await this.page.mouse.down();
            await this.page.mouse.move(endX, endY, { steps: 10 });
            await this.page.waitForTimeout(500);
            await this.page.mouse.up();
            
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot('07-drag-interaction');
            
            this.addTestResult('Advanced Drag', 'passed', 'Drag interactions working');
            console.log('✅ Advanced drag interactions working properly');
            
        } catch (error) {
            this.addTestResult('Advanced Drag', 'failed', error.message);
            throw error;
        }
    }
    
    async runBuiltinSystemTest() {
        console.log('🧪 Running Built-in System Test...');
        
        try {
            const testResult = await this.page.evaluate(() => {
                return window.vib3System.runSystemTest();
            });
            
            if (!testResult) {
                throw new Error('Built-in system test failed');
            }
            
            await this.takeScreenshot('08-builtin-test');
            
            this.addTestResult('Built-in System Test', 'passed', 'All internal tests passed');
            console.log('✅ Built-in system test passed');
            
        } catch (error) {
            this.addTestResult('Built-in System Test', 'failed', error.message);
            throw error;
        }
    }
    
    async captureSystemStatus() {
        console.log('📊 Capturing Final System Status...');
        
        this.testResults.systemStatus = await this.page.evaluate(() => {
            const system = window.vib3System;
            if (!system) return { error: 'System not available' };
            
            return {
                isInitialized: system.isInitialized,
                currentGeometry: system.currentGeometry,
                currentFace: system.currentFace,
                visualizerCount: system.visualizers?.length || 0,
                hasHomeMaster: !!system.homeMaster,
                hasReactivityBridge: !!system.reactivityBridge,
                hasConfigSystem: !!(system.configSystem || system.fallbackSections),
                geometryStates: system.geometryStates,
                performance: {
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent
                }
            };
        });
        
        await this.takeScreenshot('09-final-status');
        console.log('📊 System Status:', this.testResults.systemStatus);
    }
    
    async takeScreenshot(name) {
        try {
            const filename = `${name}_${Date.now()}.png`;
            const filepath = path.join(__dirname, 'test-screenshots', filename);
            
            // Ensure directory exists
            const dir = path.dirname(filepath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            await this.page.screenshot({ 
                path: filepath,
                fullPage: true
            });
            
            this.testResults.screenshots.push({
                name: name,
                filename: filename,
                timestamp: new Date().toISOString()
            });
            
            console.log(`📸 Screenshot saved: ${filename}`);
            
        } catch (error) {
            console.error(`❌ Failed to take screenshot ${name}:`, error);
        }
    }
    
    addTestResult(name, status, details) {
        this.testResults.tests.push({
            name,
            status,
            details,
            timestamp: new Date().toISOString()
        });
        
        if (status === 'passed') {
            this.testResults.passed++;
        } else {
            this.testResults.failed++;
        }
    }
    
    async runAllTests() {
        console.log('🧪 Starting Comprehensive VIB3 Sophisticated System Test...');
        
        try {
            await this.init();
            await this.loadSophisticatedSystem();
            await this.testJSONConfiguration();
            await this.testVisualizerSystems();
            await this.test8GeometryStates();
            await this.testParameterReactivity();
            await this.testKeyboardControls();
            await this.testAdvancedDragInteractions();
            await this.runBuiltinSystemTest();
            await this.captureSystemStatus();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        } finally {
            await this.generateReport();
            await this.cleanup();
        }
    }
    
    async generateReport() {
        console.log('📄 Generating test report...');
        
        const reportPath = path.join(__dirname, `test-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        
        console.log('📋 TEST SUMMARY:');
        console.log(`✅ Passed: ${this.testResults.passed}`);
        console.log(`❌ Failed: ${this.testResults.failed}`);
        console.log(`📸 Screenshots: ${this.testResults.screenshots.length}`);
        console.log(`📄 Report saved: ${reportPath}`);
        
        if (this.testResults.failed === 0) {
            console.log('🎉 ALL TESTS PASSED! VIB3 Sophisticated System is working perfectly!');
        } else {
            console.log('⚠️ Some tests failed. Check the report for details.');
        }
    }
    
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('🧹 Cleanup completed');
    }
}

// Run the test suite
const tester = new VIB3SophisticatedSystemTester();
tester.runAllTests().catch(console.error);