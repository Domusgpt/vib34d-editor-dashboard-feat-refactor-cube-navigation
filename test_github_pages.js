/**
 * GitHub Pages VIB34D Test
 */

const puppeteer = require('puppeteer');

async function testGitHubPages() {
    console.log('🚀 Testing VIB34D Dashboard on GitHub Pages...');
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--enable-webgl',
            '--enable-webgl2',
            '--window-size=1920,1080'
        ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Console logging
    page.on('console', msg => {
        console.log(`🖥️  BROWSER: ${msg.text()}`);
    });
    
    // Error tracking
    page.on('pageerror', error => {
        console.log(`❌ PAGE ERROR: ${error.message}`);
    });
    
    try {
        console.log('📡 Loading GitHub Pages dashboard...');
        
        await page.goto('https://domusgpt.github.io/vib34d-hypercube-navigation/index_VIB34D_PROFESSIONAL.html', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('✅ Page loaded successfully!');
        
        // Wait for initialization
        await page.waitForTimeout(5000);
        
        // Check for canvas elements
        const canvasCount = await page.evaluate(() => {
            return document.querySelectorAll('canvas').length;
        });
        
        console.log(`🎨 Found ${canvasCount} canvas elements`);
        
        // Check for VIB34D dashboard
        const dashboardExists = await page.evaluate(() => {
            return !!(window.vib34dDashboard || document.querySelector('.tesseract-container'));
        });
        
        console.log(`📊 Dashboard detected: ${dashboardExists ? 'YES' : 'NO'}`);
        
        // Take screenshot
        const screenshotPath = `github_pages_test_${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        
        // Check for errors
        const errors = await page.evaluate(() => {
            const errorElements = document.querySelectorAll('.error, [data-error]');
            return Array.from(errorElements).map(el => el.textContent);
        });
        
        if (errors.length > 0) {
            console.log('❌ Found errors:', errors);
        } else {
            console.log('✅ No visible errors detected');
        }
        
        // Test navigation
        console.log('🧭 Testing navigation...');
        const bezelExists = await page.evaluate(() => {
            return !!document.querySelector('.nav-bezel-right, .bezel-right, [class*="bezel"]');
        });
        
        console.log(`🎯 Navigation bezels found: ${bezelExists ? 'YES' : 'NO'}`);
        
        console.log('🎉 GitHub Pages test complete!');
        console.log('🔍 Browser will remain open for manual inspection...');
        
        // Keep browser open for manual inspection
        await new Promise(() => {}); // Keep alive
        
    } catch (error) {
        console.error(`💥 Test failed: ${error.message}`);
        
        // Take error screenshot
        try {
            const errorScreenshot = `github_pages_error_${Date.now()}.png`;
            await page.screenshot({ path: errorScreenshot, fullPage: true });
            console.log(`📸 Error screenshot: ${errorScreenshot}`);
        } catch (screenshotError) {
            console.log('Could not take error screenshot');
        }
    }
}

testGitHubPages().catch(console.error);