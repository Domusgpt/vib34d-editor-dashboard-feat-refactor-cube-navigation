#!/usr/bin/env node

/**
 * HYPERCUBE FACES DEBUG - Find the actual problems
 * Focus on why the multiple faces aren't working properly
 */

const puppeteer = require('puppeteer');

async function debugHypercubeFaces() {
    console.log('🔍 DEBUGGING HYPERCUBE FACES - FINDING THE REAL PROBLEMS');
    console.log('='.repeat(60));
    
    let browser = null;
    let page = null;
    
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        page = await browser.newPage();
        
        // Capture ONLY relevant console messages
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('face') || text.includes('hypercube') || text.includes('ERROR') || text.includes('failed')) {
                console.log(`[${msg.type().toUpperCase()}]: ${text}`);
            }
        });
        
        page.on('error', err => {
            console.error(`[ERROR]: ${err.message}`);
        });
        
        // Load blog
        await page.goto('http://localhost:8000/vib3code-morphing-blog.html', { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // DEBUG 1: Check hypercube face structure
        console.log('\n🔍 DEBUG 1: Hypercube Face Structure');
        console.log('-'.repeat(40));
        
        const faceStructure = await page.evaluate(() => {
            const faces = document.querySelectorAll('.hypercube-face, [class*="face"]');
            const analysis = {
                totalFaces: faces.length,
                faces: []
            };
            
            faces.forEach((face, index) => {
                const rect = face.getBoundingClientRect();
                analysis.faces.push({
                    index: index,
                    id: face.id,
                    className: face.className,
                    visible: rect.width > 0 && rect.height > 0,
                    position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                    hasCanvas: !!face.querySelector('canvas'),
                    canvasId: face.querySelector('canvas')?.id || 'none',
                    innerHTML: face.innerHTML.length
                });
            });
            
            return analysis;
        });
        
        console.log(`📊 Found ${faceStructure.totalFaces} faces:`);
        faceStructure.faces.forEach(face => {
            console.log(`  Face ${face.index}: ${face.id} (${face.className})`);
            console.log(`    Visible: ${face.visible}, Canvas: ${face.canvasId}`);
            console.log(`    Size: ${face.position.width}x${face.position.height}`);
        });
        
        // DEBUG 2: Check canvas rendering state
        console.log('\n🔍 DEBUG 2: Canvas Rendering Analysis');
        console.log('-'.repeat(40));
        
        const canvasAnalysis = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const analysis = [];
            
            canvases.forEach(canvas => {
                const rect = canvas.getBoundingClientRect();
                const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                const ctx2d = canvas.getContext('2d');
                
                let contextInfo = 'none';
                let renderingActive = false;
                
                if (gl) {
                    contextInfo = 'webgl';
                    // Check if WebGL is actually drawing
                    const pixels = new Uint8Array(4);
                    gl.readPixels(canvas.width/2, canvas.height/2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                    renderingActive = pixels.some(p => p > 0);
                } else if (ctx2d) {
                    contextInfo = '2d';
                    const imageData = ctx2d.getImageData(canvas.width/2, canvas.height/2, 1, 1);
                    renderingActive = imageData.data.some(p => p > 0);
                }
                
                analysis.push({
                    id: canvas.id,
                    size: `${canvas.width}x${canvas.height}`,
                    position: `${rect.x},${rect.y}`,
                    visible: rect.width > 0 && rect.height > 0,
                    context: contextInfo,
                    rendering: renderingActive,
                    style: canvas.style.cssText
                });
            });
            
            return analysis;
        });
        
        console.log('🎨 Canvas States:');
        canvasAnalysis.forEach(canvas => {
            const status = canvas.rendering ? '✅ RENDERING' : '❌ BLANK';
            console.log(`  ${canvas.id}: ${canvas.size} ${status} (${canvas.context})`);
            if (!canvas.visible) console.log(`    ⚠️ NOT VISIBLE`);
        });
        
        // DEBUG 3: Test face transitions
        console.log('\n🔍 DEBUG 3: Face Transition Testing');
        console.log('-'.repeat(40));
        
        // Try arrow key navigation
        for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
            console.log(`⌨️ Testing ${key}...`);
            
            await page.keyboard.press(key);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const afterKeyPress = await page.evaluate(() => {
                const activeFace = document.querySelector('.active, .current, [data-active="true"]');
                const visibleFaces = Array.from(document.querySelectorAll('.hypercube-face, [class*="face"]'))
                    .filter(face => {
                        const rect = face.getBoundingClientRect();
                        return rect.width > 0 && rect.height > 0;
                    });
                
                return {
                    activeFace: activeFace ? activeFace.className : 'none',
                    visibleFaceCount: visibleFaces.length,
                    visibleFaceIds: visibleFaces.map(f => f.id || f.className)
                };
            });
            
            console.log(`  Active: ${afterKeyPress.activeFace}, Visible: ${afterKeyPress.visibleFaceCount}`);
        }
        
        // DEBUG 4: Check VIB3HomeMaster state
        console.log('\n🔍 DEBUG 4: VIB3HomeMaster State Analysis');
        console.log('-'.repeat(40));
        
        const vib3State = await page.evaluate(() => {
            // Check for VIB3HomeMaster
            if (window.VIB3HomeMaster) {
                const instance = window.VIB3HomeMaster.getInstance();
                if (instance) {
                    return {
                        exists: true,
                        masterState: instance.masterState || 'no masterState',
                        activeSection: instance.masterState?.activeSection || 'unknown',
                        visualizerCount: instance.visualizers?.size || 0,
                        sectionModifiers: Object.keys(instance.sectionModifiers || {})
                    };
                }
            }
            
            // Check for any other VIB3 systems
            const vib3Objects = Object.keys(window).filter(k => k.includes('VIB3') || k.includes('vib3'));
            
            return {
                exists: false,
                vib3Objects: vib3Objects,
                windowVIB3HomeMaster: !!window.VIB3HomeMaster
            };
        });
        
        console.log('🏠 VIB3HomeMaster Status:');
        if (vib3State.exists) {
            console.log(`  ✅ Active - Section: ${vib3State.activeSection}, Visualizers: ${vib3State.visualizerCount}`);
        } else {
            console.log(`  ❌ Not found or not initialized`);
            console.log(`  Available VIB3 objects: ${vib3State.vib3Objects.join(', ')}`);
        }
        
        // DEBUG 5: Check actual geometry rendering
        console.log('\n🔍 DEBUG 5: Geometry Rendering Check');
        console.log('-'.repeat(40));
        
        const geometryCheck = await page.evaluate(() => {
            const results = [];
            
            // Check each canvas for actual WebGL rendering
            document.querySelectorAll('canvas').forEach(canvas => {
                const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                if (gl) {
                    // Check shader programs
                    const programs = [];
                    
                    // Try to access WebGL state
                    const activeProgram = gl.getParameter(gl.CURRENT_PROGRAM);
                    const viewport = gl.getParameter(gl.VIEWPORT);
                    
                    results.push({
                        canvasId: canvas.id,
                        hasActiveProgram: !!activeProgram,
                        viewport: Array.from(viewport),
                        clearColor: Array.from(gl.getParameter(gl.COLOR_CLEAR_VALUE)),
                        buffers: gl.getParameter(gl.ARRAY_BUFFER_BINDING) !== null
                    });
                }
            });
            
            return results;
        });
        
        console.log('🔧 WebGL States:');
        geometryCheck.forEach(result => {
            const status = result.hasActiveProgram ? '✅ PROGRAM ACTIVE' : '❌ NO PROGRAM';
            console.log(`  ${result.canvasId}: ${status}`);
            console.log(`    Viewport: ${result.viewport.join('x')}`);
        });
        
        // Take final diagnostic screenshot
        await page.screenshot({ path: 'debug-hypercube-analysis.png', fullPage: false });
        console.log('\n📸 Debug screenshot saved: debug-hypercube-analysis.png');
        
        console.log('\n🎯 DIAGNOSIS COMPLETE - Check output above for specific issues');
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

debugHypercubeFaces().catch(console.error);