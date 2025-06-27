/**
 * VIB34D Demo Diagnostic Script
 * Tests the demo page and runs diagnostics to identify missing visualizer cards
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function runDiagnostic() {
    console.log('🚀 Starting VIB34D Demo Diagnostic...');
    
    let browser = null;
    
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: false, // Show browser for debugging
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        const page = await browser.newPage();
        
        // Capture console logs
        page.on('console', msg => {
            console.log(`[PAGE]: ${msg.text()}`);
        });
        
        // Capture errors
        page.on('error', err => {
            console.error(`[PAGE ERROR]: ${err.message}`);
        });
        
        page.on('pageerror', err => {
            console.error(`[PAGE ERROR]: ${err.message}`);
        });
        
        console.log('📄 Loading demo page...');
        await page.goto('http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for DOM to be ready
        await page.waitForSelector('#visualizer-grid', { timeout: 10000 });
        
        console.log('🔍 Running diagnostic checks...');
        
        // Run the diagnostic script from the demo page
        const diagnosticResults = await page.evaluate(() => {
            console.log('=== VIB34D Demo Diagnostic ===');
            
            const results = {
                coreArchitecture: window.VIB34D_WorkingCore ? 'LOADED' : 'MISSING',
                centralStateManager: window.VIB34DCentralStateManager ? 'LOADED' : 'MISSING',
                visualizerGrid: document.getElementById('visualizer-grid') ? 'EXISTS' : 'MISSING',
                cardsInGrid: 0,
                hypercubeCoreCreation: 'UNKNOWN',
                centralStateCreation: 'UNKNOWN',
                errors: []
            };
            
            console.log('1. Core Architecture:', results.coreArchitecture);
            console.log('2. Central State Manager:', results.centralStateManager);
            console.log('3. Visualizer Grid Element:', results.visualizerGrid);
            
            const grid = document.getElementById('visualizer-grid');
            if (grid) {
                results.cardsInGrid = grid.children.length;
                console.log('4. Cards in Grid:', results.cardsInGrid);
            }
            
            // Try to create a test visualizer
            try {
                const testCanvas = document.createElement('canvas');
                testCanvas.width = 100;
                testCanvas.height = 100;
                const testCore = new window.VIB34D_WorkingCore.HypercubeCore(testCanvas);
                results.hypercubeCoreCreation = 'SUCCESS';
                console.log('5. HypercubeCore Creation:', 'SUCCESS');
            } catch (error) {
                results.hypercubeCoreCreation = 'FAILED';
                results.errors.push(`HypercubeCore: ${error.message}`);
                console.log('5. HypercubeCore Creation:', 'FAILED -', error.message);
            }
            
            // Check if Central State Manager can be created
            try {
                const testState = new VIB34DCentralStateManager();
                results.centralStateCreation = 'SUCCESS';
                console.log('6. Central State Manager Creation:', 'SUCCESS');
            } catch (error) {
                results.centralStateCreation = 'FAILED';
                results.errors.push(`CentralStateManager: ${error.message}`);
                console.log('6. Central State Manager Creation:', 'FAILED -', error.message);
            }
            
            return results;
        });
        
        console.log('\n📊 Diagnostic Results:');
        console.log(JSON.stringify(diagnosticResults, null, 2));
        
        // Take a screenshot for visual verification
        await page.screenshot({ 
            path: 'vib34d_demo_diagnostic.png', 
            fullPage: true 
        });
        console.log('📸 Screenshot saved as vib34d_demo_diagnostic.png');
        
        // Check what's actually in the DOM
        const domAnalysis = await page.evaluate(() => {
            const grid = document.getElementById('visualizer-grid');
            const systemStatus = document.getElementById('system-status');
            
            return {
                gridHTML: grid ? grid.innerHTML : 'Grid not found',
                gridChildCount: grid ? grid.children.length : 0,
                systemStatusHTML: systemStatus ? systemStatus.innerHTML : 'System status not found',
                globalState: typeof centralStateManager !== 'undefined' ? centralStateManager.getDebugState() : 'No central state'
            };
        });
        
        console.log('\n🔍 DOM Analysis:');
        console.log('Grid Child Count:', domAnalysis.gridChildCount);
        console.log('System Status:', domAnalysis.systemStatusHTML);
        
        if (domAnalysis.gridChildCount === 0) {
            console.log('\n❌ ISSUE IDENTIFIED: No visualizer cards found in grid');
            console.log('This suggests the createVisualizerCards() function is not executing properly');
            
            // Check for specific errors
            const initErrors = await page.evaluate(() => {
                // Check if the initialization completed
                return {
                    hasSystemStatus: !!document.getElementById('system-status'),
                    architectureStatus: document.getElementById('architectureStatus')?.textContent,
                    centralStateStatus: document.getElementById('centralStateStatus')?.textContent,
                    hypercubeCoreCount: document.getElementById('hypercubeCoreCount')?.textContent
                };
            });
            
            console.log('Initialization Status:', initErrors);
        }
        
        // Wait a bit longer to see if cards appear
        console.log('⏳ Waiting 5 seconds to see if cards appear...');
        await page.waitForTimeout(5000);
        
        const finalCardCount = await page.evaluate(() => {
            const grid = document.getElementById('visualizer-grid');
            return grid ? grid.children.length : 0;
        });
        
        console.log(`📊 Final card count: ${finalCardCount}`);
        
        return diagnosticResults;
        
    } catch (error) {
        console.error('❌ Diagnostic failed:', error);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Node.js version check
if (typeof require !== 'undefined') {
    runDiagnostic().then(results => {
        if (results) {
            console.log('\n✅ Diagnostic completed');
            if (results.cardsInGrid === 0) {
                console.log('\n🔧 RECOMMENDED FIXES:');
                console.log('1. Check browser console for JavaScript errors');
                console.log('2. Verify Working Core Architecture is loading properly');
                console.log('3. Check Central State Manager initialization');
                console.log('4. Verify createVisualizerCards() is being called');
            }
        }
        process.exit(0);
    }).catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
}