const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple HTTP server
function createServer() {
    return http.createServer((req, res) => {
        let filePath = path.join(__dirname, req.url === '/' ? 'VIB34D_SYSTEM.html' : req.url);
        
        // Handle different file types
        let contentType = 'text/html';
        const ext = path.extname(filePath);
        if (ext === '.js') contentType = 'application/javascript';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.json') contentType = 'application/json';
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        });
    });
}

async function simpleVisualTest() {
    console.log('🚀 Starting Simple VIB34D Visual Test...');
    
    // Start HTTP server
    const server = createServer();
    const port = 8082;
    
    await new Promise((resolve) => {
        server.listen(port, () => {
            console.log(`🌐 HTTP Server running on http://localhost:${port}`);
            resolve();
        });
    });
    
    const browser = await puppeteer.launch({
        headless: false, // Show browser for visual testing
        devtools: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security'
        ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    
    // Create test results directory
    if (!fs.existsSync('test-results')) {
        fs.mkdirSync('test-results');
    }
    
    try {
        console.log('📁 Loading VIB34D System...');
        await page.goto(`http://localhost:${port}`, { 
            waitUntil: 'networkidle2',
            timeout: 5000 
        });
        
        // Wait a moment for any initial rendering
        await page.waitForTimeout(3000);
        
        console.log('📸 Taking initial screenshot...');
        await page.screenshot({ 
            path: 'test-results/01-page-loaded.png', 
            fullPage: true 
        });
        
        // Check if page loaded successfully
        const pageTitle = await page.title();
        console.log(`📄 Page Title: ${pageTitle}`);
        
        // Check for any visible elements
        const elementCounts = await page.evaluate(() => {
            return {
                totalElements: document.querySelectorAll('*').length,
                cards: document.querySelectorAll('.adaptive-card').length,
                canvases: document.querySelectorAll('canvas').length,
                buttons: document.querySelectorAll('button').length,
                containers: document.querySelectorAll('[id*="container"]').length
            };
        });
        
        console.log('🔍 Element Counts:', elementCounts);
        
        // Check for any console errors
        const logs = [];
        page.on('console', msg => {
            logs.push(`${msg.type()}: ${msg.text()}`);
        });
        
        // Wait for any potential JavaScript execution
        await page.waitForTimeout(2000);
        
        // Try to interact with the page
        console.log('🖱️ Testing basic interactions...');
        
        // Try clicking different areas
        await page.click('body');
        await page.waitForTimeout(500);
        
        // Take screenshot after interaction
        await page.screenshot({ 
            path: 'test-results/02-after-click.png', 
            fullPage: true 
        });
        
        // Test keyboard inputs
        console.log('⌨️ Testing keyboard inputs...');
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
            path: 'test-results/03-after-arrow-right.png', 
            fullPage: true 
        });
        
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
            path: 'test-results/04-after-arrow-left.png', 
            fullPage: true 
        });
        
        // Test number keys
        await page.keyboard.press('Digit1');
        await page.waitForTimeout(1000);
        await page.screenshot({ 
            path: 'test-results/05-after-key-1.png', 
            fullPage: true 
        });
        
        await page.keyboard.press('Digit2');
        await page.waitForTimeout(1000);
        await page.screenshot({ 
            path: 'test-results/06-after-key-2.png', 
            fullPage: true 
        });
        
        // Check if Agent API exists
        const agentAPITest = await page.evaluate(() => {
            return {
                hasAgentAPI: typeof window.agentAPI !== 'undefined',
                hasVib34dSystem: typeof window.vib34dSystem !== 'undefined',
                agentAPIMethods: window.agentAPI ? Object.keys(window.agentAPI) : [],
                systemInitialized: window.vib34dSystem ? window.vib34dSystem.isInitialized : false
            };
        });
        
        console.log('🤖 Agent API Test:', agentAPITest);
        
        // If Agent API exists, test it
        if (agentAPITest.hasAgentAPI) {
            console.log('🎯 Testing Agent API functions...');
            
            try {
                // Test navigation
                await page.evaluate(() => {
                    if (window.agentAPI.navigateTo) {
                        window.agentAPI.navigateTo('tech');
                    }
                });
                await page.waitForTimeout(1000);
                await page.screenshot({ 
                    path: 'test-results/07-api-navigate-tech.png', 
                    fullPage: true 
                });
                
                // Test parameter setting
                await page.evaluate(() => {
                    if (window.agentAPI.setMasterParameter) {
                        window.agentAPI.setMasterParameter('u_patternIntensity', 2.0);
                    }
                });
                await page.waitForTimeout(1000);
                await page.screenshot({ 
                    path: 'test-results/08-api-parameter.png', 
                    fullPage: true 
                });
                
            } catch (apiError) {
                console.log('⚠️ Agent API Error:', apiError.message);
            }
        }
        
        // Final comprehensive screenshot
        await page.screenshot({ 
            path: 'test-results/09-final-state.png', 
            fullPage: true 
        });
        
        // Print recent console logs
        console.log('\n📋 Browser Console Logs:');
        logs.slice(-10).forEach(log => console.log('  ', log));
        
        console.log('\n✅ Visual test completed!');
        console.log('📸 Screenshots saved in test-results/ directory');
        console.log('🌐 Server running - you can manually test at http://localhost:8080');
        
        // Keep everything open for manual testing
        console.log('\n👀 Browser and server will remain open for manual inspection...');
        console.log('Press Ctrl+C to close when finished.');
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await page.screenshot({ 
            path: 'test-results/error-state.png', 
            fullPage: true 
        });
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    process.exit(0);
});

simpleVisualTest().catch(console.error);