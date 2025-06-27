#!/usr/bin/env node

/**
 * Comprehensive Live Site Analysis using Puppeteer
 * This will provide detailed insights into what's actually working and what's broken
 */

const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');

async function comprehensiveAnalysis() {
    console.log('🔍 Starting comprehensive live site analysis...');
    
    const browser = await puppeteer.launch({
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    // Capture all console activity
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
        const message = `[${msg.type()}] ${msg.text()}`;
        console.log(message);
        consoleMessages.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
        });
    });
    
    page.on('error', err => {
        console.error(`[ERROR]: ${err.message}`);
        errors.push({
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
    });
    
    try {
        console.log('📡 Loading https://domusgpt.github.io/vib34d-hypercube-navigation/');
        await page.goto('https://domusgpt.github.io/vib34d-hypercube-navigation/', { 
            waitUntil: 'networkidle0' 
        });
        
        console.log('⏳ Waiting 8 seconds for full initialization...');
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        // Take initial screenshot
        console.log('📸 Taking initial screenshot...');
        await page.screenshot({ 
            path: 'analysis_initial.png', 
            fullPage: true 
        });
        
        // Comprehensive element analysis
        console.log('🔍 Analyzing all page elements...');
        const analysis = await page.evaluate(() => {
            const results = {
                // Basic page info
                url: window.location.href,
                title: document.title,
                documentReady: document.readyState,
                timestamp: new Date().toISOString(),
                
                // WebGL and Canvas analysis
                webgl: {
                    supported: false,
                    context: null,
                    canvases: []
                },
                
                // Navigation and content elements
                navigation: {
                    bezelDragElements: [],
                    clickableElements: [],
                    navigationButtons: []
                },
                
                // Content analysis
                content: {
                    textElements: [],
                    sections: [],
                    visibleText: []
                },
                
                // Visual elements
                visual: {
                    backgroundElements: [],
                    cards: [],
                    sidebars: []
                },
                
                // Interaction capabilities
                interactions: {
                    dragCapable: false,
                    clickHandlers: [],
                    eventListeners: []
                },
                
                // Errors and issues
                issues: []
            };
            
            // WebGL Analysis
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                results.webgl.supported = !!gl;
                if (gl) {
                    results.webgl.context = {
                        vendor: gl.getParameter(gl.VENDOR),
                        renderer: gl.getParameter(gl.RENDERER),
                        version: gl.getParameter(gl.VERSION)
                    };
                }
            } catch (e) {
                results.issues.push(`WebGL test failed: ${e.message}`);
            }
            
            // Canvas Analysis
            const canvases = document.querySelectorAll('canvas');
            canvases.forEach((canvas, index) => {
                const rect = canvas.getBoundingClientRect();
                const style = getComputedStyle(canvas);
                
                results.webgl.canvases.push({
                    index,
                    id: canvas.id,
                    className: canvas.className,
                    dimensions: {
                        canvas: { width: canvas.width, height: canvas.height },
                        display: { width: rect.width, height: rect.height },
                        position: { top: rect.top, left: rect.left }
                    },
                    visible: rect.width > 0 && rect.height > 0 && style.display !== 'none',
                    contextType: canvas.getContext('webgl') ? 'webgl' : 
                                canvas.getContext('2d') ? '2d' : 'none',
                    zIndex: style.zIndex,
                    opacity: style.opacity
                });
            });
            
            // Navigation Analysis - Look for ALL possible navigation elements
            const navSelectors = [
                'button', 'a[href]', '[onclick]', '[data-face]', 
                '.nav-item', '.face', '.card', '.button',
                '[role="button"]', '.clickable', '.interactive'
            ];
            
            navSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el, index) => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        results.navigation.clickableElements.push({
                            selector,
                            index,
                            text: el.textContent?.trim().substring(0, 50) || '',
                            id: el.id,
                            className: el.className,
                            attributes: Array.from(el.attributes).reduce((acc, attr) => {
                                acc[attr.name] = attr.value;
                                return acc;
                            }, {}),
                            rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left },
                            hasEventListeners: el.onclick !== null || el.getAttribute('onclick') !== null
                        });
                    }
                });
            });
            
            // Content Analysis - Look for actual text content
            const contentSelectors = [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 
                '.content', '.section', '.card-content', '.text'
            ];
            
            contentSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el, index) => {
                    const text = el.textContent?.trim();
                    if (text && text.length > 3) {
                        const rect = el.getBoundingClientRect();
                        results.content.textElements.push({
                            selector,
                            text: text.substring(0, 100),
                            visible: rect.width > 0 && rect.height > 0,
                            rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left }
                        });
                    }
                });
            });
            
            // Check for drag functionality
            results.interactions.dragCapable = typeof window.addEventListener === 'function';
            
            // Check for VIB3 system availability
            if (window.vib3System) {
                results.vib3System = {
                    available: true,
                    homeMaster: !!window.vib3System.homeMaster,
                    reactivityBridge: !!window.vib3System.reactivityBridge,
                    visualizers: window.vib3System.visualizers ? Object.keys(window.vib3System.visualizers).length : 0
                };
            }
            
            // Check for specific functionality
            const bodyClasses = document.body.className;
            const hasFixedArchitecture = bodyClasses.includes('fixed-architecture');
            
            results.architecture = {
                type: hasFixedArchitecture ? 'FIXED' : 'UNKNOWN',
                bodyClasses: bodyClasses
            };
            
            return results;
        });
        
        console.log('📊 Analysis Results:');
        console.log('=====================================');
        console.log(`✅ Site loaded: ${analysis.title}`);
        console.log(`✅ WebGL supported: ${analysis.webgl.supported}`);
        console.log(`📊 Found ${analysis.webgl.canvases.length} canvases`);
        console.log(`📊 Found ${analysis.navigation.clickableElements.length} clickable elements`);
        console.log(`📊 Found ${analysis.content.textElements.length} text elements`);
        
        if (analysis.vib3System) {
            console.log(`✅ VIB3 System available: ${analysis.vib3System.available}`);
            console.log(`📊 VIB3 Visualizers: ${analysis.vib3System.visualizers}`);
        }
        
        console.log(`🏗️ Architecture: ${analysis.architecture.type}`);
        
        // Test bezel drag functionality
        console.log('🎯 Testing bezel drag from each edge...');
        const viewport = page.viewport();
        
        const dragTests = [
            { name: 'top', from: [viewport.width / 2, 5], to: [viewport.width / 2, 150] },
            { name: 'bottom', from: [viewport.width / 2, viewport.height - 5], to: [viewport.width / 2, viewport.height - 150] },
            { name: 'left', from: [5, viewport.height / 2], to: [150, viewport.height / 2] },
            { name: 'right', from: [viewport.width - 5, viewport.height / 2], to: [viewport.width - 150, viewport.height / 2] }
        ];
        
        for (const test of dragTests) {
            console.log(`  Testing drag from ${test.name}...`);
            await page.mouse.move(test.from[0], test.from[1]);
            await page.mouse.down();
            await page.mouse.move(test.to[0], test.to[1]);
            await page.mouse.up();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Take screenshot after each drag
            await page.screenshot({ 
                path: `analysis_after_drag_${test.name}.png`, 
                fullPage: true 
            });
        }
        
        // Test clicking on navigation elements if any exist
        if (analysis.navigation.clickableElements.length > 0) {
            console.log('🖱️ Testing clicks on navigation elements...');
            
            // Click on first few clickable elements
            const elementsToTest = analysis.navigation.clickableElements.slice(0, 3);
            
            for (let i = 0; i < elementsToTest.length; i++) {
                const element = elementsToTest[i];
                console.log(`  Clicking on: ${element.text || element.selector} (${element.id || element.className})`);
                
                try {
                    if (element.id) {
                        await page.click(`#${element.id}`);
                    } else if (element.className) {
                        await page.click(`.${element.className.split(' ')[0]}`);
                    } else {
                        await page.click(element.selector);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await page.screenshot({ 
                        path: `analysis_after_click_${i}.png`, 
                        fullPage: true 
                    });
                } catch (e) {
                    console.log(`    Click failed: ${e.message}`);
                }
            }
        }
        
        // Save comprehensive analysis
        await fs.writeFile('comprehensive_analysis.json', JSON.stringify({
            analysis,
            consoleMessages,
            errors,
            timestamp: new Date().toISOString()
        }, null, 2));
        
        console.log('✅ Comprehensive analysis complete!');
        console.log('📄 Files created:');
        console.log('  - analysis_initial.png (initial screenshot)');
        console.log('  - analysis_after_drag_*.png (screenshots after each drag test)');
        console.log('  - analysis_after_click_*.png (screenshots after clicking elements)');
        console.log('  - comprehensive_analysis.json (detailed analysis data)');
        
    } catch (error) {
        console.error('❌ Analysis failed:', error);
    } finally {
        await browser.close();
        console.log('🏁 Analysis completed!');
    }
}

comprehensiveAnalysis().catch(console.error);