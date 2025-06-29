const puppeteer = require('puppeteer');

async function quickVisualTest() {
    console.log('🚀 Starting Quick VIB34D Visual Test...');
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    
    try {
        // Load the GitHub Pages deployment
        console.log('📁 Loading VIB34D from GitHub Pages...');
        await page.goto('https://domusgpt.github.io/vib34d-editor-dashboard-feat-refactor-cube-navigation/', {
            waitUntil: 'networkidle2',
            timeout: 15000
        });
        
        console.log('✅ Page loaded successfully!');
        
        // Wait for page to settle
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check page content
        const pageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                hasVib34dContainer: !!document.getElementById('vib34d-container'),
                hasCards: document.querySelectorAll('.adaptive-card').length,
                hasCanvases: document.querySelectorAll('canvas').length,
                hasAgentAPI: typeof window.agentAPI !== 'undefined',
                hasSystem: typeof window.vib34dSystem !== 'undefined'
            };
        });
        
        console.log('📊 Page Info:', pageInfo);
        
        // Take initial screenshot
        await page.screenshot({ path: 'visual-test-01-loaded.png', fullPage: true });
        console.log('📸 Screenshot 1: Page loaded');
        
        // Test navigation if system is available
        if (pageInfo.hasAgentAPI) {
            console.log('🎯 Testing Agent API navigation...');
            
            // Navigate through states
            const states = ['home', 'tech', 'media', 'innovation', 'context'];
            
            for (let i = 0; i < states.length; i++) {
                const state = states[i];
                console.log(`🧭 Navigating to: ${state}`);
                
                await page.evaluate((targetState) => {
                    try {
                        window.agentAPI.navigateTo(targetState);
                    } catch (e) {
                        console.log('Navigation error:', e);
                    }
                }, state);
                
                await new Promise(resolve => setTimeout(resolve, 1500));
                await page.screenshot({ path: `visual-test-02-${state}.png`, fullPage: true });
                console.log(`📸 Screenshot 2.${i}: State ${state}`);
            }
        }
        
        // Test keyboard navigation
        console.log('⌨️ Testing keyboard navigation...');
        await page.keyboard.press('ArrowRight');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: 'visual-test-03-arrow-right.png', fullPage: true });
        console.log('📸 Screenshot 3: Arrow Right');
        
        await page.keyboard.press('ArrowLeft');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: 'visual-test-04-arrow-left.png', fullPage: true });
        console.log('📸 Screenshot 4: Arrow Left');
        
        // Test hover interactions
        console.log('🖱️ Testing hover interactions...');
        const cards = await page.$$('.adaptive-card');
        if (cards.length > 0) {
            await cards[0].hover();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.screenshot({ path: 'visual-test-05-hover.png', fullPage: true });
            console.log('📸 Screenshot 5: Card Hover');
            
            // Move away
            await page.mouse.move(100, 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.screenshot({ path: 'visual-test-06-hover-end.png', fullPage: true });
            console.log('📸 Screenshot 6: Hover End');
        }
        
        // Test parameter updates if API available
        if (pageInfo.hasAgentAPI) {
            console.log('⚙️ Testing parameter updates...');
            await page.evaluate(() => {
                try {
                    window.agentAPI.setMasterParameter('u_patternIntensity', 3.0);
                    window.agentAPI.setMasterParameter('u_dimension', 6.0);
                } catch (e) {
                    console.log('Parameter error:', e);
                }
            });
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            await page.screenshot({ path: 'visual-test-07-parameters.png', fullPage: true });
            console.log('📸 Screenshot 7: Parameter Updates');
        }
        
        // Get final system state
        const finalState = await page.evaluate(() => {
            const result = {
                pageLoaded: true,
                timestamp: new Date().toISOString()
            };
            
            try {
                if (window.agentAPI) {
                    result.systemState = window.agentAPI.getState();
                    result.performanceMetrics = window.agentAPI.getPerformanceMetrics();
                }
            } catch (e) {
                result.error = e.message;
            }
            
            return result;
        });
        
        console.log('📋 Final System State:', finalState);
        
        // Take final screenshot
        await page.screenshot({ path: 'visual-test-08-final.png', fullPage: true });
        console.log('📸 Screenshot 8: Final State');
        
        console.log('\n✅ Visual test completed successfully!');
        console.log('📸 8 screenshots saved showing system behavior');
        console.log('🌐 Browser will remain open for manual inspection...');
        
        // Keep browser open for manual testing
        console.log('\n👀 You can now manually test the VIB34D system');
        console.log('🎯 Try hovering cards, using arrow keys, number keys 1-5');
        console.log('⌨️ Press Ctrl+C in terminal to close when finished');
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await page.screenshot({ path: 'visual-test-error.png', fullPage: true });
        console.log('📸 Error screenshot saved');
    }
}

// Don't auto-close, let user manually inspect
quickVisualTest().catch(console.error);