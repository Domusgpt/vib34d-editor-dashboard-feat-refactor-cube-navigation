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
    const filename = `${name}_${Date.now()}.png`;
    const filepath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot captured: ${name}`);
    console.log(`   Description: ${description}`);
    console.log(`   Saved to: ${filepath}`);
    console.log('');
}

async function testUnifiedVIB3() {
    console.log('🚀 Starting VIB3 Unified System Test');
    console.log('=====================================\n');

    await ensureScreenshotsDir();

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-webgl',
            '--use-gl=desktop',
            '--enable-accelerated-2d-canvas',
            '--enable-accelerated-video-decode'
        ]
    });

    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            console.error('❌ Console Error:', text);
        } else if (type === 'warning') {
            console.warn('⚠️  Console Warning:', text);
        } else {
            console.log('📝 Console:', text);
        }
    });

    // Catch page errors
    page.on('pageerror', error => {
        console.error('🔥 Page Error:', error.message);
    });

    try {
        // Navigate to the page
        const filePath = 'file://' + path.join(__dirname, 'index_unified.html');
        console.log('📍 Navigating to:', filePath);
        await page.goto(filePath, { waitUntil: 'networkidle0' });
        
        // 1. Initial screenshot
        await delay(2000);
        await captureScreenshot(page, '01-initial-load', 'Initial page load state');

        // Check for loading overlay
        const loadingOverlay = await page.$('#loading-overlay');
        if (loadingOverlay) {
            console.log('⏳ Waiting for loading overlay to disappear...');
            await page.waitForSelector('#loading-overlay', { hidden: true, timeout: 10000 });
            console.log('✅ Loading overlay disappeared\n');
        }

        // 2. Screenshot after loading
        await delay(1000);
        await captureScreenshot(page, '02-after-loading', 'After loading overlay disappears');

        // Check WebGL background
        console.log('🎨 Checking WebGL background...');
        const canvas = await page.$('canvas');
        if (canvas) {
            const canvasInfo = await page.evaluate(() => {
                const canvas = document.querySelector('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                return {
                    exists: true,
                    width: canvas.width,
                    height: canvas.height,
                    hasContext: !!gl,
                    contextType: gl ? gl.constructor.name : 'none'
                };
            });
            console.log('Canvas info:', canvasInfo);
            console.log('');
        }

        // 3. Test Dev Controls
        console.log('🎛️  Testing Dev Controls...');
        await page.keyboard.press('KeyD');
        await delay(500);
        
        const devPanel = await page.$('#dev-panel');
        if (devPanel) {
            const isVisible = await page.evaluate(el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
            }, devPanel);
            console.log('Dev panel visible:', isVisible);
            await captureScreenshot(page, '03-dev-panel-open', 'Dev panel opened with D key');
        } else {
            console.log('❌ Dev panel not found');
        }

        // 4. Test Presets
        console.log('\n🎨 Testing Presets...');
        const presets = [
            { name: 'crystalline', button: 'Crystalline' },
            { name: 'ethereal', button: 'Ethereal' },
            { name: 'dynamic', button: 'Dynamic' },
            { name: 'custom', button: 'Custom' }
        ];

        for (const preset of presets) {
            try {
                const button = await page.$(`button:has-text("${preset.button}")`);
                if (!button) {
                    // Try alternative selector
                    const buttons = await page.$$('button');
                    for (const btn of buttons) {
                        const text = await btn.evaluate(el => el.textContent);
                        if (text && text.includes(preset.button)) {
                            await btn.click();
                            console.log(`✅ Applied ${preset.name} preset`);
                            await delay(1000);
                            await captureScreenshot(page, `04-preset-${preset.name}`, `${preset.button} preset applied`);
                            break;
                        }
                    }
                } else {
                    await button.click();
                    console.log(`✅ Applied ${preset.name} preset`);
                    await delay(1000);
                    await captureScreenshot(page, `04-preset-${preset.name}`, `${preset.button} preset applied`);
                }
            } catch (error) {
                console.log(`⚠️  Could not apply ${preset.name} preset:`, error.message);
            }
        }

        // Close dev panel
        await page.keyboard.press('KeyD');
        await delay(500);

        // 5. Test Keyboard Navigation
        console.log('\n⌨️  Testing Keyboard Navigation...');
        
        // Get initial face
        const initialFace = await page.evaluate(() => {
            return window.currentFace || 0;
        });
        console.log('Initial face:', initialFace);

        // Test arrow keys
        const navigationTests = [
            { key: 'ArrowRight', description: 'Navigate right' },
            { key: 'ArrowLeft', description: 'Navigate left' },
            { key: 'ArrowUp', description: 'Navigate up' },
            { key: 'ArrowDown', description: 'Navigate down' }
        ];

        for (const test of navigationTests) {
            await page.keyboard.press(test.key);
            await delay(1000);
            const newFace = await page.evaluate(() => window.currentFace || 0);
            console.log(`${test.key}: Face ${initialFace} → ${newFace}`);
            await captureScreenshot(page, `05-nav-${test.key.toLowerCase()}`, test.description);
        }

        // 6. Test Edge Dragging Simulation
        console.log('\n🖱️  Testing Edge Dragging...');
        
        // Find cube container
        const cubeContainer = await page.$('#cube-container, .cube-container');
        if (cubeContainer) {
            const box = await cubeContainer.boundingBox();
            if (box) {
                // Simulate drag from right edge
                await page.mouse.move(box.x + box.width - 50, box.y + box.height / 2);
                await page.mouse.down();
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
                await page.mouse.up();
                await delay(1000);
                await captureScreenshot(page, '06-edge-drag', 'After edge dragging simulation');
            }
        }

        // 7. Check Parameter Displays
        console.log('\n📊 Checking Parameter Displays...');
        const parameterInfo = await page.evaluate(() => {
            const displays = document.querySelectorAll('.parameter-display, .param-display, [class*="parameter"]');
            const params = [];
            displays.forEach(display => {
                params.push({
                    class: display.className,
                    text: display.textContent,
                    visible: window.getComputedStyle(display).display !== 'none'
                });
            });
            return params;
        });
        console.log('Parameter displays found:', parameterInfo.length);
        parameterInfo.forEach(param => {
            console.log(`  - ${param.class}: "${param.text}" (visible: ${param.visible})`);
        });

        // 8. Test Sections/Themes
        console.log('\n🎭 Testing Sections/Themes...');
        
        // Navigate through different faces to see different themes
        for (let i = 0; i < 6; i++) {
            await page.keyboard.press('ArrowRight');
            await delay(1500);
            
            const themeInfo = await page.evaluate(() => {
                const face = document.querySelector('.cube-face.active, .face.active');
                return {
                    faceNumber: window.currentFace || i,
                    theme: face ? face.dataset.theme || 'unknown' : 'not-found',
                    backgroundColor: window.getComputedStyle(document.body).backgroundColor,
                    activeClasses: face ? face.className : 'none'
                };
            });
            
            console.log(`Face ${i}:`, themeInfo);
            await captureScreenshot(page, `07-face-${i}`, `Face ${i} with theme: ${themeInfo.theme}`);
        }

        // 9. Final Visual Assessment
        console.log('\n🔍 Final Visual Assessment...');
        
        // Open dev panel again for final assessment
        await page.keyboard.press('KeyD');
        await delay(500);
        
        // Adjust some parameters
        const sliders = await page.$$('input[type="range"]');
        console.log(`Found ${sliders.length} sliders`);
        
        if (sliders.length > 0) {
            // Adjust first few sliders
            for (let i = 0; i < Math.min(3, sliders.length); i++) {
                await sliders[i].evaluate(slider => slider.value = slider.max * 0.7);
                await page.evaluate(slider => {
                    slider.dispatchEvent(new Event('input', { bubbles: true }));
                    slider.dispatchEvent(new Event('change', { bubbles: true }));
                }, sliders[i]);
            }
            await delay(1000);
            await captureScreenshot(page, '08-adjusted-parameters', 'After adjusting parameters');
        }

        // 10. Performance check
        console.log('\n⚡ Performance Check...');
        const performanceMetrics = await page.evaluate(() => {
            const timing = performance.timing;
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                fps: window.currentFPS || 'not-measured'
            };
        });
        console.log('Performance metrics:', performanceMetrics);

        // Final comprehensive screenshot
        await page.keyboard.press('KeyD'); // Close dev panel
        await delay(500);
        await captureScreenshot(page, '09-final-state', 'Final state of the application');

        // Generate summary
        console.log('\n📋 Visual Test Summary');
        console.log('======================');
        console.log('✅ Test completed successfully');
        console.log(`📸 ${Object.keys(screenshotsDir).length} screenshots captured`);
        console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

    } catch (error) {
        console.error('\n❌ Test Error:', error);
        await captureScreenshot(page, 'error-state', `Error occurred: ${error.message}`);
    } finally {
        console.log('\n🏁 Test complete. Browser will close in 5 seconds...');
        await delay(5000);
        await browser.close();
    }
}

// Run the test
testUnifiedVIB3().catch(console.error);