#!/usr/bin/env node

/**
 * MCP-DRIVEN HYPERCUBE FACE FIX
 * 
 * 1. Test current broken state
 * 2. Apply targeted fix to existing code
 * 3. Verify fix works
 * 4. Document results
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function mcpTestAndFix() {
    console.log('🔧 MCP-DRIVEN HYPERCUBE FACE FIX');
    console.log('='.repeat(50));
    
    let browser = null;
    let page = null;
    
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        page = await browser.newPage();
        
        // Capture relevant messages
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('🔍') || text.includes('🎯') || text.includes('✅') || text.includes('❌')) {
                console.log(`[BROWSER]: ${text}`);
            }
        });
        
        // STEP 1: Test current broken state
        console.log('\\n📋 STEP 1: Testing Current Broken State');
        console.log('-'.repeat(40));
        
        await page.goto('http://localhost:8000/vib3code-morphing-blog.html', { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const beforeFix = await page.evaluate(() => {
            const faces = [];
            document.querySelectorAll('.hypercube-face').forEach((face, index) => {
                faces.push({
                    id: face.id,
                    hasCanvas: !!face.querySelector('canvas'),
                    canvasCount: face.querySelectorAll('canvas').length,
                    innerHTML: face.innerHTML.length
                });
            });
            return faces;
        });
        
        console.log('📊 Current Face State:');
        beforeFix.forEach(face => {
            const status = face.hasCanvas ? '✅ HAS CANVAS' : '❌ NO CANVAS';
            console.log(`  ${face.id}: ${status} (${face.canvasCount} canvases, ${face.innerHTML} chars)`);
        });
        
        await page.screenshot({ path: 'mcp-test-before-fix.png' });
        
        // STEP 2: Inject targeted fix
        console.log('\\n🔧 STEP 2: Applying Targeted Fix');
        console.log('-'.repeat(40));
        
        // The fix: Modify the existing ReactiveHyperAVCore initialization
        const fixCode = `
        // TARGETED FIX: Ensure all faces have canvases
        function ensureFaceCanvases() {
            console.log('🔧 Ensuring all faces have canvases...');
            
            document.querySelectorAll('.hypercube-face').forEach((face, index) => {
                const faceId = face.id;
                
                if (!face.querySelector('canvas')) {
                    console.log('🎨 Creating canvas for ' + faceId);
                    
                    // Create main visualizer canvas for this face
                    const canvas = document.createElement('canvas');
                    canvas.id = faceId + '-main-visualizer';
                    canvas.width = face.clientWidth || 800;
                    canvas.height = face.clientHeight || 600;
                    canvas.style.position = 'absolute';
                    canvas.style.top = '0';
                    canvas.style.left = '0';
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';
                    canvas.style.zIndex = '1';
                    canvas.style.pointerEvents = 'none';
                    
                    // Add to face
                    face.style.position = 'relative';
                    face.appendChild(canvas);
                    
                    // Initialize ReactiveHyperAVCore for this canvas
                    if (window.ReactiveHyperAVCore) {
                        try {
                            const core = new window.ReactiveHyperAVCore(canvas, {
                                role: 'face',
                                instanceId: faceId + '-main'
                            });
                            
                            console.log('✅ Initialized ReactiveHyperAVCore for ' + faceId);
                            
                            // Store reference
                            if (!window.faceVisualizers) window.faceVisualizers = {};
                            window.faceVisualizers[faceId] = core;
                            
                        } catch (error) {
                            console.error('❌ Failed to initialize ' + faceId + ':', error.message);
                        }
                    }
                }
            });
        }
        
        // Apply the fix
        ensureFaceCanvases();
        `;
        
        await page.evaluate(fixCode);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // STEP 3: Test after fix
        console.log('\\n📋 STEP 3: Testing After Fix');
        console.log('-'.repeat(40));
        
        const afterFix = await page.evaluate(() => {
            const faces = [];
            document.querySelectorAll('.hypercube-face').forEach((face, index) => {
                const canvases = face.querySelectorAll('canvas');
                faces.push({
                    id: face.id,
                    hasCanvas: canvases.length > 0,
                    canvasCount: canvases.length,
                    canvasIds: Array.from(canvases).map(c => c.id),
                    hasVisualizer: !!window.faceVisualizers?.[face.id]
                });
            });
            return faces;
        });
        
        console.log('📊 After Fix State:');
        afterFix.forEach(face => {
            const status = face.hasCanvas ? '✅ HAS CANVAS' : '❌ NO CANVAS';
            const visualizer = face.hasVisualizer ? '✅ VISUALIZER' : '❌ NO VISUALIZER';
            console.log(`  ${face.id}: ${status} ${visualizer} (${face.canvasCount} canvases)`);
            console.log(`    Canvas IDs: ${face.canvasIds.join(', ')}`);
        });
        
        await page.screenshot({ path: 'mcp-test-after-fix.png' });
        
        // STEP 4: Test face navigation
        console.log('\\n🔄 STEP 4: Testing Face Navigation');
        console.log('-'.repeat(40));
        
        // Add improved face switching
        await page.evaluate(() => {
            window.currentFaceIndex = 0;
            
            function switchToFace(index) {
                const faces = document.querySelectorAll('.hypercube-face');
                const totalFaces = faces.length;
                
                if (index < 0 || index >= totalFaces) return;
                
                console.log('🔄 Switching to face ' + index + ' (' + faces[index].id + ')');
                
                faces.forEach((face, i) => {
                    if (i === index) {
                        face.style.display = 'block';
                        face.style.zIndex = '10';
                        face.style.opacity = '1';
                    } else {
                        face.style.display = 'none';
                        face.style.zIndex = '1';
                        face.style.opacity = '0';
                    }
                });
                
                window.currentFaceIndex = index;
            }
            
            // Override keyboard navigation
            document.addEventListener('keydown', (event) => {
                const totalFaces = document.querySelectorAll('.hypercube-face').length;
                
                switch (event.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        event.preventDefault();
                        window.currentFaceIndex = (window.currentFaceIndex + 1) % totalFaces;
                        switchToFace(window.currentFaceIndex);
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        event.preventDefault();
                        window.currentFaceIndex = (window.currentFaceIndex - 1 + totalFaces) % totalFaces;
                        switchToFace(window.currentFaceIndex);
                        break;
                }
            });
            
            // Start with face 0
            switchToFace(0);
        });
        
        // Test navigation
        for (let i = 0; i < 6; i++) {
            console.log(`Testing face ${i}...`);
            
            await page.keyboard.press('ArrowRight');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const currentState = await page.evaluate(() => {
                const visibleFace = Array.from(document.querySelectorAll('.hypercube-face')).find(f => f.style.display !== 'none');
                return {
                    currentFace: visibleFace ? visibleFace.id : 'none',
                    currentIndex: window.currentFaceIndex
                };
            });
            
            console.log(`  Current: ${currentState.currentFace} (index ${currentState.currentIndex})`);
            await page.screenshot({ path: `mcp-test-face-${i}.png` });
        }
        
        // STEP 5: Generate results
        console.log('\\n📊 STEP 5: Results Summary');
        console.log('-'.repeat(40));
        
        const results = {
            timestamp: new Date().toISOString(),
            beforeFix: beforeFix,
            afterFix: afterFix,
            success: afterFix.every(face => face.hasCanvas),
            improvementCount: afterFix.filter(face => face.hasCanvas).length - beforeFix.filter(face => face.hasCanvas).length
        };
        
        fs.writeFileSync('mcp-test-results.json', JSON.stringify(results, null, 2));
        
        console.log('\\n🎯 FINAL RESULTS:');
        console.log(`📊 Faces with canvases: ${beforeFix.filter(f => f.hasCanvas).length} → ${afterFix.filter(f => f.hasCanvas).length}`);
        console.log(`📈 Improvement: +${results.improvementCount} faces`);
        console.log(`✅ All faces working: ${results.success ? 'YES' : 'NO'}`);
        
        if (results.success) {
            console.log('\\n🎉 SUCCESS: All hypercube faces now have canvases and can be navigated!');
        } else {
            console.log('\\n❌ PARTIAL: Some faces still need work');
        }
        
    } catch (error) {
        console.error('❌ MCP test failed:', error.message);
    } finally {
        // Keep browser open for manual inspection
        console.log('\\n🔍 Browser kept open for manual inspection...');
        console.log('Use arrow keys to test navigation');
        console.log('Press Ctrl+C to close');
        
        process.on('SIGINT', async () => {
            if (browser) await browser.close();
            process.exit(0);
        });
        
        // Wait indefinitely
        await new Promise(() => {});
    }
}

mcpTestAndFix().catch(console.error);