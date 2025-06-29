const puppeteer = require('puppeteer');
const path = require('path');

async function localVisualTest() {
    console.log('🚀 Starting Local VIB34D Visual Test...');
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--allow-file-access-from-files',
            '--disable-features=VizDisplayCompositor'
        ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    
    try {
        // Load local file
        const localPath = `file://${path.resolve(__dirname, 'index.html')}`;
        console.log(`📁 Loading local file: ${localPath}`);
        
        await page.goto(localPath, {
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        
        console.log('✅ Page loaded successfully!');
        
        // Wait for any initial JavaScript execution
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check what loaded
        const pageAnalysis = await page.evaluate(() => {
            const analysis = {
                title: document.title,
                url: window.location.href,
                hasVib34dContainer: !!document.getElementById('vib34d-container'),
                totalElements: document.querySelectorAll('*').length,
                scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline'),
                cards: document.querySelectorAll('.adaptive-card').length,
                canvases: document.querySelectorAll('canvas').length,
                buttons: document.querySelectorAll('button').length,
                hasAgentAPI: typeof window.agentAPI !== 'undefined',
                hasVib34dSystem: typeof window.vib34dSystem !== 'undefined',
                hasSystemController: typeof window.SystemController !== 'undefined',
                bodyContent: document.body ? document.body.innerHTML.substring(0, 500) : 'No body',
                documentReady: document.readyState
            };
            
            // Check for any errors in console
            if (window.vib34dSystem) {
                analysis.systemInitialized = window.vib34dSystem.isInitialized;
                analysis.systemCurrentState = window.vib34dSystem.currentState;
            }
            
            if (window.agentAPI) {
                analysis.agentAPIMethods = Object.keys(window.agentAPI);
                try {
                    analysis.systemState = window.agentAPI.getState();
                } catch (e) {
                    analysis.agentAPIError = e.message;
                }
            }
            
            return analysis;
        });
        
        console.log('📊 Page Analysis:');
        console.log('  Title:', pageAnalysis.title);
        console.log('  Container:', pageAnalysis.hasVib34dContainer);
        console.log('  Cards:', pageAnalysis.cards);
        console.log('  Canvases:', pageAnalysis.canvases);
        console.log('  Agent API:', pageAnalysis.hasAgentAPI);
        console.log('  VIB34D System:', pageAnalysis.hasVib34dSystem);
        console.log('  System Controller:', pageAnalysis.hasSystemController);
        console.log('  System Initialized:', pageAnalysis.systemInitialized);
        
        // Take screenshot of current state
        await page.screenshot({ path: 'local-test-01-loaded.png', fullPage: true });
        console.log('📸 Screenshot 1: Page loaded');
        
        // Check console messages
        const consoleLogs = [];
        page.on('console', msg => {
            const logMessage = `${msg.type()}: ${msg.text()}`;
            consoleLogs.push(logMessage);
            console.log('🖥️ Browser:', logMessage);
        });
        
        // Wait longer for potential system initialization
        console.log('⏳ Waiting for system initialization...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check again after waiting
        const systemCheck = await page.evaluate(() => {
            return {
                hasAgentAPI: typeof window.agentAPI !== 'undefined',
                hasSystem: typeof window.vib34dSystem !== 'undefined',
                systemReady: window.vib34dSystem ? window.vib34dSystem.isInitialized : false,
                loadingIndicator: document.getElementById('loading-indicator')?.style.display,
                systemStatus: document.getElementById('system-status')?.style.display,
                errorMessages: Array.from(document.querySelectorAll('.error-message')).map(el => el.textContent)
            };
        });
        
        console.log('🔍 System Check:', systemCheck);
        
        // Take screenshot after waiting
        await page.screenshot({ path: 'local-test-02-after-wait.png', fullPage: true });
        console.log('📸 Screenshot 2: After waiting');
        
        // If system is available, test interactions
        if (systemCheck.hasAgentAPI) {
            console.log('🎯 Testing Agent API interactions...');
            
            try {
                // Test navigation
                await page.evaluate(() => {
                    window.agentAPI.navigateTo('tech');
                });
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.screenshot({ path: 'local-test-03-navigate-tech.png', fullPage: true });
                console.log('📸 Screenshot 3: Navigate to tech');
                
                // Test parameter update
                await page.evaluate(() => {
                    window.agentAPI.setMasterParameter('u_patternIntensity', 2.5);
                });
                await new Promise(resolve => setTimeout(resolve, 1500));
                await page.screenshot({ path: 'local-test-04-parameter.png', fullPage: true });
                console.log('📸 Screenshot 4: Parameter update');
                
                // Get performance metrics
                const metrics = await page.evaluate(() => {
                    return window.agentAPI.getPerformanceMetrics();
                });
                console.log('📊 Performance Metrics:', metrics);
                
            } catch (apiError) {
                console.log('⚠️ Agent API Error:', apiError);
            }
        }
        
        // Test keyboard interactions
        console.log('⌨️ Testing keyboard interactions...');
        await page.keyboard.press('ArrowRight');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: 'local-test-05-arrow-right.png', fullPage: true });
        console.log('📸 Screenshot 5: Arrow Right');
        
        // Test number key
        await page.keyboard.press('Digit1');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: 'local-test-06-key-1.png', fullPage: true });
        console.log('📸 Screenshot 6: Key 1');
        
        // Test mouse interactions
        console.log('🖱️ Testing mouse interactions...');
        
        // Try to hover over cards if they exist
        const cardElements = await page.$$('.adaptive-card');
        if (cardElements.length > 0) {
            console.log(`🎴 Found ${cardElements.length} cards, testing hover...`);
            await cardElements[0].hover();
            await new Promise(resolve => setTimeout(resolve, 1500));
            await page.screenshot({ path: 'local-test-07-card-hover.png', fullPage: true });
            console.log('📸 Screenshot 7: Card hover');
            
            // Click the card
            await cardElements[0].click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.screenshot({ path: 'local-test-08-card-click.png', fullPage: true });
            console.log('📸 Screenshot 8: Card click');
        }
        
        // Try clicking navigation buttons if they exist
        const navButtons = await page.$$('.nav-btn');
        if (navButtons.length > 0) {
            console.log(`🧭 Found ${navButtons.length} nav buttons, testing click...`);
            await navButtons[0].click();
            await new Promise(resolve => setTimeout(resolve, 1500));
            await page.screenshot({ path: 'local-test-09-nav-click.png', fullPage: true });
            console.log('📸 Screenshot 9: Nav button click');
        }
        
        // Final screenshot
        await page.screenshot({ path: 'local-test-10-final.png', fullPage: true });
        console.log('📸 Screenshot 10: Final state');
        
        // Print console log summary
        console.log('\n📋 Browser Console Summary:');
        const errorLogs = consoleLogs.filter(log => log.includes('error') || log.includes('Error'));
        const warningLogs = consoleLogs.filter(log => log.includes('warn') || log.includes('Warning'));
        
        console.log(`  Total logs: ${consoleLogs.length}`);
        console.log(`  Errors: ${errorLogs.length}`);
        console.log(`  Warnings: ${warningLogs.length}`);
        
        if (errorLogs.length > 0) {
            console.log('\n❌ Error messages:');
            errorLogs.slice(0, 5).forEach(log => console.log('  ', log));
        }
        
        if (warningLogs.length > 0) {
            console.log('\n⚠️ Warning messages:');
            warningLogs.slice(0, 3).forEach(log => console.log('  ', log));
        }
        
        console.log('\n✅ Local visual test completed!');
        console.log('📸 10 screenshots saved showing system behavior');
        console.log('🌐 Browser will remain open for manual inspection...');
        console.log('\n👀 You can now manually test the VIB34D system:');
        console.log('🎯 Try hovering cards, using arrow keys, number keys 1-5');
        console.log('⌨️ Press Ctrl+C in terminal to close when finished');
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await page.screenshot({ path: 'local-test-error.png', fullPage: true });
        console.log('📸 Error screenshot saved');
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down visual test...');
    process.exit(0);
});

localVisualTest().catch(console.error);