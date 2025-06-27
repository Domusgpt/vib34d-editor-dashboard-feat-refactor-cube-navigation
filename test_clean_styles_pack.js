#!/usr/bin/env node

/**
 * VIB34D Clean Styles Pack Test
 */

const puppeteer = require('puppeteer').default || require('puppeteer');

async function testCleanStylesPack() {
    console.log('🎨 Testing VIB34D Clean Styles Pack...');
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        // Capture errors
        const errors = [];
        page.on('console', msg => {
            console.log(`CONSOLE [${msg.type().toUpperCase()}]: ${msg.text()}`);
        });
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error('PAGE ERROR:', error.message);
        });

        console.log('📡 Loading Clean Styles Pack...');
        const response = await page.goto('http://localhost:8000/VIB34D_CLEAN_STYLES_PACK.html', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        console.log(`Status: ${response.status()}`);
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take screenshot
        await page.screenshot({
            path: 'clean_styles_pack_test.png',
            fullPage: true
        });

        // Test analysis
        const analysis = await page.evaluate(() => {
            return {
                hasMainContainer: !!document.querySelector('.vib3-styles-pack-container'),
                hasVisualizer: !!document.querySelector('.vib3-primary-visualizer'),
                canvasCount: document.querySelectorAll('canvas').length,
                webglSupported: (() => {
                    try {
                        const canvas = document.createElement('canvas');
                        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                    } catch (e) {
                        return false;
                    }
                })()
            };
        });

        console.log('Analysis:', analysis);
        console.log(`Errors: ${errors.length}`);
        
        return { status: 'success', analysis, errors };

    } catch (error) {
        console.error('Test failed:', error);
        return { status: 'error', error: error.message };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testCleanStylesPack().then(result => {
    console.log('✅ Clean Styles Pack test completed');
});