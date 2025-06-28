/**
 * COMPREHENSIVE MCP TEST FOR VIB34D PROFESSIONAL DASHBOARD
 * 
 * Tests the sophisticated hypercube navigation system with:
 * - 8 hypercube faces with adaptive cards
 * - WebGL visualizers for each card (up to 6 per face)
 * - Bezel navigation system
 * - VIB3HomeMaster integration
 * - Sophisticated visual effects and interactions
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VIB34DProfessionalMCPTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            timestamp: new Date().toISOString(),
            testSuite: 'VIB34D Professional Dashboard MCP Test',
            results: {},
            screenshots: [],
            performance: {},
            errors: [],
            systemState: {}
        };
        
        this.screenshotCounter = 0;
    }
    
    async initialize() {
        console.log('🚀 Initializing VIB34D Professional Dashboard MCP Test...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--allow-file-access-from-files',
                '--enable-webgl',
                '--use-gl=swiftshader'
            ]
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Set up console logging
        this.page.on('console', msg => {
            console.log(`🖥️ BROWSER: ${msg.text()}`);
        });
        
        // Set up error logging
        this.page.on('pageerror', error => {
            console.error(`❌ PAGE ERROR: ${error.message}`);
            this.testResults.errors.push({
                type: 'pageerror',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        });
        
        console.log('✅ MCP Test environment initialized');
    }
    
    async takeScreenshot(name, description = '') {
        const filename = `vib34d_professional_${String(++this.screenshotCounter).padStart(2, '0')}_${name}_${Date.now()}.png`;
        const filepath = path.join(__dirname, filename);
        
        await this.page.screenshot({
            path: filepath,
            fullPage: true
        });
        
        this.testResults.screenshots.push({
            name,
            description,
            filename,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📸 Screenshot taken: ${filename} - ${description}`);
        return filename;
    }
    
    async loadVIB34DProfessionalDashboard() {
        console.log('🌊 Loading VIB34D Professional Dashboard...');
        
        const serverUrl = 'http://127.0.0.1:8892/index_VIB34D_PROFESSIONAL.html';
        await this.page.goto(serverUrl);
        
        // Wait for initial load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take initial screenshot
        await this.takeScreenshot('initial_load', 'VIB34D Professional Dashboard initial load');
        
        // Check if main elements are present
        const elementsPresent = await this.page.evaluate(() => {
            return {
                tesseractContainer: !!document.querySelector('.tesseract-container'),
                hypercubeFaces: document.querySelectorAll('.hypercube-face').length,
                blogCards: document.querySelectorAll('.blog-card').length,
                visualizerBoards: document.querySelectorAll('.visualizer-board').length,
                cardVisualizers: document.querySelectorAll('.card-visualizer').length,
                navigationBezels: document.querySelectorAll('.nav-bezel').length,
                bezelVisualizers: document.querySelectorAll('.bezel-visualizer').length
            };
        });
        
        this.testResults.results.elementPresence = elementsPresent;
        
        console.log('📊 Elements present:', elementsPresent);
        
        // Verify core systems are loaded
        const systemsLoaded = await this.page.evaluate(() => {
            return {
                vib34dDashboard: !!window.vib34dDashboard,
                homeMaster: !!window.vib34dDashboard?.homeMaster,
                reactivityBridge: !!window.vib34dDashboard?.reactivityBridge,
                visualizersMap: window.vib34dDashboard?.visualizers?.size || 0,
                isInitialized: window.vib34dDashboard?.isInitialized || false,
                currentFace: window.vib34dDashboard?.currentFace || -1
            };
        });
        
        this.testResults.results.systemsLoaded = systemsLoaded;
        
        console.log('🧠 Core systems loaded:', systemsLoaded);
        
        return elementsPresent.tesseractContainer && systemsLoaded.vib34dDashboard;
    }
    
    async testHypercubeFaces() {
        console.log('🎲 Testing hypercube faces...');
        
        const facesResults = [];
        const faces = ['home', 'tech', 'media', 'audio', 'quantum', 'context', 'innovation', 'research'];
        
        for (let i = 0; i < faces.length; i++) {
            const faceName = faces[i];
            console.log(`🎯 Testing face ${i}: ${faceName}...`);
            
            // Check face structure
            const faceInfo = await this.page.evaluate((faceIndex, name) => {
                const faceElement = document.getElementById(`face-${faceIndex}`);
                if (!faceElement) return { error: `Face ${faceIndex} not found` };
                
                return {
                    exists: true,
                    classes: Array.from(faceElement.classList),
                    blogContainer: !!faceElement.querySelector('.blog-container'),
                    visualizerBoard: !!faceElement.querySelector('.visualizer-board'),
                    boardCanvas: !!faceElement.querySelector(`#board-visualizer-${name}`),
                    blogCards: faceElement.querySelectorAll('.blog-card').length,
                    cardVisualizers: faceElement.querySelectorAll('.card-visualizer').length
                };
            }, i, faceName);
            
            facesResults.push({
                faceIndex: i,
                faceName: faceName,
                ...faceInfo
            });
            
            console.log(`✅ Face ${i} (${faceName}):`, faceInfo);
        }
        
        this.testResults.results.hypercubeFaces = facesResults;
        await this.takeScreenshot('hypercube_faces', 'All hypercube faces structure verified');
        
        return facesResults.every(face => face.exists && !face.error);
    }
    
    async testWebGLVisualizers() {
        console.log('🎨 Testing WebGL visualizers...');
        
        // Wait for visualizers to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const visualizerStatus = await this.page.evaluate(() => {
            const dashboard = window.vib34dDashboard;
            if (!dashboard) return { error: 'Dashboard not found' };
            
            const visualizers = Array.from(dashboard.visualizers.values());
            
            return {
                totalVisualizers: visualizers.length,
                visualizerDetails: visualizers.map(viz => ({
                    id: viz.id,
                    role: viz.role,
                    sectionIndex: viz.sectionIndex,
                    hasCanvas: !!viz.canvas,
                    hasWebGL: !!viz.gl,
                    canvasSize: viz.canvas ? { 
                        width: viz.canvas.width, 
                        height: viz.canvas.height 
                    } : null
                })),
                boardVisualizers: visualizers.filter(v => v.role === 'board').length,
                cardVisualizers: visualizers.filter(v => v.role === 'content').length,
                bezelVisualizers: visualizers.filter(v => v.role === 'bezel').length
            };
        });
        
        this.testResults.results.webglVisualizers = visualizerStatus;
        
        console.log('🖼️ WebGL Visualizers Status:', visualizerStatus);
        
        await this.takeScreenshot('webgl_visualizers', 'WebGL visualizers active');
        
        return !visualizerStatus.error && visualizerStatus.totalVisualizers > 0;
    }
    
    async testBezelNavigation() {
        console.log('🧭 Testing bezel navigation...');
        
        const navigationResults = [];
        const bezels = [
            { direction: 'right', target: 'tech', name: 'TECH' },
            { direction: 'bottom', target: 'context', name: 'SETTINGS' },
            { direction: 'left', target: 'audio', name: 'AUDIO' },
            { direction: 'top', target: 'quantum', name: 'QUANTUM' }
        ];
        
        for (const bezel of bezels) {
            console.log(`🎯 Testing ${bezel.direction} bezel navigation to ${bezel.target}...`);
            
            // Click bezel
            const bezelSelector = `.nav-bezel-${bezel.direction}`;
            await this.page.click(bezelSelector);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check navigation state
            const navInfo = await this.page.evaluate((targetName) => {
                const dashboard = window.vib34dDashboard;
                if (!dashboard) return { error: 'Dashboard not found' };
                
                const faces = ['home', 'tech', 'media', 'audio', 'quantum', 'context', 'innovation', 'research'];
                const expectedIndex = faces.indexOf(targetName);
                
                return {
                    currentFace: dashboard.currentFace,
                    expectedFace: expectedIndex,
                    navigationSuccessful: dashboard.currentFace === expectedIndex,
                    homeMasterSection: dashboard.homeMaster?.masterState?.activeSection || -1
                };
            }, bezel.target);
            
            navigationResults.push({
                bezel: bezel.direction,
                target: bezel.target,
                ...navInfo
            });
            
            await this.takeScreenshot(`nav_${bezel.direction}`, `Navigation to ${bezel.target} via ${bezel.direction} bezel`);
            
            console.log(`✅ ${bezel.direction} bezel:`, navInfo);
        }
        
        this.testResults.results.bezelNavigation = navigationResults;
        
        // Return to home
        await this.page.evaluate(() => {
            if (window.vib34dDashboard) {
                window.vib34dDashboard.navigateToFace('home');
            }
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return navigationResults.every(result => result.navigationSuccessful);
    }
    
    async testInteractiveEffects() {
        console.log('🎮 Testing interactive effects...');
        
        const effectsResults = {};
        
        // Test card hover effects
        console.log('🎯 Testing card hover effects...');
        const firstCard = await this.page.$('.blog-card');
        
        if (firstCard) {
            await firstCard.hover();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const hoverState = await this.page.evaluate(() => {
                const hoveredCard = document.querySelector('.blog-card:hover');
                return {
                    cardHovered: !!hoveredCard,
                    hasHoverEffects: hoveredCard ? getComputedStyle(hoveredCard).transform !== 'none' : false,
                    visualizerOpacity: hoveredCard ? 
                        getComputedStyle(hoveredCard.querySelector('.card-visualizer'))?.opacity : '0'
                };
            });
            
            effectsResults.hoverEffect = hoverState;
            await this.takeScreenshot('hover_effect', 'Card hover effect active');
        }
        
        // Test system responsiveness
        console.log('🔧 Testing system responsiveness...');
        const systemState = await this.page.evaluate(() => {
            const dashboard = window.vib34dDashboard;
            if (!dashboard) return { error: 'Dashboard not found' };
            
            return {
                homeMasterActive: !!dashboard.homeMaster,
                reactivityBridgeActive: !!dashboard.reactivityBridge,
                systemCoherence: dashboard.homeMaster?.masterState?.coherence || 0,
                globalIntensity: dashboard.homeMaster?.masterState?.intensity || 0,
                currentSection: dashboard.homeMaster?.masterState?.activeSection || -1
            };
        });
        
        effectsResults.systemState = systemState;
        
        this.testResults.results.interactiveEffects = effectsResults;
        
        return Object.values(effectsResults).every(effect => !effect.error);
    }
    
    async testAdaptiveCards() {
        console.log('🃏 Testing adaptive card system...');
        
        const cardResults = await this.page.evaluate(() => {
            const cards = document.querySelectorAll('.blog-card');
            const results = {
                totalCards: cards.length,
                cardsWithVisualizers: 0,
                cardsWithContent: 0,
                cardsWithSophisticatedStyling: 0,
                cardDistribution: {}
            };
            
            const faces = ['home', 'tech', 'media', 'audio', 'quantum', 'context', 'innovation', 'research'];
            
            faces.forEach(face => {
                const faceCards = document.querySelectorAll(`#face-${faces.indexOf(face)} .blog-card`);
                results.cardDistribution[face] = faceCards.length;
            });
            
            cards.forEach(card => {
                // Check for visualizer
                if (card.querySelector('.card-visualizer')) {
                    results.cardsWithVisualizers++;
                }
                
                // Check for content
                if (card.querySelector('.card-content')) {
                    results.cardsWithContent++;
                }
                
                // Check for sophisticated styling
                const styles = getComputedStyle(card);
                if (styles.backdropFilter !== 'none' && styles.borderRadius !== '0px') {
                    results.cardsWithSophisticatedStyling++;
                }
            });
            
            return results;
        });
        
        this.testResults.results.adaptiveCards = cardResults;
        
        console.log('🃏 Adaptive Cards Analysis:', cardResults);
        
        await this.takeScreenshot('adaptive_cards', 'Complete adaptive card system');
        
        return cardResults.totalCards > 0 && cardResults.cardsWithVisualizers > 0;
    }
    
    async performanceAnalysis() {
        console.log('⚡ Performing performance analysis...');
        
        const performanceMetrics = await this.page.evaluate(() => {
            const performance = window.performance;
            const navigation = performance.getEntriesByType('navigation')[0];
            
            return {
                pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
                domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
                resourceTiming: {
                    scripts: performance.getEntriesByType('resource').filter(r => r.name.includes('.js')).length,
                    stylesheets: performance.getEntriesByType('resource').filter(r => r.name.includes('.css')).length
                },
                memoryUsage: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : 'Not available'
            };
        });
        
        this.testResults.performance = performanceMetrics;
        
        console.log('📊 Performance Metrics:', performanceMetrics);
    }
    
    async runCompleteTest() {
        console.log('🎯 Starting VIB34D Professional Dashboard MCP Test...');
        
        try {
            await this.initialize();
            
            // Core system tests
            const systemLoaded = await this.loadVIB34DProfessionalDashboard();
            this.testResults.results.systemLoaded = systemLoaded;
            
            if (!systemLoaded) {
                throw new Error('❌ VIB34D Professional Dashboard failed to load');
            }
            
            // Hypercube face structure test
            const facesWorking = await this.testHypercubeFaces();
            this.testResults.results.facesWorking = facesWorking;
            
            // WebGL visualizers test
            const visualizersWorking = await this.testWebGLVisualizers();
            this.testResults.results.visualizersWorking = visualizersWorking;
            
            // Bezel navigation test
            const navigationWorking = await this.testBezelNavigation();
            this.testResults.results.navigationWorking = navigationWorking;
            
            // Interactive effects test
            const effectsWorking = await this.testInteractiveEffects();
            this.testResults.results.effectsWorking = effectsWorking;
            
            // Adaptive cards test
            const cardsWorking = await this.testAdaptiveCards();
            this.testResults.results.cardsWorking = cardsWorking;
            
            // Performance analysis
            await this.performanceAnalysis();
            
            // Final system state capture
            this.testResults.systemState = await this.page.evaluate(() => {
                const dashboard = window.vib34dDashboard;
                return {
                    isInitialized: dashboard?.isInitialized || false,
                    currentFace: dashboard?.currentFace || -1,
                    visualizerCount: dashboard?.visualizers?.size || 0,
                    homeMasterState: dashboard?.homeMaster?.getSystemState(),
                    systemsActive: {
                        homeMaster: !!dashboard?.homeMaster,
                        reactivityBridge: !!dashboard?.reactivityBridge,
                        visualizers: (dashboard?.visualizers?.size || 0) > 0
                    }
                };
            });
            
            await this.takeScreenshot('final_state', 'Final system state after all tests');
            
            // Calculate overall success
            const allTestsPassed = [
                systemLoaded,
                facesWorking,
                visualizersWorking,
                navigationWorking,
                effectsWorking,
                cardsWorking
            ].every(result => result === true);
            
            this.testResults.overallSuccess = allTestsPassed;
            this.testResults.summary = {
                totalTests: 6,
                passed: [systemLoaded, facesWorking, visualizersWorking, navigationWorking, effectsWorking, cardsWorking].filter(r => r).length,
                failed: [systemLoaded, facesWorking, visualizersWorking, navigationWorking, effectsWorking, cardsWorking].filter(r => !r).length,
                errors: this.testResults.errors.length,
                screenshots: this.testResults.screenshots.length
            };
            
            console.log('✅ VIB34D Professional Dashboard MCP Test completed!');
            console.log('📊 Test Summary:', this.testResults.summary);
            
        } catch (error) {
            console.error('❌ MCP Test failed:', error);
            this.testResults.errors.push({
                type: 'test-failure',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.overallSuccess = false;
        }
        
        // Save results
        await this.saveResults();
        
        // Keep browser open for manual inspection
        console.log('🔍 Test completed. Browser will remain open for manual inspection.');
        console.log('💾 Results saved to vib34d_professional_test_results.json');
        
        return this.testResults;
    }
    
    async saveResults() {
        const resultsPath = path.join(__dirname, 'vib34d_professional_test_results.json');
        fs.writeFileSync(resultsPath, JSON.stringify(this.testResults, null, 2));
        
        // Also create a summary report
        const summaryPath = path.join(__dirname, 'vib34d_professional_test_summary.md');
        const summary = this.generateSummaryReport();
        fs.writeFileSync(summaryPath, summary);
    }
    
    generateSummaryReport() {
        const { summary, overallSuccess, errors } = this.testResults;
        
        return `# VIB34D Professional Dashboard MCP Test Report

## Overall Result: ${overallSuccess ? '✅ PASSED' : '❌ FAILED'}

## Test Summary
- **Total Tests**: ${summary.totalTests}
- **Passed**: ${summary.passed}
- **Failed**: ${summary.failed}
- **Errors**: ${summary.errors}
- **Screenshots**: ${summary.screenshots}

## Test Results

### ✅ Core System Tests
- **System Loaded**: ${this.testResults.results.systemLoaded ? '✅' : '❌'}
- **Hypercube Faces**: ${this.testResults.results.facesWorking ? '✅' : '❌'}
- **WebGL Visualizers**: ${this.testResults.results.visualizersWorking ? '✅' : '❌'}
- **Bezel Navigation**: ${this.testResults.results.navigationWorking ? '✅' : '❌'}
- **Interactive Effects**: ${this.testResults.results.effectsWorking ? '✅' : '❌'}
- **Adaptive Cards**: ${this.testResults.results.cardsWorking ? '✅' : '❌'}

### 🖼️ Screenshots Generated
${this.testResults.screenshots.map(s => `- **${s.name}**: ${s.description}`).join('\n')}

### ⚡ Performance Metrics
- **Page Load Time**: ${this.testResults.performance.pageLoadTime}ms
- **DOM Content Loaded**: ${this.testResults.performance.domContentLoaded}ms
- **Scripts Loaded**: ${this.testResults.performance.resourceTiming?.scripts || 0}
- **Stylesheets Loaded**: ${this.testResults.performance.resourceTiming?.stylesheets || 0}

### 🧠 System State
- **Initialized**: ${this.testResults.systemState.isInitialized ? '✅' : '❌'}
- **Current Face**: ${this.testResults.systemState.currentFace}
- **Visualizers**: ${this.testResults.systemState.visualizerCount}
- **All Systems Active**: ${Object.values(this.testResults.systemState.systemsActive || {}).every(s => s) ? '✅' : '❌'}

${errors.length > 0 ? `### ❌ Errors\n${errors.map(e => `- **${e.type}**: ${e.message}`).join('\n')}` : '### ✅ No Errors Detected'}

---
Generated: ${this.testResults.timestamp}
`;
    }
}

// Run the test
const test = new VIB34DProfessionalMCPTest();
test.runCompleteTest().then(results => {
    console.log('🎯 VIB34D Professional Dashboard Test Results:', results.overallSuccess ? 'SUCCESS' : 'FAILED');
    process.exit(results.overallSuccess ? 0 : 1);
}).catch(error => {
    console.error('💥 Test crashed:', error);
    process.exit(1);
});