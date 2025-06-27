const puppeteer = require('puppeteer');

async function testVIB34DDemo() {
    console.log('🚀 Testing VIB34D Demo Functionality...');
    
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Navigate to demo
        console.log('📍 Navigating to demo...');
        await page.goto('http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html', {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        
        // Wait for elements to load
        await page.waitForTimeout(2000);
        
        // Check if visualizer grid exists
        const visualizerGrid = await page.$('#visualizer-grid');
        console.log('📊 Visualizer Grid Present:', !!visualizerGrid);
        
        // Count visualizer cards
        const cardCount = await page.$$eval('.visualizer-card', cards => cards.length);
        console.log('🎯 Visualizer Cards Count:', cardCount);
        
        // Check if canvases are present
        const canvasCount = await page.$$eval('canvas', canvases => canvases.length);
        console.log('🖼️ Canvas Elements Count:', canvasCount);
        
        // Test control buttons
        const buttons = await page.$$eval('.control-button', btns => btns.map(btn => btn.textContent));
        console.log('🎮 Control Buttons:', buttons);
        
        // Check console errors
        const consoleMessages = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleMessages.push(msg.text());
            }
        });
        
        // Test button interactions
        console.log('🔄 Testing button interactions...');
        
        // Test Hover button
        await page.click('#testHover');
        await page.waitForTimeout(500);
        
        // Test Click button  
        await page.click('#testClick');
        await page.waitForTimeout(500);
        
        // Check dashboard values
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
        
        console.log('📈 Dashboard Values:', dashboardValues);
        
        // Check Phase 1 indicators
        const phase1Status = await page.evaluate(() => {
            return {
                baseGeometry: document.getElementById('baseGeometryStatus')?.textContent,
                baseProjection: document.getElementById('baseProjectionStatus')?.textContent,
                geometryManager: document.getElementById('geometryManagerStatus')?.textContent,
                projectionManager: document.getElementById('projectionManagerStatus')?.textContent,
                shaderManager: document.getElementById('shaderManagerStatus')?.textContent,
                hypercubeCore: document.getElementById('hypercubeCoreStatus')?.textContent,
                centralState: document.getElementById('centralStateStatus')?.textContent
            };
        });
        
        console.log('🏗️ Phase 1 Status:', phase1Status);
        
        // Test hover effects on cards
        if (cardCount > 0) {
            console.log('🎭 Testing card hover effects...');
            await page.hover('.visualizer-card');
            await page.waitForTimeout(1000);
        }
        
        // Take screenshot
        await page.screenshot({ path: '/tmp/vib34d_demo_test.png', fullPage: true });
        console.log('📸 Screenshot saved to /tmp/vib34d_demo_test.png');
        
        // Check for JavaScript errors
        if (consoleMessages.length > 0) {
            console.log('❌ Console Errors:', consoleMessages);
        } else {
            console.log('✅ No JavaScript errors detected');
        }
        
        // Final assessment
        console.log('\n🎯 DEMO ASSESSMENT:');
        console.log(`- Cards Present: ${cardCount > 0 ? '✅' : '❌'} (${cardCount})`);
        console.log(`- Canvases Present: ${canvasCount > 0 ? '✅' : '❌'} (${canvasCount})`);
        console.log(`- Dashboard Active: ${dashboardValues.architectureStatus !== 'Checking...' ? '✅' : '❌'}`);
        console.log(`- Phase 1 Status: ${phase1Status.centralState !== 'Loading...' ? '✅' : '❌'}`);
        console.log(`- No JS Errors: ${consoleMessages.length === 0 ? '✅' : '❌'}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Check if puppeteer is available
try {
    require('puppeteer');
    testVIB34DDemo();
} catch (e) {
    console.log('❌ Puppeteer not available. Using alternative testing method...');
    
    // Alternative: Use curl to test basic functionality
    const { exec } = require('child_process');
    
    exec('curl -s http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html | grep -c "visualizer-card"', (error, stdout) => {
        if (error) {
            console.log('❌ Demo test failed:', error.message);
        } else {
            console.log('📊 Basic HTML structure check completed');
            console.log('🎯 Found visualizer-card references:', stdout.trim());
        }
    });
}