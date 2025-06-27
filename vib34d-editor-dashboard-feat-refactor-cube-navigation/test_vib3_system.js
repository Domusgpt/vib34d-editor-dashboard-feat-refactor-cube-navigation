#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testVIB3System() {
    console.log('🚀 Starting VIB3CODE system tests...');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up console logging
    page.on('console', msg => {
        const msgType = msg.type();
        if (msgType === 'error') {
            console.log('🔴 CONSOLE ERROR:', msg.text());
        } else if (msgType === 'warn') {
            console.log('⚠️  CONSOLE WARN:', msg.text());
        } else if (msgType === 'log') {
            console.log('📝 CONSOLE LOG:', msg.text());
        }
    });
    
    // Set up error handling
    page.on('pageerror', error => {
        console.log('💥 PAGE ERROR:', error.message);
    });
    
    try {
        console.log('📂 Loading vib3code-morphing-blog.html...');
        await page.goto('http://localhost:8080/vib3code-morphing-blog.html', { 
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('⏳ Waiting for page to initialize...');
        await page.waitForTimeout(3000);
        
        // Test 1: Verify HOME section content loading
        console.log('\n🏠 Testing HOME section content...');
        
        const card1Content = await page.evaluate(() => {
            const card1 = document.getElementById('blog-card-1');
            if (!card1) return 'Card 1 not found';
            const contentDiv = card1.querySelector('.card-content');
            return contentDiv ? contentDiv.innerHTML : 'No content div';
        });
        
        const card2Content = await page.evaluate(() => {
            const card2 = document.getElementById('blog-card-2');
            if (!card2) return 'Card 2 not found';
            const contentDiv = card2.querySelector('.card-content');
            return contentDiv ? contentDiv.innerHTML : 'No content div';
        });
        
        const card3Content = await page.evaluate(() => {
            const card3 = document.getElementById('blog-card-3');
            if (!card3) return 'Card 3 not found';
            const contentDiv = card3.querySelector('.card-content');
            return contentDiv ? contentDiv.innerHTML : 'No content div';
        });
        
        console.log('📝 Card 1 Content:', card1Content.substring(0, 100) + '...');
        console.log('📝 Card 2 Content:', card2Content.substring(0, 100) + '...');
        console.log('📝 Card 3 Content:', card3Content.substring(0, 100) + '...');
        
        // Test 2: Check for expected content
        console.log('\n🔍 Checking for expected content...');
        
        const hasVIB3CODEHeader = await page.evaluate(() => {
            return document.body.innerHTML.includes('VIB3CODE') || 
                   document.body.innerHTML.includes('Emergent Interface Architecture');
        });
        
        const hasFoundationalTrinity = await page.evaluate(() => {
            return document.body.innerHTML.includes('Foundational Trinity') ||
                   document.body.innerHTML.includes('Core Architecture Principles');
        });
        
        const hasNavigationRealms = await page.evaluate(() => {
            return document.body.innerHTML.includes('NAVIGATE REALMS') ||
                   document.body.innerHTML.includes('Technical Architecture');
        });
        
        console.log('✅ VIB3CODE Header content:', hasVIB3CODEHeader ? 'FOUND' : 'NOT FOUND');
        console.log('✅ Foundational Trinity content:', hasFoundationalTrinity ? 'FOUND' : 'NOT FOUND');
        console.log('✅ Navigation Realms content:', hasNavigationRealms ? 'FOUND' : 'NOT FOUND');
        
        // Test 3: Check animations and interactions
        console.log('\n🎬 Testing animations...');
        
        await page.waitForTimeout(2000);
        
        // Test navigation
        console.log('\n⬅️ Testing navigation (RIGHT arrow for TECH section)...');
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(2000);
        
        console.log('⬆️ Testing navigation (UP arrow back to HOME)...');
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(2000);
        
        // Test bezel navigation
        console.log('\n🖱️ Testing bezel drag navigation...');
        
        const windowHeight = await page.evaluate(() => window.innerHeight);
        const windowWidth = await page.evaluate(() => window.innerWidth);
        
        // Test right bezel drag
        await page.mouse.move(windowWidth - 5, windowHeight / 2);
        await page.mouse.down();
        await page.mouse.move(windowWidth - 100, windowHeight / 2);
        await page.waitForTimeout(500);
        await page.mouse.up();
        await page.waitForTimeout(2000);
        
        // Return to HOME
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(2000);
        
        // Test 4: Check for WebGL and visualizers
        console.log('\n🎨 Testing visualizers...');
        
        const visualizerStatus = await page.evaluate(() => {
            const boardViz = document.getElementById('board-visualizer');
            const cardViz1 = document.getElementById('card-visualizer-1');
            const cardViz2 = document.getElementById('card-visualizer-2');
            const cardViz3 = document.getElementById('card-visualizer-3');
            
            return {
                boardVisualizer: boardViz ? 'Present' : 'Missing',
                cardViz1: cardViz1 ? 'Present' : 'Missing',
                cardViz2: cardViz2 ? 'Present' : 'Missing',
                cardViz3: cardViz3 ? 'Present' : 'Missing'
            };
        });
        
        console.log('🎨 Visualizer status:', visualizerStatus);
        
        // Test 5: Check for JavaScript errors
        console.log('\n🔧 Final system check...');
        
        const systemStatus = await page.evaluate(() => {
            return {
                homeMaster: typeof window.homeMaster !== 'undefined',
                vib3Bridge: typeof window.vib3Bridge !== 'undefined',
                dualNav: typeof window.dualNavigationSystem !== 'undefined',
                webglSupport: typeof WebGLRenderingContext !== 'undefined'
            };
        });
        
        console.log('🔧 System components:', systemStatus);
        
        // Generate test report
        const testReport = {
            timestamp: new Date().toISOString(),
            results: {
                pageLoaded: true,
                contentLoading: {
                    card1: card1Content.length > 50,
                    card2: card2Content.length > 50,
                    card3: card3Content.length > 50
                },
                expectedContent: {
                    vib3codeHeader: hasVIB3CODEHeader,
                    foundationalTrinity: hasFoundationalTrinity,
                    navigationRealms: hasNavigationRealms
                },
                visualizers: visualizerStatus,
                systemComponents: systemStatus
            }
        };
        
        fs.writeFileSync('test_results.json', JSON.stringify(testReport, null, 2));
        console.log('\n📊 Test report saved to test_results.json');
        
        console.log('\n✅ Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        // Keep browser open for manual inspection
        console.log('\n👀 Browser left open for manual inspection. Close manually when done.');
        // await browser.close();
    }
}

testVIB3System().catch(console.error);