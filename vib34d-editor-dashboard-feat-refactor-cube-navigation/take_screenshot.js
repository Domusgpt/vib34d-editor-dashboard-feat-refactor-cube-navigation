const puppeteer = require('puppeteer');

async function takeScreenshot() {
    console.log('📸 Taking screenshot of fixed VIB34D demo...');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('📄 Loading demo...');
        await page.goto('http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for initialization (using page.waitForTimeout alternative)
        await page.evaluate(() => {
            return new Promise(resolve => setTimeout(resolve, 8000));
        });
        
        // Check card count
        const cardCount = await page.evaluate(() => {
            const grid = document.getElementById('visualizer-grid');
            return grid ? grid.children.length : 0;
        });
        
        console.log(`📊 Found ${cardCount} visualizer cards`);
        
        // Take screenshot
        await page.screenshot({ 
            path: 'vib34d_demo_fixed.png', 
            fullPage: true 
        });
        console.log('✅ Screenshot saved as vib34d_demo_fixed.png');
        
        if (cardCount === 8) {
            console.log('🎉 SUCCESS: All 8 visualizer cards are showing!');
        }
        
        return cardCount;
        
    } catch (error) {
        console.error('❌ Error:', error);
        return 0;
    } finally {
        await browser.close();
    }
}

takeScreenshot().then(count => {
    console.log(`🏁 Final result: ${count} cards displayed`);
    process.exit(0);
});