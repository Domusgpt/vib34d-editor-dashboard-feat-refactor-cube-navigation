const puppeteer = require('puppeteer');

async function testDashboard() {
    console.log('🌐 Starting browser test...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // Monitor console
    page.on('console', msg => console.log(`[BROWSER] ${msg.text()}`));
    page.on('pageerror', error => console.error(`[ERROR] ${error.message}`));
    
    try {
        // Load dashboard
        const response = await page.goto(process.argv[2], {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        console.log(`✅ Page loaded: ${response.status()}`);
        
        // Take screenshot
        await page.screenshot({ path: 'vib34d_dashboard_test.png', fullPage: true });
        console.log('📸 Screenshot saved: vib34d_dashboard_test.png');
        
        // Test basic elements
        const elements = await page.evaluate(() => {
            return {
                title: document.title,
                faces: document.querySelectorAll('.hypercube-face').length,
                cards: document.querySelectorAll('.blog-card').length,
                bezels: document.querySelectorAll('.nav-bezel').length,
                canvases: document.querySelectorAll('canvas').length
            };
        });
        
        console.log('📊 Dashboard elements:');
        console.log(`   Title: ${elements.title}`);
        console.log(`   Hypercube faces: ${elements.faces}`);
        console.log(`   Blog cards: ${elements.cards}`);
        console.log(`   Navigation bezels: ${elements.bezels}`);
        console.log(`   Canvas elements: ${elements.canvases}`);
        
        // Test WebGL
        const webglSupported = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        });
        
        console.log(`🎨 WebGL supported: ${webglSupported}`);
        
        // Wait for scripts to load
        await page.waitForTimeout(5000);
        
        // Test dashboard object
        const dashboardExists = await page.evaluate(() => {
            return typeof window.vib34dDashboard !== 'undefined';
        });
        
        console.log(`🎯 Dashboard object exists: ${dashboardExists}`);
        
        if (dashboardExists) {
            const dashboardState = await page.evaluate(() => {
                return {
                    initialized: window.vib34dDashboard.isInitialized,
                    currentFace: window.vib34dDashboard.currentFace,
                    visualizers: window.vib34dDashboard.visualizers ? window.vib34dDashboard.visualizers.size : 0
                };
            });
            
            console.log(`🏠 Dashboard state:`, dashboardState);
        }
        
        console.log('✅ Browser test completed successfully!');
        
    } catch (error) {
        console.error('❌ Browser test failed:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    testDashboard().catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });
}
