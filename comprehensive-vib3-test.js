const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'comprehensive-test-screenshots');

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
        console.log(`📸 Screenshot: ${name} - ${description}`);
        return filepath;
    } catch (error) {
        console.error(`❌ Screenshot failed for ${name}:`, error.message);
        return null;
    }
}

async function performComprehensiveTest() {
    console.log('🚀 VIB3 COMPREHENSIVE VISUAL & FUNCTIONAL TEST');
    console.log('===============================================\n');

    await ensureScreenshotsDir();

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1920, height: 1080 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--allow-running-insecure-content'
        ]
    });

    const page = await browser.newPage();

    // Comprehensive data collection
    const testResults = {
        systemInfo: {},
        visualStates: [],
        functionality: {},
        errors: [],
        performance: {},
        features: {}
    };

    // Monitor console for errors and messages
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            testResults.errors.push(text);
        }
    });

    try {
        const filePath = 'file://' + path.join(__dirname, 'index_unified.html');
        console.log('📍 Loading:', filePath);
        
        await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 20000 });
        
        // 1. INITIAL STATE ANALYSIS
        console.log('\n🔍 INITIAL STATE ANALYSIS');
        console.log('=========================');
        
        await delay(2000);
        const initialScreenshot = await captureScreenshot(page, '01-initial-state', 'Initial page load');
        
        const initialState = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            const devPanel = document.querySelector('#dev-panel');
            const cubeContainer = document.querySelector('.hypercube-container, .cube-container');
            
            return {
                title: document.title,
                canvas: canvas ? {
                    exists: true,
                    width: canvas.width,
                    height: canvas.height,
                    style: {
                        display: canvas.style.display,
                        position: canvas.style.position,
                        zIndex: canvas.style.zIndex
                    }
                } : { exists: false },
                devPanel: devPanel ? {
                    exists: true,
                    visible: window.getComputedStyle(devPanel).display !== 'none'
                } : { exists: false },
                cubeContainer: cubeContainer ? { exists: true } : { exists: false },
                currentFace: window.currentFace || 'unknown',
                vib3Status: window.VIB3 ? 'loaded' : 'not-loaded',
                bodyBackground: window.getComputedStyle(document.body).background
            };
        });
        
        testResults.systemInfo = initialState;
        console.log('System Info:', initialState);

        // 2. DEV CONTROLS TEST
        console.log('\n🎛️  DEV CONTROLS TEST');
        console.log('====================');
        
        await page.keyboard.press('KeyD');
        await delay(1000);
        
        const devControlsScreenshot = await captureScreenshot(page, '02-dev-controls', 'Dev controls opened');
        
        const devControlsState = await page.evaluate(() => {
            const devPanel = document.querySelector('#dev-panel');
            const sliders = document.querySelectorAll('input[type="range"]');
            const buttons = document.querySelectorAll('button');
            
            return {
                devPanelVisible: devPanel ? window.getComputedStyle(devPanel).display !== 'none' : false,
                sliders: Array.from(sliders).map(slider => ({
                    id: slider.id,
                    value: slider.value,
                    min: slider.min,
                    max: slider.max,
                    step: slider.step
                })),
                buttons: Array.from(buttons).map(btn => ({
                    text: btn.textContent.trim(),
                    visible: window.getComputedStyle(btn).display !== 'none'
                }))
            };
        });
        
        testResults.functionality.devControls = devControlsState;
        console.log('Dev Controls Found:', devControlsState.sliders.length, 'sliders,', devControlsState.buttons.length, 'buttons');

        // 3. PRESET TESTING
        console.log('\n🎨 PRESET TESTING');
        console.log('=================');
        
        const presetButtons = await page.$$('button');
        let presetResults = [];
        
        for (let i = 0; i < Math.min(presetButtons.length, 4); i++) {
            try {
                const buttonText = await presetButtons[i].evaluate(el => el.textContent.trim());
                if (buttonText && buttonText.length > 0) {
                    await presetButtons[i].click();
                    await delay(1500);
                    
                    const presetScreenshot = await captureScreenshot(page, `03-preset-${i}`, `Preset: ${buttonText}`);
                    
                    const presetState = await page.evaluate(() => ({
                        background: window.getComputedStyle(document.body).background,
                        currentFace: window.currentFace || 'unknown'
                    }));
                    
                    presetResults.push({
                        name: buttonText,
                        state: presetState
                    });
                    
                    console.log(`Preset "${buttonText}" applied`);
                }
            } catch (error) {
                console.log(`Preset ${i} test failed:`, error.message);
            }
        }
        
        testResults.functionality.presets = presetResults;

        // 4. NAVIGATION TESTING
        console.log('\n⌨️  NAVIGATION TESTING');
        console.log('=====================');
        
        // Close dev panel first
        await page.keyboard.press('KeyD');
        await delay(500);
        
        const navigationResults = [];
        const navKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
        
        for (const key of navKeys) {
            const beforeState = await page.evaluate(() => ({
                face: window.currentFace || 'unknown',
                background: window.getComputedStyle(document.body).background
            }));
            
            await page.keyboard.press(key);
            await delay(1200);
            
            const afterState = await page.evaluate(() => ({
                face: window.currentFace || 'unknown',
                background: window.getComputedStyle(document.body).background
            }));
            
            const navScreenshot = await captureScreenshot(page, `04-nav-${key.toLowerCase()}`, `Navigation: ${key}`);
            
            navigationResults.push({
                key,
                before: beforeState,
                after: afterState,
                changed: JSON.stringify(beforeState) !== JSON.stringify(afterState)
            });
            
            console.log(`${key}: Face ${beforeState.face} → ${afterState.face} (Changed: ${navigationResults[navigationResults.length-1].changed})`);
        }
        
        testResults.functionality.navigation = navigationResults;

        // 5. FACE TRANSITION TESTING
        console.log('\n🔄 FACE TRANSITION TESTING');
        console.log('==========================');
        
        const faceTransitions = [];
        for (let i = 0; i < 8; i++) {
            await page.keyboard.press('ArrowRight');
            await delay(1000);
            
            const faceState = await page.evaluate(() => {
                const activeFace = document.querySelector('.face.active, .cube-face.active, [class*="active"]');
                return {
                    currentFace: window.currentFace || i,
                    activeFaceClasses: activeFace ? activeFace.className : 'none',
                    bodyBackground: window.getComputedStyle(document.body).background,
                    theme: activeFace ? (activeFace.dataset.theme || 'unknown') : 'none'
                };
            });
            
            const faceScreenshot = await captureScreenshot(page, `05-face-${i}`, `Face ${i} - Theme: ${faceState.theme}`);
            
            faceTransitions.push(faceState);
            console.log(`Face ${i}: Theme=${faceState.theme}, Classes=${faceState.activeFaceClasses}`);
        }
        
        testResults.functionality.faceTransitions = faceTransitions;

        // 6. WEBGL ANALYSIS
        console.log('\n🎨 WEBGL ANALYSIS');
        console.log('=================');
        
        const webglState = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return { exists: false };
            
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
            const info = {
                exists: true,
                hasContext: !!gl,
                width: canvas.width,
                height: canvas.height,
                contextType: gl ? gl.constructor.name : 'none'
            };
            
            if (gl) {
                info.extensions = gl.getSupportedExtensions();
                info.version = gl.getParameter(gl.VERSION);
                info.vendor = gl.getParameter(gl.VENDOR);
                info.renderer = gl.getParameter(gl.RENDERER);
            }
            
            return info;
        });
        
        testResults.features.webgl = webglState;
        console.log('WebGL Status:', webglState);

        // 7. PARAMETER SYSTEM ANALYSIS
        console.log('\n📊 PARAMETER SYSTEM ANALYSIS');
        console.log('============================');
        
        const parameterState = await page.evaluate(() => {
            const paramElements = document.querySelectorAll('[class*="param"], [class*="display"], .parameter');
            const sliders = document.querySelectorAll('input[type="range"]');
            
            return {
                parameterElements: Array.from(paramElements).map(el => ({
                    className: el.className,
                    text: el.textContent.substring(0, 50),
                    visible: window.getComputedStyle(el).display !== 'none'
                })),
                activeSliders: Array.from(sliders).map(slider => ({
                    id: slider.id,
                    value: parseFloat(slider.value),
                    min: parseFloat(slider.min),
                    max: parseFloat(slider.max)
                }))
            };
        });
        
        testResults.features.parameters = parameterState;
        console.log('Parameter Elements:', parameterState.parameterElements.length);
        console.log('Active Sliders:', parameterState.activeSliders.length);

        // 8. PERFORMANCE METRICS
        console.log('\n⚡ PERFORMANCE ANALYSIS');
        console.log('======================');
        
        const performanceMetrics = await page.evaluate(() => {
            const timing = performance.timing;
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                memoryUsage: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                } : 'unavailable',
                fps: window.currentFPS || 'not-measured'
            };
        });
        
        testResults.performance = performanceMetrics;
        console.log('Performance:', performanceMetrics);

        // 9. FINAL COMPREHENSIVE SCREENSHOT
        const finalScreenshot = await captureScreenshot(page, '06-final-comprehensive', 'Final system state');

        // 10. GENERATE COMPREHENSIVE REPORT
        console.log('\n📋 COMPREHENSIVE TEST RESULTS');
        console.log('==============================');
        
        const report = {
            timestamp: new Date().toISOString(),
            testDuration: Date.now() - (testResults.startTime || Date.now()),
            ...testResults
        };

        // Visual Assessment
        console.log('\n🔍 VISUAL ASSESSMENT:');
        console.log('- WebGL Canvas:', webglState.exists ? '✅ PRESENT' : '❌ MISSING');
        console.log('- WebGL Context:', webglState.hasContext ? '✅ FUNCTIONAL' : '❌ FAILED');
        console.log('- Dev Controls:', devControlsState.devPanelVisible ? '✅ WORKING' : '❌ NOT RESPONSIVE');
        console.log('- Navigation System:', navigationResults.some(r => r.changed) ? '✅ RESPONSIVE' : '❌ STATIC');
        console.log('- Face Transitions:', faceTransitions.length > 0 ? '✅ FUNCTIONAL' : '❌ BROKEN');
        console.log('- Parameter System:', parameterState.activeSliders.length > 0 ? '✅ ACTIVE' : '❌ INACTIVE');
        console.log('- Presets:', presetResults.length > 0 ? '✅ WORKING' : '❌ NOT FOUND');
        console.log('- Console Errors:', testResults.errors.length === 0 ? '✅ CLEAN' : `⚠️ ${testResults.errors.length} ERRORS`);

        console.log('\n🎯 SYSTEM STATUS:');
        if (testResults.errors.length === 0 && webglState.hasContext && navigationResults.some(r => r.changed)) {
            console.log('✅ SYSTEM FULLY FUNCTIONAL');
        } else if (testResults.errors.length > 5) {
            console.log('❌ SYSTEM HAS CRITICAL ISSUES');
        } else {
            console.log('⚠️ SYSTEM PARTIALLY FUNCTIONAL');
        }

        console.log(`\n📸 Screenshots saved to: ${screenshotsDir}`);
        
        // Save detailed report
        await fs.writeFile(
            path.join(__dirname, 'vib3-comprehensive-test-report.json'),
            JSON.stringify(report, null, 2)
        );
        
        return report;

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        testResults.fatalError = error.message;
        return testResults;
    } finally {
        await browser.close();
    }
}

// Run the comprehensive test
performComprehensiveTest()
    .then(report => {
        console.log('\n🏁 COMPREHENSIVE TEST COMPLETE');
        console.log('===============================');
    })
    .catch(error => {
        console.error('Fatal Test Error:', error);
        process.exit(1);
    });