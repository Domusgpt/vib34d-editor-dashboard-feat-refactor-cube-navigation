#!/usr/bin/env node

/**
 * Visual Comparison Test: Desktop Demo vs VIB3STYLEPACK
 * Takes screenshots every 20% of page scroll to compare visual fidelity
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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
        
        // Test 1: Desktop Demo Page
        console.log('\n📋 TEST 1: Desktop Demo Page');
        console.log('='.repeat(50));
        
        const demoPage = await browser.newPage();
        
        // Set up logging for demo page
        demoPage.on('console', msg => {
            if (msg.text().includes('VIB') || msg.text().includes('error')) {
                console.log(`[Demo]: ${msg.text()}`);
            }
        });
        
        const demoPath = 'file:///C:/Users/millz/Desktop/vibecodestyle%20demo/index.html.html';
        console.log(`📄 Loading: ${demoPath}`);
        
        await demoPage.goto(demoPath, { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        // Wait for initialization
        console.log('⏳ Waiting for demo page initialization...');
        await demoPage.waitForTimeout(3000);
        
        // Check what's loaded on demo page
        const demoStatus = await demoPage.evaluate(() => {
            return {
                title: document.title,
                hasCanvas: !!document.querySelector('canvas'),
                canvasCount: document.querySelectorAll('canvas').length,
                hasVIB3: !!window.VIB3HomeMaster,
                hasVIB34D: Object.keys(window).filter(k => k.includes('VIB34D')).length,
                bodyClass: document.body.className,
                sections: document.querySelectorAll('section, .section, [data-section]').length
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
            console.log(`  📷 Screenshot at ${i}% scroll...`);
            
            // Scroll to position
            await demoPage.evaluate((percent) => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPosition = (scrollHeight * percent) / 100;
                window.scrollTo(0, scrollPosition);
            }, i);
            
            // Wait for scroll effects
            await demoPage.waitForTimeout(1000);
            
            // Take screenshot
            const screenshotPath = `demo-screenshot-${i}percent.png`;
            await demoPage.screenshot({ 
                path: screenshotPath,
                fullPage: false // Current viewport only
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
            if (msg.text().includes('VIB') || msg.text().includes('error')) {
                console.log(`[VIB3]: ${msg.text()}`);
            }
        });
        
        const vib3Url = 'http://localhost:8000/comprehensive-mcp-vib3-test.html';
        console.log(`📄 Loading: ${vib3Url}`);
        
        await vib3Page.goto(vib3Url, { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        // Wait for initialization
        console.log('⏳ Waiting for VIB3 page initialization...');
        await vib3Page.waitForTimeout(3000);
        
        // Check what's loaded on VIB3 page
        const vib3Status = await vib3Page.evaluate(() => {
            return {
                title: document.title,
                hasCanvas: !!document.querySelector('canvas'),
                canvasCount: document.querySelectorAll('canvas').length,
                hasVIB3System: !!window.vib3System,
                vib34dPhases: Object.keys(window).filter(k => k.includes('VIB34D_Phase')).length,
                mcpParser: !!window.VIB3RealtimeMCPParser,
                logEntries: document.querySelectorAll('.log-entry').length,
                statusDots: document.querySelectorAll('.status-dot').length
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
            await vib3Page.waitForTimeout(2000);
            
            const initResult = await vib3Page.evaluate(() => {
                const statusDot = document.getElementById('vib3-status');
                const logEntries = Array.from(document.querySelectorAll('#vib3-log .log-entry'));
                const latestLog = logEntries[logEntries.length - 1];
                
                return {
                    status: statusDot ? statusDot.className : 'not-found',
                    latestLog: latestLog ? latestLog.textContent : 'no logs',
                    systemExists: !!window.vib3System
                };
            });
            
            console.log(`  Status: ${initResult.status}`);
            console.log(`  Latest log: ${initResult.latestLog}`);
            console.log(`  System exists: ${initResult.systemExists}`);
            
        } catch (error) {
            console.log(`  ❌ Initialization failed: ${error.message}`);
        }
        
        // Take scrolling screenshots of VIB3 page
        console.log('\n📸 Taking VIB3 page screenshots...');
        const vib3Screenshots = [];
        
        for (let i = 0; i <= 100; i += 20) {
            console.log(`  📷 Screenshot at ${i}% scroll...`);
            
            // Scroll to position
            await vib3Page.evaluate((percent) => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPosition = (scrollHeight * percent) / 100;
                window.scrollTo(0, scrollPosition);
            }, i);
            
            // Wait for scroll effects
            await vib3Page.waitForTimeout(1000);
            
            // Take screenshot
            const screenshotPath = `vib3-screenshot-${i}percent.png`;
            await vib3Page.screenshot({ 
                path: screenshotPath,
                fullPage: false // Current viewport only
            });
            
            vib3Screenshots.push({
                percent: i,
                path: screenshotPath
            });
            
            console.log(`    ✅ Saved: ${screenshotPath}`);
        }
        
        await vib3Page.close();
        
        // Generate comparison report
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
            comparison: {
                canvasCountDiff: vib3Status.canvasCount - demoStatus.canvasCount,
                vib34dPhasesDiff: vib3Status.vib34dPhases - demoStatus.hasVIB34D,
                hasMCPIntegration: vib3Status.mcpParser,
                bothHaveCanvas: demoStatus.hasCanvas && vib3Status.hasCanvas
            }
        };
        
        // Save detailed analysis
        fs.writeFileSync('visual-comparison-analysis.json', JSON.stringify(analysis, null, 2));
        
        console.log('📋 Key Differences:');
        console.log(`  Canvas Count: Demo(${demoStatus.canvasCount}) vs VIB3(${vib3Status.canvasCount})`);
        console.log(`  VIB34D Phases: Demo(${demoStatus.hasVIB34D}) vs VIB3(${vib3Status.vib34dPhases})`);
        console.log(`  MCP Integration: ${vib3Status.mcpParser ? 'VIB3 has MCP' : 'Neither has MCP'}`);
        console.log(`  Title: Demo("${demoStatus.title}") vs VIB3("${vib3Status.title}")`);
        
        console.log('\n📸 Screenshot Summary:');
        console.log(`  Demo screenshots: ${demoScreenshots.length} files`);
        console.log(`  VIB3 screenshots: ${vib3Screenshots.length} files`);
        
        console.log('\n🎉 Visual comparison complete!');
        console.log('📄 Detailed analysis saved to: visual-comparison-analysis.json');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

visualComparisonTest().catch(console.error);