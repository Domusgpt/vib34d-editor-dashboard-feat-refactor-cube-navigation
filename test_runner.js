#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');

console.log('🚀 VIB34D Browser Test Runner');

// Function to test URL availability
function testURL(url) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function runBrowserTest() {
    console.log('🌐 Testing server availability...');
    
    const serverOK = await testURL('http://localhost:8000/debug_test.html');
    if (!serverOK) {
        console.log('❌ Server not running on port 8000');
        console.log('💡 Start server with: python -m http.server 8000');
        return;
    }
    
    console.log('✅ Server running, launching browser test...');
    
    // Launch Chrome with specific debugging flags
    const chrome = spawn('google-chrome', [
        '--headless',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--dump-dom',
        '--virtual-time-budget=5000',
        'http://localhost:8000/debug_test.html'
    ]);
    
    let output = '';
    chrome.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    chrome.stderr.on('data', (data) => {
        console.log(`[CHROME-ERROR] ${data}`);
    });
    
    chrome.on('close', (code) => {
        console.log('📊 BROWSER OUTPUT:');
        
        // Extract the results div content
        const resultsMatch = output.match(/<div id="results"[^>]*>(.*?)<\/div>/s);
        if (resultsMatch) {
            const results = resultsMatch[1]
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .trim();
            
            console.log(results);
        } else {
            console.log('❌ Could not extract test results');
            // Show first 500 chars of output for debugging
            console.log('Raw output sample:', output.substring(0, 500));
        }
        
        console.log(`\n🏁 Browser test completed (exit code: ${code})`);
    });
}

runBrowserTest().catch(console.error);