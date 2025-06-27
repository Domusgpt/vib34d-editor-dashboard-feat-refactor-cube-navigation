const puppeteer = require('puppeteer');

async function checkDemoStatus() {
    console.log('🔍 Checking VIB34D demo status after fixes...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    try {
        const page = await browser.newPage();
        
        // Capture console messages
        page.on('console', msg => {
            console.log(`[DEMO]: ${msg.text()}`);
        });
        
        page.on('error', err => {
            console.error(`[ERROR]: ${err.message}`);
        });
        
        console.log('📄 Loading fixed demo...');
        await page.goto('http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for initialization
        await page.waitForTimeout(8000);
        
        // Run diagnostic
        const results = await page.evaluate(() => {
            const results = {
                workingCore: !!window.VIB34D_WorkingCore,
                centralState: !!window.VIB34DCentralStateManager,
                gridExists: !!document.getElementById('visualizer-grid'),
                cardCount: 0,
                systemStatus: '',
                errors: []
            };
            
            const grid = document.getElementById('visualizer-grid');
            if (grid) {
                results.cardCount = grid.children.length;
            }
            
            const status = document.getElementById('system-status');
            if (status) {
                results.systemStatus = status.innerHTML;
            }
            
            return results;
        });
        
        console.log('📊 Diagnostic Results:');
        console.log(`Working Core: ${results.workingCore ? '✅' : '❌'}`);
        console.log(`Central State: ${results.centralState ? '✅' : '❌'}`);
        console.log(`Grid Exists: ${results.gridExists ? '✅' : '❌'}`);
        console.log(`Card Count: ${results.cardCount} ${results.cardCount === 8 ? '✅' : '❌'}`);
        
        // Take screenshot
        await page.screenshot({ 
            path: 'vib34d_fixed_demo_screenshot.png', 
            fullPage: true 
        });
        console.log('📸 Screenshot saved as vib34d_fixed_demo_screenshot.png');
        
        if (results.cardCount === 8) {
            console.log('🎉 SUCCESS: All 8 visualizer cards are now showing!');
        } else if (results.cardCount > 0) {
            console.log(`⚠️ PARTIAL: ${results.cardCount} cards showing (expected 8)`);
        } else {
            console.log('❌ FAILED: No cards showing');
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    checkDemoStatus().then(results => {
        process.exit(results && results.cardCount === 8 ? 0 : 1);
    });
}

module.exports = { checkDemoStatus };