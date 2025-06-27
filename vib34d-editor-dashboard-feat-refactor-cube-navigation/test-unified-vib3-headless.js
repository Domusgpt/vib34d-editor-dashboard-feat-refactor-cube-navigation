const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'test-screenshots');

async function ensureScreenshotsDir() {
    try {
        await fs.mkdir(screenshotsDir, { recursive: true });
    } catch (error) {
        console.error('Error creating screenshots directory:', error);
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureScreenshot(page, name, description) {
    try {
        const filename = `${name}_${Date.now()}.png`;
        const filepath = path.join(screenshotsDir, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`📸 Screenshot captured: ${name}`);
        console.log(`   Description: ${description}`);
        console.log(`   Saved to: ${filepath}`);
        console.log('');
        return filepath;
    } catch (error) {
        console.error(`❌ Failed to capture screenshot ${name}:`, error.message);
        return null;
    }
}

async function testUnifiedVIB3() {
    console.log('🚀 Starting VIB3 Unified System Test (Headless)');
    console.log('===============================================\n');

    await ensureScreenshotsDir();

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Capture console messages
        const consoleMessages = [];
        const errors = [];

        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            consoleMessages.push({ type, text, timestamp: Date.now() });
            
            if (type === 'error') {
                console.error('❌ Console Error:', text);
                errors.push(text);
            } else if (type === 'warning') {
                console.warn('⚠️  Console Warning:', text);
            } else {
                console.log('📝 Console:', text);
            }
        });

        // Catch page errors
        page.on('pageerror', error => {
            console.error('🔥 Page Error:', error.message);
            errors.push(error.message);
        });

        // Navigate to the page
        const filePath = 'file://' + path.join(__dirname, 'index_unified.html');
        console.log('📍 Navigating to:', filePath);
        
        await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // 1. Initial screenshot
        await delay(2000);
        await captureScreenshot(page, '01-initial-load', 'Initial page load state');

        // Check page title and basic elements
        const pageTitle = await page.title();
        console.log('📄 Page Title:', pageTitle);

        // Check for loading overlay
        try {
            const loadingOverlay = await page.$('#loading-overlay');
            if (loadingOverlay) {
                console.log('⏳ Loading overlay found, waiting for it to disappear...');
                await page.waitForSelector('#loading-overlay', { hidden: true, timeout: 10000 });
                console.log('✅ Loading overlay disappeared');
            } else {
                console.log('ℹ️  No loading overlay found');
            }
        } catch (error) {
            console.log('⚠️  Loading overlay timeout or not found');
        }

        // 2. Screenshot after loading
        await delay(1000);
        await captureScreenshot(page, '02-after-loading', 'After loading phase');

        // Check for WebGL canvas
        console.log('🎨 Checking WebGL background...');
        const canvasInfo = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return { exists: false };
            
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
            return {
                exists: true,
                width: canvas.width,
                height: canvas.height,
                hasContext: !!gl,
                contextType: gl ? gl.constructor.name : 'none',
                style: {
                    display: canvas.style.display,
                    position: canvas.style.position,
                    zIndex: canvas.style.zIndex
                }
            };
        });
        console.log('Canvas info:', canvasInfo);

        // 3. Test Dev Controls
        console.log('\n🎛️  Testing Dev Controls...');
        await page.keyboard.press('KeyD');
        await delay(1000);
        
        const devPanelInfo = await page.evaluate(() => {
            const devPanel = document.querySelector('#dev-panel');
            if (!devPanel) return { exists: false };
            
            const style = window.getComputedStyle(devPanel);
            return {
                exists: true,
                visible: style.display !== 'none' && style.visibility !== 'hidden',
                display: style.display,
                visibility: style.visibility,
                zIndex: style.zIndex
            };
        });
        console.log('Dev panel info:', devPanelInfo);
        
        if (devPanelInfo.exists) {
            await captureScreenshot(page, '03-dev-panel-open', 'Dev panel opened with D key');
        }

        // 4. Test Keyboard Navigation
        console.log('\n⌨️  Testing Keyboard Navigation...');
        
        const navigationResults = [];
        const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
        
        for (const key of keys) {
            const beforeState = await page.evaluate(() => ({
                currentFace: window.currentFace || 'unknown',
                activeElements: document.querySelectorAll('.active').length
            }));
            
            await page.keyboard.press(key);
            await delay(1000);
            
            const afterState = await page.evaluate(() => ({
                currentFace: window.currentFace || 'unknown',
                activeElements: document.querySelectorAll('.active').length
            }));
            
            navigationResults.push({
                key,
                before: beforeState,
                after: afterState,
                changed: JSON.stringify(beforeState) !== JSON.stringify(afterState)
            });
            
            console.log(`${key}: ${beforeState.currentFace} → ${afterState.currentFace} (changed: ${navigationResults[navigationResults.length-1].changed})`);
        }

        await captureScreenshot(page, '04-after-navigation', 'After keyboard navigation tests');

        // 5. Test Parameter Displays
        console.log('\n📊 Checking Parameter Displays...');
        const parameterInfo = await page.evaluate(() => {
            const displays = document.querySelectorAll('[class*="parameter"], [class*="param"], [class*="display"]');
            const params = [];
            displays.forEach((display, index) => {
                const style = window.getComputedStyle(display);
                params.push({
                    index,
                    class: display.className,
                    text: display.textContent.substring(0, 100), // First 100 chars
                    visible: style.display !== 'none' && style.visibility !== 'hidden',
                    position: style.position,
                    zIndex: style.zIndex
                });
            });
            return params;
        });
        console.log(`Found ${parameterInfo.length} parameter displays:`);
        parameterInfo.forEach(param => {
            console.log(`  - ${param.class}: "${param.text}" (visible: ${param.visible})`);
        });

        // 6. Check for Sliders and Controls
        console.log('\n🎚️  Checking Controls...');
        const controlsInfo = await page.evaluate(() => {
            const sliders = document.querySelectorAll('input[type="range"]');
            const buttons = document.querySelectorAll('button');
            const inputs = document.querySelectorAll('input');
            
            return {
                sliders: sliders.length,
                buttons: buttons.length,
                inputs: inputs.length,
                sliderValues: Array.from(sliders).map(s => ({ value: s.value, min: s.min, max: s.max }))
            };
        });
        console.log('Controls found:', controlsInfo);

        // 7. Test Face Transitions
        console.log('\n🔄 Testing Face Transitions...');
        for (let i = 0; i < 6; i++) {
            await page.keyboard.press('ArrowRight');
            await delay(800);
            
            const faceInfo = await page.evaluate(() => {
                const activeFace = document.querySelector('.face.active, .cube-face.active');
                return {
                    currentFace: window.currentFace || 'unknown',
                    activeFaceClass: activeFace ? activeFace.className : 'none',
                    backgroundStyle: window.getComputedStyle(document.body).background
                };
            });
            
            console.log(`Face ${i}:`, faceInfo);
            await captureScreenshot(page, `05-face-${i}`, `Face ${i} transition test`);
        }

        // 8. Performance Analysis
        console.log('\n⚡ Performance Analysis...');
        const performanceMetrics = await page.evaluate(() => {
            const timing = performance.timing;
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                currentFPS: window.currentFPS || 'not-available',
                memoryUsage: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : 'not-available'
            };
        });
        console.log('Performance metrics:', performanceMetrics);

        // 9. Final comprehensive screenshot
        await captureScreenshot(page, '06-final-state', 'Final state of the application');

        // 10. Generate detailed report
        console.log('\n📋 COMPREHENSIVE VISUAL TEST REPORT');
        console.log('====================================');
        console.log(`✅ Test completed successfully`);
        console.log(`📄 Page Title: ${pageTitle}`);
        console.log(`🎨 WebGL Canvas: ${canvasInfo.exists ? 'Found' : 'Not Found'}`);
        console.log(`🎛️  Dev Panel: ${devPanelInfo.exists ? 'Found' : 'Not Found'}`);
        console.log(`📊 Parameter Displays: ${parameterInfo.length} found`);
        console.log(`🎚️  Controls: ${controlsInfo.sliders} sliders, ${controlsInfo.buttons} buttons`);
        console.log(`❌ Console Errors: ${errors.length}`);
        console.log(`📝 Console Messages: ${consoleMessages.length}`);
        console.log(`📸 Screenshots: Saved to ${screenshotsDir}`);

        if (errors.length > 0) {
            console.log('\n❌ ERRORS FOUND:');
            errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        // Visual assessment summary
        console.log('\n🔍 VISUAL ASSESSMENT SUMMARY:');
        console.log('- WebGL Background:', canvasInfo.exists ? 'PRESENT' : 'MISSING');
        console.log('- Dev Controls:', devPanelInfo.exists ? 'FUNCTIONAL' : 'NOT FOUND');
        console.log('- Navigation System:', navigationResults.some(r => r.changed) ? 'RESPONSIVE' : 'STATIC');
        console.log('- Parameter System:', parameterInfo.length > 0 ? 'ACTIVE' : 'INACTIVE');
        console.log('- Overall Status:', errors.length === 0 ? '✅ HEALTHY' : '⚠️  HAS ISSUES');

        return {
            success: true,
            screenshots: screenshotsDir,
            errors: errors.length,
            performance: performanceMetrics,
            features: {
                webgl: canvasInfo.exists,
                devPanel: devPanelInfo.exists,
                navigation: navigationResults.some(r => r.changed),
                parameters: parameterInfo.length > 0
            }
        };

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
        if (browser) {
            const page = await browser.newPage();
            await captureScreenshot(page, 'error-state', `Test failed: ${error.message}`);
        }
        return {
            success: false,
            error: error.message
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testUnifiedVIB3()
    .then(result => {
        console.log('\n🏁 Test Complete');
        console.log('Result:', result);
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });