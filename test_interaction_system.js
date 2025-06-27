/**
 * VIB34D Interaction System Test Script
 * Tests the Central State Manager reactivity system
 */

const puppeteer = require('puppeteer');

async function testVIB34DInteractionSystem() {
    console.log('🚀 Starting VIB34D Interaction System Test...');
    
    const browser = await puppeteer.launch({
        headless: false, // Show browser for visual testing
        defaultViewport: { width: 1400, height: 1000 }
    });
    
    const page = await browser.newPage();
    
    // Navigate to the demo
    console.log('📄 Loading VIB34D Demo...');
    await page.goto('http://localhost:8080/VIB34D_PHASE1_INTEGRATED_DEMO.html');
    
    // Wait for initialization
    await page.waitForTimeout(3000);
    
    // Check for errors
    console.log('🔍 Checking for JavaScript errors...');
    const errors = await page.evaluate(() => {
        return window.console._errors || [];
    });
    
    if (errors.length > 0) {
        console.log('❌ JavaScript errors detected:', errors);
    } else {
        console.log('✅ No JavaScript errors detected');
    }
    
    // Test 1: Check Central State Manager initialization 
    console.log('🎯 Testing Central State Manager initialization...');
    const stateManagerReady = await page.evaluate(() => {
        return window.centralStateManager && window.centralStateManager.globalState;
    });
    
    if (stateManagerReady) {
        console.log('✅ Central State Manager initialized successfully');
    } else {
        console.log('❌ Central State Manager failed to initialize');
        return;
    }
    
    // Test 2: Check HypercubeCore instances
    console.log('🎮 Testing HypercubeCore creation...');
    const hypercubeCores = await page.evaluate(() => {
        if (!window.centralStateManager) return 0;
        return window.centralStateManager.visualizers.size;
    });
    
    console.log(`📊 Created ${hypercubeCores} HypercubeCore instances`);
    
    // Test 3: Test hover interactions
    console.log('🖱️ Testing hover interactions...');
    
    // Get all visualizer cards
    const cards = await page.$$('.visualizer-card');
    console.log(`📦 Found ${cards.length} visualizer cards`);
    
    if (cards.length > 0) {
        // Test hover on first card
        console.log('👆 Testing hover on first card...');
        await cards[0].hover();
        await page.waitForTimeout(1000);
        
        // Check focus states
        const focusStates = await page.evaluate(() => {
            if (!window.centralStateManager) return {};
            const states = {};
            window.centralStateManager.visualizers.forEach((viz, id) => {
                states[id] = viz.focusState;
            });
            return states;
        });
        
        console.log('🎯 Focus states after hover:', focusStates);
        
        // Check scaling transformations
        const transforms = await page.evaluate(() => {
            const cards = document.querySelectorAll('.visualizer-card');
            const transforms = [];
            cards.forEach((card, index) => {
                const style = window.getComputedStyle(card);
                transforms.push({
                    index,
                    transform: style.transform,
                    scale: card.classList.contains('focused') ? 'focused' : 
                           card.classList.contains('adjacent') ? 'adjacent' :
                           card.classList.contains('distant') ? 'distant' : 'normal'
                });
            });
            return transforms;
        });
        
        console.log('🔍 Card transformations:', transforms);
    }
    
    // Test 4: Test control buttons
    console.log('🎮 Testing control buttons...');
    
    const testButtons = [
        { id: 'testHover', name: 'Test Hover' },
        { id: 'testClick', name: 'Test Click' },
        { id: 'testScroll', name: 'Test Scroll' }
    ];
    
    for (const button of testButtons) {
        console.log(`🔘 Testing ${button.name} button...`);
        await page.click(`#${button.id}`);
        await page.waitForTimeout(500);
        
        // Check state changes
        const globalState = await page.evaluate(() => {
            if (!window.centralStateManager) return null;
            return {
                interactionType: window.centralStateManager.globalState.interactionType,
                focusedElement: window.centralStateManager.globalState.focusedElement,
                interactionIntensity: window.centralStateManager.globalState.interactionIntensity
            };
        });
        
        console.log(`📊 State after ${button.name}:`, globalState);
    }
    
    // Test 5: Test parameter cascading
    console.log('🌊 Testing parameter cascading...');
    
    const parameterStates = await page.evaluate(() => {
        if (!window.centralStateManager) return {};
        const params = {};
        window.centralStateManager.visualizers.forEach((viz, id) => {
            if (viz.hypercubeCore && viz.hypercubeCore.uniformValues) {
                params[id] = {
                    morphFactor: viz.hypercubeCore.uniformValues.u_morphFactor,
                    dimension: viz.hypercubeCore.uniformValues.u_dimension,
                    interactionIntensity: viz.hypercubeCore.uniformValues.u_interactionIntensity
                };
            }
        });
        return params;
    });
    
    console.log('⚙️ Parameter states:', parameterStates);
    
    // Test 6: Test total environment reactivity
    console.log('🌍 Testing total environment reactivity...');
    
    // Click on different cards and verify all others respond
    for (let i = 0; i < Math.min(3, cards.length); i++) {
        console.log(`🎯 Clicking card ${i}...`);
        await cards[i].click();
        await page.waitForTimeout(300);
        
        const allStates = await page.evaluate(() => {
            if (!window.centralStateManager) return {};
            const states = {};
            window.centralStateManager.visualizers.forEach((viz, id) => {
                states[id] = {
                    focusState: viz.focusState,
                    lastInteraction: viz.lastInteraction,
                    isActive: viz.isActive
                };
            });
            return states;
        });
        
        console.log(`📊 All visualizer states after card ${i} click:`, allStates);
        
        // Verify that all visualizers have updated states
        const activeCount = Object.values(allStates).filter(state => state.isActive).length;
        console.log(`🔄 ${activeCount} visualizers are actively responding`);
    }
    
    // Test 7: Dashboard updates
    console.log('📊 Testing dashboard updates...');
    
    const dashboardValues = await page.evaluate(() => {
        return {
            architectureStatus: document.getElementById('architectureStatus')?.textContent,
            hypercubeCoreCount: document.getElementById('hypercubeCoreCount')?.textContent,
            globalInteraction: document.getElementById('globalInteraction')?.textContent,
            focusedElement: document.getElementById('focusedElement')?.textContent,
            mousePosition: document.getElementById('mousePosition')?.textContent,
            interactionIntensity: document.getElementById('interactionIntensity')?.textContent
        };
    });
    
    console.log('📈 Dashboard values:', dashboardValues);
    
    // Final test summary
    console.log('\n🎯 VIB34D Interaction System Test Results:');
    console.log('=====================================');
    console.log(`✅ Central State Manager: ${stateManagerReady ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ HypercubeCore Instances: ${hypercubeCores}/8`);
    console.log(`✅ Visualizer Cards: ${cards.length}/8`);
    console.log(`✅ Focus-based Scaling: ${Object.keys(focusStates || {}).length > 0 ? 'WORKING' : 'NEEDS CHECK'}`);
    console.log(`✅ Parameter Cascading: ${Object.keys(parameterStates || {}).length > 0 ? 'WORKING' : 'NEEDS CHECK'}`);
    console.log(`✅ Dashboard Updates: ${dashboardValues.architectureStatus ? 'WORKING' : 'NEEDS CHECK'}`);
    
    // Keep browser open for manual testing
    console.log('\n🔍 Browser left open for manual testing...');
    console.log('Press Ctrl+C to close when done testing manually.');
    
    // Don't close automatically - let user test manually
    // await browser.close();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down test...');
    process.exit(0);
});

// Run the test
testVIB34DInteractionSystem().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});