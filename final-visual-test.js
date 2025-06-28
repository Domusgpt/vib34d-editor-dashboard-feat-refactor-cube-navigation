const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

async function finalVisualTest() {
    console.log('🎯 FINAL COMPREHENSIVE VIB3 VISUAL TEST');
    console.log('========================================\n');

    const screenshotsDir = path.join(__dirname, 'final-test-screenshots');
    await fs.mkdir(screenshotsDir, { recursive: true }).catch(() => {});

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const testResults = [];

    // Console monitoring
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
    });

    try {
        const filePath = 'file://' + path.join(__dirname, 'index_unified.html');
        await page.goto(filePath, { waitUntil: 'networkidle0' });
        
        // 1. Initial state
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotsDir, '01-initial.png'), fullPage: true });
        
        const initialState = await page.evaluate(() => ({
            title: document.title,
            hasCanvas: !!document.querySelector('canvas'),
            currentFace: window.currentFace || 'not-set',
            bodyBg: window.getComputedStyle(document.body).background
        }));
        testResults.push({ step: 'initial', state: initialState });

        // 2. Test 'D' key for dev controls
        await page.keyboard.press('KeyD');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotsDir, '02-dev-controls.png'), fullPage: true });

        const devControlsState = await page.evaluate(() => {
            const devPanel = document.querySelector('#dev-panel');
            return {
                devPanelExists: !!devPanel,
                devPanelVisible: devPanel ? window.getComputedStyle(devPanel).display !== 'none' : false,
                sliderCount: document.querySelectorAll('input[type="range"]').length,
                buttonCount: document.querySelectorAll('button').length
            };
        });
        testResults.push({ step: 'dev-controls', state: devControlsState });

        // 3. Navigation test - all arrow keys
        const navKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
        for (let i = 0; i < navKeys.length; i++) {
            const key = navKeys[i];
            await page.keyboard.press(key);
            await page.waitForTimeout(1200);
            
            const filename = `03-nav-${key.toLowerCase()}-${i}.png`;
            await page.screenshot({ path: path.join(screenshotsDir, filename), fullPage: true });
            
            const navState = await page.evaluate(() => ({
                currentFace: window.currentFace || 'unknown',
                bodyBg: window.getComputedStyle(document.body).background,
                activeElements: document.querySelectorAll('.active').length
            }));
            testResults.push({ step: `navigation-${key}`, state: navState });
        }

        // 4. Continuous navigation to see all faces
        for (let face = 0; face < 8; face++) {
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(1000);
            
            const filename = `04-face-${face}.png`;
            await page.screenshot({ path: path.join(screenshotsDir, filename), fullPage: true });
            
            const faceState = await page.evaluate((faceNum) => {
                const activeFace = document.querySelector('.face.active, .cube-face.active');
                return {
                    faceNumber: faceNum,
                    currentFace: window.currentFace || 'unknown',
                    activeFaceClasses: activeFace ? activeFace.className : 'none',
                    theme: activeFace ? (activeFace.dataset.theme || 'unknown') : 'none',
                    bodyBg: window.getComputedStyle(document.body).background
                };
            }, face);
            testResults.push({ step: `face-${face}`, state: faceState });
        }

        // 5. WebGL and Canvas analysis
        const webglInfo = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return { exists: false };
            
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
            return {
                exists: true,
                width: canvas.width,
                height: canvas.height,
                hasWebGL: !!gl,
                contextType: gl ? gl.constructor.name : 'none'
            };
        });
        testResults.push({ step: 'webgl-analysis', state: webglInfo });

        // 6. Final comprehensive screenshot
        await page.screenshot({ path: path.join(screenshotsDir, '05-final.png'), fullPage: true });

        // Generate report
        const report = {
            timestamp: new Date().toISOString(),
            screenshotDirectory: screenshotsDir,
            consoleMessages: consoleMessages,
            testResults: testResults,
            summary: {
                totalSteps: testResults.length,
                canvasFound: webglInfo.exists,
                webglWorking: webglInfo.hasWebGL,
                navigationResponsive: testResults.filter(r => r.step.includes('face-')).some(r => r.state.currentFace !== 'unknown'),
                devControlsFound: devControlsState.devPanelExists,
                consoleErrors: consoleMessages.filter(m => m.type === 'error').length
            }
        };

        await fs.writeFile(
            path.join(__dirname, 'final-vib3-test-report.json'),
            JSON.stringify(report, null, 2)
        );

        console.log('📊 TEST RESULTS SUMMARY:');
        console.log('=========================');
        console.log(`✅ Canvas Present: ${webglInfo.exists}`);
        console.log(`✅ WebGL Working: ${webglInfo.hasWebGL}`);
        console.log(`✅ Dev Controls: ${devControlsState.devPanelExists ? 'Found' : 'Not Found'}`);
        console.log(`✅ Navigation: ${report.summary.navigationResponsive ? 'Responsive' : 'Static'}`);
        console.log(`📸 Screenshots: ${screenshotsDir}`);
        console.log(`📋 Report: final-vib3-test-report.json`);

        return report;

    } catch (error) {
        console.error('Test Error:', error);
        return { error: error.message };
    } finally {
        await browser.close();
    }
}

finalVisualTest().then(report => {
    console.log('\n🏁 Final test completed');
}).catch(console.error);