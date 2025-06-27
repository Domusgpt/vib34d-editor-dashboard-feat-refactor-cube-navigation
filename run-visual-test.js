#!/usr/bin/env node

/**
 * Direct VIB3STYLEPACK Visual Test using MCP Server
 * This actually opens a browser and tests the visuals
 */

const puppeteer = require('puppeteer');

async function runVisualTest() {
    console.log('🚀 Starting VIB3STYLEPACK Visual Test...\n');
    
    let browser = null;
    let page = null;
    
    try {
        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({
            headless: false, // Show browser window for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        page = await browser.newPage();
        
        // Set up console logging
        page.on('console', msg => {
            console.log(`[Browser]: ${msg.text()}`);
        });
        
        page.on('error', err => {
            console.error(`[Browser Error]: ${err.message}`);
        });
        
        // Navigate to test page
        console.log('📄 Loading VIB3STYLEPACK test page...');
        const testUrl = 'http://localhost:8000/comprehensive-mcp-vib3-test.html';
        await page.goto(testUrl, { waitUntil: 'networkidle0', timeout: 30000 });
        
        console.log('✅ Page loaded successfully');
        
        // Wait for VIB3 system to initialize
        console.log('⏳ Waiting for VIB3 system initialization...');
        await page.waitForFunction(() => {
            return window.hasOwnProperty('VIB34D_Phase1') || 
                   window.hasOwnProperty('VIB34D_Phase7') ||
                   document.querySelector('#vib3-canvas');
        }, { timeout: 15000 });
        
        // Test 1: Check if phases loaded
        console.log('\n📋 Test 1: Phase Loading');
        const phaseResults = await page.evaluate(() => {
            const results = {};
            for (let i = 1; i <= 8; i++) {
                const phaseKey = `VIB34D_Phase${i}`;
                results[`Phase${i}`] = {
                    available: window.hasOwnProperty(phaseKey),
                    objects: window[phaseKey] ? Object.keys(window[phaseKey]).length : 0
                };
            }
            return results;
        });
        
        Object.entries(phaseResults).forEach(([phase, result]) => {
            console.log(`  ${result.available ? '✅' : '❌'} ${phase}: ${result.available ? result.objects + ' objects' : 'NOT LOADED'}`);
        });
        
        // Test 2: Canvas and WebGL
        console.log('\n🎨 Test 2: Canvas and WebGL');
        const canvasTest = await page.evaluate(() => {
            const canvas = document.getElementById('vib3-canvas');
            if (!canvas) return { exists: false };
            
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return {
                exists: true,
                hasWebGL: !!gl,
                width: canvas.width,
                height: canvas.height,
                renderer: gl ? gl.getParameter(gl.RENDERER) : 'No WebGL'
            };
        });
        
        console.log(`  ${canvasTest.exists ? '✅' : '❌'} Canvas exists: ${canvasTest.exists}`);
        console.log(`  ${canvasTest.hasWebGL ? '✅' : '❌'} WebGL available: ${canvasTest.hasWebGL}`);
        if (canvasTest.hasWebGL) {
            console.log(`  📐 Canvas size: ${canvasTest.width}x${canvasTest.height}`);
            console.log(`  🖥️ Renderer: ${canvasTest.renderer}`);
        }
        
        // Test 3: Initialize VIB3 system
        console.log('\n🔧 Test 3: VIB3 System Initialization');
        try {
            await page.click('button[onclick="initVIB3()"]');
            console.log('  ✅ Clicked initialize button');
            
            // Wait for initialization
            await page.waitForTimeout(3000);
            
            // Check system state
            const systemState = await page.evaluate(() => {
                return {
                    vib3SystemExists: !!window.vib3System,
                    statusDot: document.getElementById('vib3-status')?.className || 'not-found',
                    logEntries: document.querySelectorAll('#vib3-log .log-entry').length
                };
            });
            
            console.log(`  ${systemState.vib3SystemExists ? '✅' : '❌'} VIB3 system initialized: ${systemState.vib3SystemExists}`);
            console.log(`  📊 Status: ${systemState.statusDot}`);
            console.log(`  📝 Log entries: ${systemState.logEntries}`);
            
        } catch (error) {
            console.log(`  ❌ Initialization failed: ${error.message}`);
        }
        
        // Test 4: Test phase transitions
        console.log('\n🔄 Test 4: Phase Transitions');
        try {
            await page.click('button[onclick="testPhaseTransition()"]');
            console.log('  ✅ Triggered phase transition');
            
            await page.waitForTimeout(2000);
            
            const transitionResult = await page.evaluate(() => {
                const logEntries = Array.from(document.querySelectorAll('#vib3-log .log-entry'));
                const latestEntry = logEntries[logEntries.length - 1];
                return latestEntry ? latestEntry.textContent : 'No log entries';
            });
            
            console.log(`  📝 Latest result: ${transitionResult}`);
            
        } catch (error) {
            console.log(`  ❌ Phase transition failed: ${error.message}`);
        }
        
        // Test 5: Test interactions
        console.log('\n🖱️ Test 5: Interaction Testing');
        try {
            await page.click('button[onclick="triggerInteraction()"]');
            console.log('  ✅ Triggered interaction test');
            
            await page.waitForTimeout(2000);
            
        } catch (error) {
            console.log(`  ❌ Interaction test failed: ${error.message}`);
        }
        
        // Test 6: Get performance metrics
        console.log('\n📊 Test 6: Performance Metrics');
        const metrics = await page.evaluate(() => {
            const getMetric = (id) => {
                const element = document.getElementById(id);
                return element ? element.textContent : '--';
            };
            
            return {
                fps: getMetric('vib3-fps'),
                latency: getMetric('mcp-latency'),
                accuracy: getMetric('parse-accuracy'),
                health: getMetric('integration-health'),
                totalParses: getMetric('total-parses'),
                successRate: getMetric('success-rate')
            };
        });
        
        Object.entries(metrics).forEach(([key, value]) => {
            console.log(`  📈 ${key}: ${value}`);
        });
        
        // Test 7: Visual validation (check if anything is actually rendering)
        console.log('\n👁️ Test 7: Visual Rendering Check');
        const visualCheck = await page.evaluate(() => {
            const canvas = document.getElementById('vib3-canvas');
            if (!canvas) return { error: 'No canvas found' };
            
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return { error: 'No WebGL context' };
            
            // Check if anything is being drawn (non-zero pixel data)
            const pixels = new Uint8Array(4);
            gl.readPixels(canvas.width/2, canvas.height/2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            
            return {
                centerPixel: Array.from(pixels),
                isDrawing: pixels.some(p => p > 0),
                glError: gl.getError()
            };
        });
        
        if (visualCheck.error) {
            console.log(`  ❌ Visual check failed: ${visualCheck.error}`);
        } else {
            console.log(`  ${visualCheck.isDrawing ? '✅' : '⚠️'} Rendering detected: ${visualCheck.isDrawing}`);
            console.log(`  🎨 Center pixel: [${visualCheck.centerPixel.join(', ')}]`);
            console.log(`  🔧 GL Error: ${visualCheck.glError}`);
        }
        
        // Take a screenshot for visual proof
        console.log('\n📸 Taking screenshot...');
        await page.screenshot({ 
            path: 'vib3-test-screenshot.png',
            fullPage: true
        });
        console.log('  ✅ Screenshot saved as vib3-test-screenshot.png');
        
        console.log('\n🎉 VISUAL TEST COMPLETED!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

runVisualTest().catch(console.error);