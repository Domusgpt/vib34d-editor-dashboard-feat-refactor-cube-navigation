#!/usr/bin/env node

/**
 * FORENSIC VIB3STYLEPACK BLOG TEST
 * 
 * COMPREHENSIVE ANALYSIS OF EVERY FUNCTION:
 * - Click all interactive elements
 * - Scroll in all directions 
 * - Drag and test all interactions
 * - Monitor console for every message
 * - Take screenshots of every visual state
 * - Test all visualizer reactions
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function forensicBlogTest() {
    console.log('🔍 FORENSIC VIB3STYLEPACK BLOG ANALYSIS');
    console.log('='.repeat(60));
    
    let browser = null;
    let page = null;
    let consoleMessages = [];
    let errorMessages = [];
    let screenshotCount = 0;
    
    try {
        // Launch browser with full debugging
        console.log('🌐 Launching browser for forensic analysis...');
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--enable-webgl',
                '--disable-web-security'
            ],
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        page = await browser.newPage();
        
        // CAPTURE EVERY CONSOLE MESSAGE
        page.on('console', msg => {
            const message = {
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date().toISOString(),
                location: msg.location()
            };
            consoleMessages.push(message);
            console.log(`[${msg.type().toUpperCase()}]: ${msg.text()}`);
        });
        
        // CAPTURE ALL ERRORS
        page.on('error', err => {
            const error = {
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString()
            };
            errorMessages.push(error);
            console.error(`[ERROR]: ${err.message}`);
        });
        
        page.on('pageerror', err => {
            const error = {
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString(),
                type: 'pageerror'
            };
            errorMessages.push(error);
            console.error(`[PAGE ERROR]: ${err.message}`);
        });
        
        // Load the actual VIB3CODE blog
        console.log('\n📄 Loading VIB3CODE morphing blog...');
        const blogUrl = 'http://localhost:8000/vib3code-morphing-blog.html';
        await page.goto(blogUrl, { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        // Take initial screenshot
        const takeScreenshot = async (name) => {
            screenshotCount++;
            const filename = `forensic-${screenshotCount.toString().padStart(2, '0')}-${name}.png`;
            await page.screenshot({ 
                path: filename,
                fullPage: false
            });
            console.log(`📸 Screenshot: ${filename}`);
            return filename;
        };
        
        await takeScreenshot('initial-load');
        
        // Wait for initialization
        console.log('\n⏳ Waiting for blog initialization...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // FORENSIC ANALYSIS 1: Check what systems loaded
        console.log('\n🔍 FORENSIC ANALYSIS 1: System Loading');
        console.log('-'.repeat(40));
        
        const systemStatus = await page.evaluate(() => {
            const analysis = {
                title: document.title,
                windowObjects: Object.keys(window).length,
                vib3Objects: Object.keys(window).filter(k => k.includes('VIB3')),
                vib34dObjects: Object.keys(window).filter(k => k.includes('VIB34D')),
                canvasElements: document.querySelectorAll('canvas').length,
                canvasIds: Array.from(document.querySelectorAll('canvas')).map(c => c.id),
                sections: document.querySelectorAll('section, .section, [data-section]').length,
                buttons: document.querySelectorAll('button').length,
                interactiveElements: document.querySelectorAll('[onclick], [onmouseover], .interactive').length,
                bodyClasses: document.body.className,
                hasVIB3HomeMaster: !!window.VIB3HomeMaster,
                hasVIB34D: !!window.VIB34D_Phase1,
                documentHeight: document.documentElement.scrollHeight,
                viewportHeight: window.innerHeight
            };
            
            // Check for specific VIB3 systems
            if (window.VIB3HomeMaster) {
                analysis.vib3HomeMasterStatus = {
                    exists: true,
                    initialized: typeof window.VIB3HomeMaster.getInstance === 'function'
                };
            }
            
            return analysis;
        });
        
        console.log('📊 System Status:');
        Object.entries(systemStatus).forEach(([key, value]) => {
            console.log(`  ${key}: ${JSON.stringify(value)}`);
        });
        
        await takeScreenshot('system-loaded');
        
        // FORENSIC ANALYSIS 2: Test scrolling interactions
        console.log('\n🔍 FORENSIC ANALYSIS 2: Scroll Testing');
        console.log('-'.repeat(40));
        
        const scrollPositions = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0];
        
        for (const position of scrollPositions) {
            console.log(`📜 Testing scroll position: ${(position * 100).toFixed(0)}%`);
            
            await page.evaluate((pos) => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPosition = maxScroll * pos;
                window.scrollTo(0, scrollPosition);
                
                // Trigger scroll events manually if needed
                window.dispatchEvent(new Event('scroll'));
            }, position);
            
            // Wait for visual updates
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check visual state after scroll
            const scrollState = await page.evaluate(() => {
                return {
                    scrollY: window.scrollY,
                    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
                    canvasPixels: (() => {
                        const canvas = document.querySelector('canvas');
                        if (!canvas) return null;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return null;
                        const imageData = ctx.getImageData(0, 0, 10, 10);
                        return Array.from(imageData.data.slice(0, 12)); // First 3 pixels
                    })()
                };
            });
            
            console.log(`  Scroll Y: ${scrollState.scrollY}, Canvas pixels: ${scrollState.canvasPixels}`);
            await takeScreenshot(`scroll-${(position * 100).toFixed(0)}percent`);
        }
        
        // FORENSIC ANALYSIS 3: Click all interactive elements
        console.log('\n🔍 FORENSIC ANALYSIS 3: Click Testing');
        console.log('-'.repeat(40));
        
        // Get all clickable elements
        const clickableElements = await page.evaluate(() => {
            const elements = [];
            
            // Find all potentially clickable elements
            const selectors = [
                'button',
                '[onclick]',
                'a',
                '.interactive',
                '[data-action]',
                '.clickable',
                'canvas',
                '.section',
                '.blog-post',
                '.nav-item'
            ];
            
            selectors.forEach(selector => {
                const found = document.querySelectorAll(selector);
                found.forEach((el, index) => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        elements.push({
                            selector: selector,
                            index: index,
                            id: el.id || `${selector}-${index}`,
                            className: el.className,
                            text: el.textContent?.substring(0, 50) || '',
                            x: rect.x + rect.width / 2,
                            y: rect.y + rect.height / 2,
                            visible: rect.top < window.innerHeight && rect.bottom > 0
                        });
                    }
                });
            });
            
            return elements;
        });
        
        console.log(`🎯 Found ${clickableElements.length} clickable elements`);
        
        for (const element of clickableElements.slice(0, 10)) { // Test first 10
            try {
                console.log(`🖱️ Clicking: ${element.id} (${element.text})`);
                
                // Scroll element into view if needed
                if (!element.visible) {
                    await page.evaluate((el) => {
                        const elem = document.querySelector(`${el.selector}:nth-child(${el.index + 1})`);
                        if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, element);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                // Click the element
                await page.click(`${element.selector}:nth-child(${element.index + 1})`);
                
                // Wait for reaction
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                await takeScreenshot(`click-${element.id.replace(/[^a-zA-Z0-9]/g, '-')}`);
                
            } catch (error) {
                console.log(`  ❌ Click failed: ${error.message}`);
            }
        }
        
        // FORENSIC ANALYSIS 4: Mouse movement and drag testing
        console.log('\n🔍 FORENSIC ANALYSIS 4: Mouse Movement & Drag Testing');
        console.log('-'.repeat(40));
        
        const mousePositions = [
            [100, 100], [500, 300], [1000, 500], [1500, 200], [800, 800]
        ];
        
        for (const [x, y] of mousePositions) {
            console.log(`🖱️ Moving mouse to: (${x}, ${y})`);
            
            await page.mouse.move(x, y);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check for hover effects
            const hoverState = await page.evaluate((mx, my) => {
                const element = document.elementFromPoint(mx, my);
                return {
                    element: element ? element.tagName : 'none',
                    className: element ? element.className : '',
                    id: element ? element.id : ''
                };
            }, x, y);
            
            console.log(`  Hovering: ${hoverState.element} ${hoverState.className} ${hoverState.id}`);
        }
        
        await takeScreenshot('mouse-movement-complete');
        
        // Test dragging
        console.log('🖱️ Testing drag interactions...');
        await page.mouse.move(500, 300);
        await page.mouse.down();
        await page.mouse.move(700, 500, { steps: 10 });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.mouse.up();
        
        await takeScreenshot('drag-complete');
        
        // FORENSIC ANALYSIS 5: Keyboard interactions
        console.log('\n🔍 FORENSIC ANALYSIS 5: Keyboard Testing');
        console.log('-'.repeat(40));
        
        const keyTests = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'];
        
        for (const key of keyTests) {
            console.log(`⌨️ Testing key: ${key}`);
            await page.keyboard.press(key);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        await takeScreenshot('keyboard-complete');
        
        // FORENSIC ANALYSIS 6: Final system state analysis
        console.log('\n🔍 FORENSIC ANALYSIS 6: Final State Analysis');
        console.log('-'.repeat(40));
        
        const finalState = await page.evaluate(() => {
            const canvases = Array.from(document.querySelectorAll('canvas'));
            
            return {
                timestamp: new Date().toISOString(),
                scroll: {
                    x: window.scrollX,
                    y: window.scrollY,
                    maxX: document.documentElement.scrollWidth - window.innerWidth,
                    maxY: document.documentElement.scrollHeight - window.innerHeight
                },
                canvases: canvases.map(canvas => ({
                    id: canvas.id,
                    width: canvas.width,
                    height: canvas.height,
                    hasContext: !!(canvas.getContext('2d') || canvas.getContext('webgl')),
                    contextType: canvas.getContext('2d') ? '2d' : canvas.getContext('webgl') ? 'webgl' : 'none'
                })),
                performance: {
                    memory: performance.memory ? {
                        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                    } : null,
                    timing: performance.timing ? {
                        load: performance.timing.loadEventEnd - performance.timing.navigationStart,
                        dom: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
                    } : null
                }
            };
        });
        
        console.log('📊 Final State:');
        console.log(JSON.stringify(finalState, null, 2));
        
        await takeScreenshot('final-state');
        
        // GENERATE FORENSIC REPORT
        const forensicReport = {
            timestamp: new Date().toISOString(),
            testDuration: Date.now(),
            screenshotCount: screenshotCount,
            consoleMessages: consoleMessages,
            errorMessages: errorMessages,
            systemStatus: systemStatus,
            finalState: finalState,
            summary: {
                totalConsoleMessages: consoleMessages.length,
                totalErrors: errorMessages.length,
                vib3ObjectsFound: systemStatus.vib3Objects.length,
                vib34dObjectsFound: systemStatus.vib34dObjects.length,
                canvasElementsFound: systemStatus.canvasElements,
                interactiveElementsFound: systemStatus.interactiveElements
            }
        };
        
        fs.writeFileSync('forensic-blog-analysis.json', JSON.stringify(forensicReport, null, 2));
        
        console.log('\n🎉 FORENSIC ANALYSIS COMPLETE!');
        console.log('='.repeat(60));
        console.log(`📊 Total screenshots: ${screenshotCount}`);
        console.log(`📝 Console messages: ${consoleMessages.length}`);
        console.log(`❌ Errors found: ${errorMessages.length}`);
        console.log(`🔧 VIB3 objects: ${systemStatus.vib3Objects.length}`);
        console.log(`🎨 VIB34D objects: ${systemStatus.vib34dObjects.length}`);
        console.log(`🖼️ Canvas elements: ${systemStatus.canvasElements}`);
        console.log('📄 Report saved: forensic-blog-analysis.json');
        
    } catch (error) {
        console.error('❌ Forensic test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

forensicBlogTest().catch(console.error);