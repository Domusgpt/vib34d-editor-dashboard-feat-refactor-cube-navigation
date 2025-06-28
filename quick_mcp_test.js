/**
 * Quick MCP Test for VIB34D Dashboard - Direct Browser Testing
 * Tests the dashboard directly using puppeteer without server management
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class QuickMCPTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            timestamp: new Date().toISOString(),
            tests: {},
            screenshots: [],
            errors: []
        };
    }

    async runTest() {
        console.log('🚀 Quick MCP Test Starting...');
        
        try {
            // Launch browser
            this.browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            this.page = await this.browser.newPage();
            await this.page.setViewport({ width: 1920, height: 1080 });
            
            // Monitor console and errors
            this.page.on('console', msg => console.log(`[CONSOLE] ${msg.text()}`));
            this.page.on('pageerror', error => {
                console.error(`[ERROR] ${error.message}`);
                this.results.errors.push(error.message);
            });
            
            // Test file:// protocol directly
            const htmlPath = path.join(process.cwd(), 'index_VIB34D_PROFESSIONAL.html');
            const fileUrl = `file://${htmlPath}`;
            
            console.log(`📂 Loading: ${fileUrl}`);
            
            const response = await this.page.goto(fileUrl, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            console.log(`✅ Page loaded with status: ${response ? response.status() : 'file://'}`);
            
            // Take initial screenshot
            await this.takeScreenshot('initial_load');
            
            // Wait for scripts to load
            await this.page.waitForTimeout(5000);
            
            // Test basic page elements
            await this.testPageElements();
            
            // Test WebGL
            await this.testWebGL();
            
            // Test navigation
            await this.testNavigation();
            
            // Generate report
            this.generateReport();
            
            console.log('✅ Quick MCP Test completed successfully!');
            
        } catch (error) {
            console.error('❌ Test failed:', error.message);
            this.results.errors.push(error.message);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
    
    async takeScreenshot(name) {
        const filename = `vib34d_quick_test_${name}_${Date.now()}.png`;
        await this.page.screenshot({ path: filename, fullPage: true });
        this.results.screenshots.push(filename);
        console.log(`📸 Screenshot: ${filename}`);
    }
    
    async testPageElements() {
        console.log('🔍 Testing page elements...');
        
        const elements = await this.page.evaluate(() => {
            return {
                title: document.title,
                hypercubeFaces: document.querySelectorAll('.hypercube-face').length,
                blogCards: document.querySelectorAll('.blog-card').length,
                navBezels: document.querySelectorAll('.nav-bezel').length,
                canvases: document.querySelectorAll('canvas').length,
                scripts: document.querySelectorAll('script').length
            };
        });
        
        this.results.tests.pageElements = elements;
        
        console.log(`  ✅ Title: ${elements.title}`);
        console.log(`  ✅ Hypercube faces: ${elements.hypercubeFaces}`);
        console.log(`  ✅ Blog cards: ${elements.blogCards}`);
        console.log(`  ✅ Navigation bezels: ${elements.navBezels}`);
        console.log(`  ✅ Canvas elements: ${elements.canvases}`);
    }
    
    async testWebGL() {
        console.log('🎨 Testing WebGL...');
        
        const webglInfo = await this.page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                return { supported: false };
            }
            
            return {
                supported: true,
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION)
            };
        });
        
        this.results.tests.webgl = webglInfo;
        
        if (webglInfo.supported) {
            console.log(`  ✅ WebGL supported: ${webglInfo.renderer}`);
        } else {
            console.log('  ❌ WebGL not supported');
        }
        
        await this.takeScreenshot('webgl_test');
    }
    
    async testNavigation() {
        console.log('🧭 Testing navigation...');
        
        try {
            // Try clicking a navigation bezel
            const rightBezel = await this.page.$('[data-direction="right"]');
            if (rightBezel) {
                console.log('  🎯 Clicking right bezel...');
                await rightBezel.click();
                await this.page.waitForTimeout(2000);
                await this.takeScreenshot('after_navigation');
                console.log('  ✅ Navigation interaction completed');
            } else {
                console.log('  ⚠️  Right bezel not found');
            }
            
            // Check dashboard state
            const dashboardState = await this.page.evaluate(() => {
                return window.vib34dDashboard ? {
                    exists: true,
                    initialized: window.vib34dDashboard.isInitialized,
                    currentFace: window.vib34dDashboard.currentFace,
                    visualizerCount: window.vib34dDashboard.visualizers ? window.vib34dDashboard.visualizers.size : 0
                } : { exists: false };
            });
            
            this.results.tests.dashboard = dashboardState;
            
            if (dashboardState.exists) {
                console.log(`  ✅ Dashboard: initialized=${dashboardState.initialized}, face=${dashboardState.currentFace}, visualizers=${dashboardState.visualizerCount}`);
            } else {
                console.log('  ⚠️  Dashboard object not found');
            }
            
        } catch (error) {
            console.error('  ❌ Navigation test error:', error.message);
            this.results.errors.push(`Navigation: ${error.message}`);
        }
    }
    
    generateReport() {
        const report = {
            ...this.results,
            summary: {
                totalTests: Object.keys(this.results.tests).length,
                errors: this.results.errors.length,
                screenshots: this.results.screenshots.length,
                success: this.results.errors.length === 0
            }
        };
        
        fs.writeFileSync('vib34d_quick_test_report.json', JSON.stringify(report, null, 2));
        console.log('📊 Report saved: vib34d_quick_test_report.json');
        
        return report;
    }
}

// Run test
if (require.main === module) {
    const test = new QuickMCPTest();
    test.runTest();
}

module.exports = QuickMCPTest;