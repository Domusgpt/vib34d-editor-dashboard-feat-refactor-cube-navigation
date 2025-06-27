const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testBezelDrag() {
    console.log('🚀 Starting VIB3STYLEPACK bezel drag test...');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920,1080'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.text().includes('EDGE ZONE') || msg.text().includes('bezel') || msg.text().includes('drag')) {
            console.log('🔍 CONSOLE:', msg.text());
        }
    });

    try {
        console.log('📱 Loading VIB3STYLEPACK blog...');
        await page.goto('https://domusgpt.github.io/vib3stylepack-v2-production/vib3code-morphing-blog.html', {
            waitUntil: 'networkidle2'
        });

        // Wait for page to fully load
        await page.waitForTimeout(3000);

        // 1. INITIAL STATE SCREENSHOT
        console.log('📸 Taking initial state screenshot...');
        await page.screenshot({
            path: '/mnt/c/Users/millz/ParseratorMarketing/vib3stylepack-v2-production/test_screenshots/01_initial_state.png',
            fullPage: true
        });

        // Check initial content visibility
        const initialOpacity = await page.evaluate(() => {
            const content = document.querySelector('.content-wrapper') || document.querySelector('.content') || document.body;
            return content ? window.getComputedStyle(content).opacity : 'element not found';
        });
        console.log('📊 Initial content opacity:', initialOpacity);

        // 2. BEFORE BEZEL DRAG - Position at left edge
        console.log('📸 Taking before bezel drag screenshot...');
        await page.mouse.move(50, 400);
        await page.screenshot({
            path: '/mnt/c/Users/millz/ParseratorMarketing/vib3stylepack-v2-production/test_screenshots/02_before_bezel_drag.png',
            fullPage: true
        });

        // Check content clarity before drag
        const beforeDragOpacity = await page.evaluate(() => {
            const content = document.querySelector('.content-wrapper') || document.querySelector('.content') || document.body;
            return content ? window.getComputedStyle(content).opacity : 'element not found';
        });
        console.log('📊 Before drag content opacity:', beforeDragOpacity);

        // 3. DURING BEZEL DRAG - Start drag and capture
        console.log('📸 Starting bezel drag...');
        await page.mouse.down();
        await page.mouse.move(150, 400, { steps: 5 });
        
        // Take screenshot during drag
        await page.screenshot({
            path: '/mnt/c/Users/millz/ParseratorMarketing/vib3stylepack-v2-production/test_screenshots/03_during_bezel_drag.png',
            fullPage: true
        });

        // Check content visibility during drag
        const duringDragOpacity = await page.evaluate(() => {
            const content = document.querySelector('.content-wrapper') || document.querySelector('.content') || document.body;
            return content ? window.getComputedStyle(content).opacity : 'element not found';
        });
        console.log('📊 During drag content opacity:', duringDragOpacity);

        // Continue drag to target position
        await page.mouse.move(300, 400, { steps: 10 });

        // 4. AFTER BEZEL DRAG - Complete drag and release
        console.log('📸 Completing bezel drag...');
        await page.mouse.up();
        
        // Wait for transitions
        await page.waitForTimeout(1000);
        
        await page.screenshot({
            path: '/mnt/c/Users/millz/ParseratorMarketing/vib3stylepack-v2-production/test_screenshots/04_after_bezel_drag.png',
            fullPage: true
        });

        // Check final content visibility
        const afterDragOpacity = await page.evaluate(() => {
            const content = document.querySelector('.content-wrapper') || document.querySelector('.content') || document.body;
            return content ? window.getComputedStyle(content).opacity : 'element not found';
        });
        console.log('📊 After drag content opacity:', afterDragOpacity);

        // 5. CONSOLE VERIFICATION - Check for bezel drag messages
        console.log('🔍 Checking for bezel drag detection...');
        
        // Try another bezel drag to trigger console messages
        await page.mouse.move(50, 500);
        await page.mouse.down();
        await page.mouse.move(200, 500, { steps: 5 });
        await page.mouse.up();
        
        await page.waitForTimeout(2000);

        // 6. OPACITY COMPARISON - Document exact values
        const finalAnalysis = await page.evaluate(() => {
            const content = document.querySelector('.content-wrapper') || document.querySelector('.content') || document.body;
            const visualizers = document.querySelectorAll('.visualizer');
            const activeElements = document.querySelectorAll('.active');
            
            return {
                contentOpacity: content ? window.getComputedStyle(content).opacity : 'element not found',
                visualizerCount: visualizers.length,
                activeElementCount: activeElements.length,
                currentFace: document.querySelector('.hypercube-face.active')?.className || 'none',
                cssVariables: {
                    visualizerOpacity: getComputedStyle(document.documentElement).getPropertyValue('--visualizer-opacity'),
                    contentOpacity: getComputedStyle(document.documentElement).getPropertyValue('--content-opacity')
                }
            };
        });

        console.log('📊 Final Analysis:', JSON.stringify(finalAnalysis, null, 2));

        // Take final comparison screenshot
        await page.screenshot({
            path: '/mnt/c/Users/millz/ParseratorMarketing/vib3stylepack-v2-production/test_screenshots/05_final_comparison.png',
            fullPage: true
        });

        console.log('✅ Test completed successfully!');
        console.log('📁 Screenshots saved to test_screenshots/ directory');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Create screenshots directory
const screenshotsDir = '/mnt/c/Users/millz/ParseratorMarketing/vib3stylepack-v2-production/test_screenshots';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

testBezelDrag().catch(console.error);