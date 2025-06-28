/**
 * Test the CORRECT GitHub Pages URLs
 */

const puppeteer = require('puppeteer');

async function testCorrectURLs() {
    console.log('🎯 Testing CORRECT VIB34D URLs on GitHub Pages...');
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080'
        ]
    });
    
    const urls = [
        'https://domusgpt.github.io/vib34d-hypercube-navigation/',
        'https://domusgpt.github.io/vib34d-hypercube-navigation/index_VIB34D_PROFESSIONAL.html'
    ];
    
    for (const url of urls) {
        console.log(`\n🌐 Testing: ${url}`);
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        page.on('console', msg => {
            if (msg.text().includes('VIB34D') || msg.text().includes('Dashboard') || msg.text().includes('Canvas')) {
                console.log(`  🖥️  ${msg.text()}`);
            }
        });
        
        try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
            
            // Check for dashboard
            const dashboardExists = await page.evaluate(() => {
                return !!(
                    document.querySelector('.tesseract-container') ||
                    document.querySelector('[class*="vib34d"]') ||
                    window.vib34dDashboard ||
                    document.title.includes('VIB34D')
                );
            });
            
            // Check for canvas elements
            const canvasCount = await page.evaluate(() => {
                return document.querySelectorAll('canvas').length;
            });
            
            // Check for errors
            const hasErrors = await page.evaluate(() => {
                return document.querySelector('[class*="error"]') || 
                       document.body.textContent.includes('error') ||
                       document.body.textContent.includes('404');
            });
            
            console.log(`  ✅ Dashboard detected: ${dashboardExists ? 'YES' : 'NO'}`);
            console.log(`  🎨 Canvas elements: ${canvasCount}`);
            console.log(`  ❌ Has errors: ${hasErrors ? 'YES' : 'NO'}`);
            
            if (dashboardExists && canvasCount > 0) {
                console.log(`  🎉 SUCCESS: ${url} is working!`);
            } else {
                console.log(`  ⚠️  ISSUE: ${url} may not be loading correctly`);
            }
            
            await page.close();
            
        } catch (error) {
            console.log(`  💥 FAILED: ${error.message}`);
            await page.close();
        }
    }
    
    console.log('\n🏁 Test complete. Browser remains open for manual inspection.');
    // Keep browser open
    await new Promise(() => {});
}

testCorrectURLs().catch(console.error);