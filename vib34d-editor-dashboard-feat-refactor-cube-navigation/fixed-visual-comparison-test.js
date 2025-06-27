#!/usr/bin/env node

/**
 * Fixed Visual Comparison Test: Desktop Demo vs VIB3STYLEPACK
 * Takes screenshots every 20% of page scroll to compare visual fidelity
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function visualComparisonTest() {
    console.log('🎨 VIB3STYLEPACK Visual Comparison Test\n');
    
    let browser = null;
    
    try {
        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        // Test 1: Desktop Demo Page (via local server)
        console.log('\n📋 TEST 1: Desktop Demo Page');
        console.log('='.repeat(50));
        
        const demoPage = await browser.newPage();
        
        // Set up logging for demo page
        demoPage.on('console', msg => {
            console.log(`[Demo]: ${msg.text()}`);
        });
        
        demoPage.on('error', err => {
            console.error(`[Demo Error]: ${err.message}`);
        });
        
        const demoUrl = 'http://localhost:8000/desktop-demo.html';
        console.log(`📄 Loading: ${demoUrl}`);
        
        await demoPage.goto(demoUrl, { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        // Wait for initialization
        console.log('⏳ Waiting for demo page initialization...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check what's loaded on demo page
        const demoStatus = await demoPage.evaluate(() => {
            const vib34dObjects = Object.keys(window).filter(k => k.includes('VIB34D')).length;
            const vib3Objects = Object.keys(window).filter(k => k.includes('VIB3')).length;
            
            return {
                title: document.title,
                bodyHTML: document.body.innerHTML.length,
                hasCanvas: !!document.querySelector('canvas'),
                canvasCount: document.querySelectorAll('canvas').length,
                hasVIB3HomeMaster: !!window.VIB3HomeMaster,
                vib34dObjects: vib34dObjects,
                vib3Objects: vib3Objects,
                bodyClass: document.body.className,
                sections: document.querySelectorAll('section, .section, [data-section]').length,
                divCount: document.querySelectorAll('div').length,
                scripts: document.querySelectorAll('script').length,
                windowKeys: Object.keys(window).length
            };
        });
        
        console.log('📊 Demo Page Status:');
        Object.entries(demoStatus).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });
        
        // Take scrolling screenshots of demo page
        console.log('\n📸 Taking demo page screenshots...');
        const demoScreenshots = [];
        
        for (let i = 0; i <= 100; i += 20) {
            console.log(`  📷 Demo screenshot at ${i}% scroll...`);
            
            // Scroll to position
            await demoPage.evaluate((percent) => {
                const scrollHeight = Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight
                ) - window.innerHeight;
                const scrollPosition = Math.max(0, (scrollHeight * percent) / 100);
                window.scrollTo(0, scrollPosition);
            }, i);
            
            // Wait for scroll effects and animations
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Take screenshot
            const screenshotPath = `demo-screenshot-${i}percent.png`;
            await demoPage.screenshot({ 
                path: screenshotPath,
                fullPage: false
            });
            
            demoScreenshots.push({
                percent: i,
                path: screenshotPath
            });
            
            console.log(`    ✅ Saved: ${screenshotPath}`);
        }
        
        await demoPage.close();
        
        // Test 2: VIB3STYLEPACK Fixed Page
        console.log('\n📋 TEST 2: VIB3STYLEPACK Fixed Page');
        console.log('='.repeat(50));
        
        const vib3Page = await browser.newPage();
        
        // Set up logging for VIB3 page
        vib3Page.on('console', msg => {
            console.log(`[VIB3]: ${msg.text()}`);
        });
        
        vib3Page.on('error', err => {
            console.error(`[VIB3 Error]: ${err.message}`);
        });
        
        const vib3Url = 'http://localhost:8000/comprehensive-mcp-vib3-test.html';
        console.log(`📄 Loading: ${vib3Url}`);
        
        await vib3Page.goto(vib3Url, { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        // Wait for initialization
        console.log('⏳ Waiting for VIB3 page initialization...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check what's loaded on VIB3 page
        const vib3Status = await vib3Page.evaluate(() => {
            const vib34dObjects = Object.keys(window).filter(k => k.includes('VIB34D')).length;
            const vib3Objects = Object.keys(window).filter(k => k.includes('VIB3')).length;
            
            return {
                title: document.title,
                bodyHTML: document.body.innerHTML.length,
                hasCanvas: !!document.querySelector('canvas'),
                canvasCount: document.querySelectorAll('canvas').length,
                hasVIB3System: !!window.vib3System,
                vib34dPhases: Object.keys(window).filter(k => k.includes('VIB34D_Phase')).length,
                vib34dObjects: vib34dObjects,
                vib3Objects: vib3Objects,
                mcpParser: !!window.VIB3RealtimeMCPParser,
                logEntries: document.querySelectorAll('.log-entry').length,
                statusDots: document.querySelectorAll('.status-dot').length,
                buttons: document.querySelectorAll('button').length,
                windowKeys: Object.keys(window).length
            };
        });
        
        console.log('📊 VIB3 Page Status:');
        Object.entries(vib3Status).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });
        
        // Try to initialize the VIB3 system
        console.log('\n🔧 Attempting VIB3 initialization...');
        try {
            await vib3Page.click('button[onclick="initVIB3()"]');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const initResult = await vib3Page.evaluate(() => {
                const statusDot = document.getElementById('vib3-status');
                const logEntries = Array.from(document.querySelectorAll('#vib3-log .log-entry'));
                const latestLog = logEntries[logEntries.length - 1];
                
                return {
                    status: statusDot ? statusDot.className : 'not-found',
                    latestLog: latestLog ? latestLog.textContent : 'no logs',
                    systemExists: !!window.vib3System,
                    totalLogs: logEntries.length
                };
            });
            
            console.log(`  Status: ${initResult.status}`);
            console.log(`  Latest log: ${initResult.latestLog}`);
            console.log(`  System exists: ${initResult.systemExists}`);
            console.log(`  Total logs: ${initResult.totalLogs}`);
            
        } catch (error) {
            console.log(`  ❌ Initialization failed: ${error.message}`);
        }
        
        // Take scrolling screenshots of VIB3 page
        console.log('\n📸 Taking VIB3 page screenshots...');
        const vib3Screenshots = [];
        
        for (let i = 0; i <= 100; i += 20) {
            console.log(`  📷 VIB3 screenshot at ${i}% scroll...`);
            
            // Scroll to position
            await vib3Page.evaluate((percent) => {
                const scrollHeight = Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight
                ) - window.innerHeight;
                const scrollPosition = Math.max(0, (scrollHeight * percent) / 100);
                window.scrollTo(0, scrollPosition);
            }, i);
            
            // Wait for scroll effects
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Take screenshot
            const screenshotPath = `vib3-screenshot-${i}percent.png`;
            await vib3Page.screenshot({ 
                path: screenshotPath,
                fullPage: false
            });
            
            vib3Screenshots.push({
                percent: i,
                path: screenshotPath
            });
            
            console.log(`    ✅ Saved: ${screenshotPath}`);
        }
        
        await vib3Page.close();
        
        // Generate comparison analysis
        console.log('\n📊 VISUAL COMPARISON ANALYSIS');
        console.log('='.repeat(50));
        
        const analysis = {
            timestamp: new Date().toISOString(),
            demo: {
                status: demoStatus,
                screenshots: demoScreenshots
            },
            vib3: {
                status: vib3Status,
                screenshots: vib3Screenshots
            },
            differences: {
                titleDifference: demoStatus.title !== vib3Status.title,
                canvasCountDiff: vib3Status.canvasCount - demoStatus.canvasCount,
                vib34dObjectsDiff: vib3Status.vib34dObjects - demoStatus.vib34dObjects,
                vib3ObjectsDiff: vib3Status.vib3Objects - demoStatus.vib3Objects,
                htmlSizeDiff: vib3Status.bodyHTML - demoStatus.bodyHTML,
                windowKeysDiff: vib3Status.windowKeys - demoStatus.windowKeys,
                mcpIntegrationPresent: vib3Status.mcpParser,
                bothHaveCanvas: demoStatus.hasCanvas && vib3Status.hasCanvas
            }
        };
        
        // Save detailed analysis
        fs.writeFileSync('visual-comparison-analysis.json', JSON.stringify(analysis, null, 2));
        
        console.log('\n🔍 KEY DIFFERENCES FOUND:');
        console.log(`📋 Titles:`);
        console.log(`  Demo: "${demoStatus.title}"`);
        console.log(`  VIB3: "${vib3Status.title}"`);
        
        console.log(`\n🎨 Canvas Elements:`);
        console.log(`  Demo: ${demoStatus.canvasCount} canvas(es)`);
        console.log(`  VIB3: ${vib3Status.canvasCount} canvas(es)`);
        
        console.log(`\n🔧 VIB34D Objects:`);
        console.log(`  Demo: ${demoStatus.vib34dObjects} objects`);
        console.log(`  VIB3: ${vib3Status.vib34dObjects} objects`);
        
        console.log(`\n📊 Content Size:`);
        console.log(`  Demo HTML: ${demoStatus.bodyHTML} characters`);
        console.log(`  VIB3 HTML: ${vib3Status.bodyHTML} characters`);
        console.log(`  Difference: ${analysis.differences.htmlSizeDiff} characters`);
        
        console.log(`\n🌐 Window Objects:`);
        console.log(`  Demo: ${demoStatus.windowKeys} global objects`);
        console.log(`  VIB3: ${vib3Status.windowKeys} global objects`);
        
        console.log(`\n🤖 MCP Integration:`);
        console.log(`  Demo: ${demoStatus.mcpParser || 'No MCP'}`);
        console.log(`  VIB3: ${vib3Status.mcpParser ? 'Has MCP Parser' : 'No MCP'}`);
        
        console.log('\n📸 Screenshot Summary:');
        console.log(`  Demo screenshots: ${demoScreenshots.length} files`);
        console.log(`  VIB3 screenshots: ${vib3Screenshots.length} files`);
        
        console.log('\n🎉 VISUAL COMPARISON COMPLETE!');
        console.log('📄 Detailed analysis saved to: visual-comparison-analysis.json');
        console.log('\n📋 Check the screenshot files to see visual differences:');
        demoScreenshots.forEach(s => console.log(`  📷 ${s.path}`));
        vib3Screenshots.forEach(s => console.log(`  📷 ${s.path}`));
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

visualComparisonTest().catch(console.error);