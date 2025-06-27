#!/usr/bin/env node

/**
 * Direct Puppeteer test to verify the live site functionality
 * This bypasses the MCP protocol to directly test our enhanced capabilities
 */

const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');

async function testLiveSite() {
    console.log('🚀 Testing live site with Puppeteer...');
    
    const browser = await puppeteer.launch({
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Capture console logs
    page.on('console', msg => console.log(`[SITE LOG]: ${msg.text()}`));
    page.on('error', err => console.error(`[SITE ERROR]: ${err.message}`));
    
    try {
        console.log('📡 Loading live site...');
        await page.goto('https://domusgpt.github.io/vib34d-hypercube-navigation/', { 
            waitUntil: 'networkidle0' 
        });
        
        console.log('⏳ Waiting for site to load...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('📸 Taking screenshot...');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `live_site_screenshot_${timestamp}.png`;
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });
        console.log(`✅ Screenshot saved: ${screenshotPath}`);
        
        console.log('🔍 Debugging site elements...');
        const debugInfo = await page.evaluate(() => {
            const results = {
                url: window.location.href,
                title: document.title,
                webglSupport: false,
                canvases: [],
                visibleElements: {},
                documentReady: document.readyState,
                errors: []
            };
            
            // Check WebGL support
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                results.webglSupport = !!gl;
                if (gl) {
                    results.webglInfo = {
                        vendor: gl.getParameter(gl.VENDOR),
                        renderer: gl.getParameter(gl.RENDERER),
                        version: gl.getParameter(gl.VERSION)
                    };
                }
            } catch (e) {
                results.errors.push(`WebGL check failed: ${e.message}`);
            }
            
            // Check all canvases
            const canvases = document.querySelectorAll('canvas');
            canvases.forEach((canvas, index) => {
                const rect = canvas.getBoundingClientRect();
                results.canvases.push({
                    index,
                    id: canvas.id,
                    className: canvas.className,
                    width: canvas.width,
                    height: canvas.height,
                    displayWidth: rect.width,
                    displayHeight: rect.height,
                    visible: rect.width > 0 && rect.height > 0,
                    contextType: canvas.getContext('webgl') ? 'webgl' : 
                                canvas.getContext('2d') ? '2d' : 'none'
                });
            });
            
            // Check key elements
            const selectors = ['.face', '.nav-item', '.content-section', '[data-face]', '.hypercube-container'];
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                results.visibleElements[selector] = {
                    count: elements.length,
                    visible: Array.from(elements).map(el => {
                        const rect = el.getBoundingClientRect();
                        return {
                            hasContent: el.textContent?.trim().length > 0,
                            visible: rect.width > 0 && rect.height > 0,
                            text: el.textContent?.trim().substring(0, 50) || '',
                            rect: {
                                width: rect.width,
                                height: rect.height,
                                top: rect.top,
                                left: rect.left
                            }
                        };
                    })
                };
            });
            
            return results;
        });
        
        console.log('📊 Debug Results:');
        console.log(JSON.stringify(debugInfo, null, 2));
        
        // Save debug info
        const debugPath = `debug_info_${timestamp}.json`;
        await fs.writeFile(debugPath, JSON.stringify(debugInfo, null, 2));
        console.log(`✅ Debug info saved: ${debugPath}`);
        
        console.log('🎯 Testing interactions...');
        
        // Test drag from edges
        const viewport = page.viewport();
        
        // Test drag from top
        await page.mouse.move(viewport.width / 2, 10);
        await page.mouse.down();
        await page.mouse.move(viewport.width / 2, 100);
        await page.mouse.up();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test click on navigation if available
        const navElements = await page.$$('.nav-item, [data-face]');
        if (navElements.length > 0) {
            console.log(`Found ${navElements.length} navigation elements, clicking first one...`);
            await navElements[0].click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Take screenshot after interactions
        const afterInteractionPath = `after_interaction_${timestamp}.png`;
        await page.screenshot({ 
            path: afterInteractionPath, 
            fullPage: true 
        });
        console.log(`✅ After-interaction screenshot saved: ${afterInteractionPath}`);
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
    } finally {
        await browser.close();
        console.log('🏁 Test completed!');
    }
}

testLiveSite().catch(console.error);