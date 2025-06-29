const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server for VIB34D system
function createServer() {
    return http.createServer((req, res) => {
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        
        let contentType = 'text/html';
        const ext = path.extname(filePath);
        if (ext === '.js') contentType = 'application/javascript';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.json') contentType = 'application/json';
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end(`File not found: ${req.url}`);
                return;
            }
            
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        });
    });
}

async function launchVIB34DSystem() {
    console.log('🚀 Launching VIB34D Polytopal Visualizer System...');
    
    // Start HTTP server
    const server = createServer();
    const port = 8084;
    
    await new Promise((resolve) => {
        server.listen(port, () => {
            console.log(`🌐 VIB34D Server running on http://localhost:${port}`);
            resolve();
        });
    });
    
    console.log('🎯 Starting browser for live testing...');
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--start-maximized'
        ]
    });
    
    const page = await browser.newPage();
    
    // Enhanced console logging
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        
        if (type === 'error') {
            console.log('🔴 Browser Error:', text);
        } else if (type === 'warn') {
            console.log('🟡 Browser Warning:', text);
        } else if (text.includes('VIB34D') || text.includes('🎬') || text.includes('🚀')) {
            console.log('🎭 VIB34D System:', text);
        }
    });
    
    try {
        console.log('📁 Loading VIB34D Polytopal System...');
        await page.goto(`http://localhost:${port}`, {
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        
        console.log('✅ VIB34D System loaded!');
        
        // Wait for system initialization
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check system status
        const systemStatus = await page.evaluate(() => {
            return {
                title: document.title,
                hasContainer: !!document.getElementById('vib34d-container'),
                hasCards: document.querySelectorAll('.adaptive-card').length,
                hasCanvases: document.querySelectorAll('canvas').length,
                hasAgentAPI: typeof window.agentAPI !== 'undefined',
                hasSystem: typeof window.vib34dSystem !== 'undefined',
                currentState: window.agentAPI?.getState?.()?.currentState || 'unknown'
            };
        });
        
        console.log('📊 System Status:');
        console.log('  Title:', systemStatus.title);
        console.log('  Container:', systemStatus.hasContainer);
        console.log('  Cards:', systemStatus.hasCards);
        console.log('  Canvases:', systemStatus.hasCanvases);
        console.log('  Agent API:', systemStatus.hasAgentAPI);
        console.log('  Current State:', systemStatus.currentState);
        
        if (systemStatus.hasAgentAPI) {
            console.log('🎯 Agent API available - testing navigation...');
            
            // Test navigation sequence
            const states = ['tech', 'media', 'innovation', 'context', 'home'];
            
            for (const state of states) {
                console.log(`🧭 Navigating to: ${state}`);
                await page.evaluate((targetState) => {
                    window.agentAPI.navigateTo(targetState);
                }, state);
                
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const currentState = await page.evaluate(() => {
                    return window.agentAPI.getState()?.currentState;
                });
                
                console.log(`✅ State: ${currentState}`);
            }
            
            console.log('🎛️ Testing parameter updates...');
            await page.evaluate(() => {
                window.agentAPI.setParameters({
                    'u_patternIntensity': 2.0,
                    'u_dimension': 5.0,
                    'u_rotationSpeed': 0.8
                });
            });
            
            console.log('📊 Getting performance metrics...');
            const metrics = await page.evaluate(() => {
                return window.agentAPI.getPerformanceMetrics();
            });
            console.log('Performance:', metrics);
        }
        
        console.log('\n🎭 VIB34D Polytopal Visualizer System is LIVE!');
        console.log('🌐 Access at: http://localhost:8084');
        console.log('🎮 Try these interactions:');
        console.log('  • Arrow keys: Navigate between states');
        console.log('  • Number keys 1-5: Direct state access');
        console.log('  • Hover over cards: See relational physics');
        console.log('  • Space bar: Cycle through states');
        console.log('\n🔧 Available in console:');
        console.log('  • window.agentAPI - Full control interface');
        console.log('  • window.vib34dSystem - Core system');
        console.log('\n⌨️ Press Ctrl+C to stop server when finished');
        
    } catch (error) {
        console.error('❌ Launch error:', error.message);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down VIB34D system...');
    process.exit(0);
});

launchVIB34DSystem().catch(console.error);