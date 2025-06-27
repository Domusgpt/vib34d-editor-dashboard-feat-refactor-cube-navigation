#!/usr/bin/env node

/**
 * VIB34D Editor Dashboard Test
 * Captures browser state, errors, and takes screenshot
 */

const fs = require('fs');
const puppeteer = require('puppeteer').default || require('puppeteer');

async function testVIB34DEditorDashboard() {
    console.log('🧪 Starting VIB34D Editor Dashboard Test...');
    
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ 
            width: 1920, 
            height: 1080,
            deviceScaleFactor: 1
        });

        // Capture console logs
        const consoleLogs = [];
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            consoleLogs.push({ type, text, timestamp: Date.now() });
            console.log(`CONSOLE [${type.toUpperCase()}]: ${text}`);
        });

        // Capture page errors
        const pageErrors = [];
        page.on('pageerror', error => {
            pageErrors.push({
                message: error.message,
                stack: error.stack,
                timestamp: Date.now()
            });
            console.error('PAGE ERROR:', error.message);
        });

        // Capture network failures
        const networkErrors = [];
        page.on('requestfailed', request => {
            networkErrors.push({
                url: request.url(),
                failure: request.failure().errorText,
                timestamp: Date.now()
            });
            console.error('NETWORK ERROR:', request.url(), request.failure().errorText);
        });

        console.log('📡 Navigating to http://localhost:8000/VIB34D_EDITOR_DASHBOARD.html...');
        
        // Navigate to the page
        const response = await page.goto('http://localhost:8000/VIB34D_EDITOR_DASHBOARD.html', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        console.log(`📄 Page loaded with status: ${response.status()}`);

        // Wait a bit for any dynamic content
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take initial screenshot
        console.log('📸 Taking screenshot...');
        await page.screenshot({
            path: 'vib34d_editor_dashboard_test_screenshot.png',
            fullPage: true
        });

        // Check if key elements are present
        console.log('🔍 Checking page structure...');
        
        const pageAnalysis = await page.evaluate(() => {
            const analysis = {
                title: document.title,
                hasEditorContainer: !!document.querySelector('.editor-container'),
                hasToolbar: !!document.querySelector('.editor-toolbar'),
                hasElementLibrary: !!document.querySelector('.element-library'),
                hasCanvasWorkspace: !!document.querySelector('.canvas-workspace'),
                hasPropertiesPanel: !!document.querySelector('.properties-panel'),
                
                // Check for JavaScript dependencies
                hasVIB34DWorkingCore: typeof window.VIB34D_WorkingCore !== 'undefined',
                hasVIB34DMoireRGB: typeof window.VIB34DMoireRGBEngine !== 'undefined',
                hasVIB34DIntegratedBridge: typeof window.VIB34DIntegratedSystemBridge !== 'undefined',
                
                // Check for editor dashboard instance
                hasEditorDashboard: typeof window.editorDashboard !== 'undefined',
                
                // Count draggable elements
                draggableElementsCount: document.querySelectorAll('.element-item[draggable="true"]').length,
                
                // Check for canvas elements
                canvasElementsCount: document.querySelectorAll('canvas').length,
                
                // Check for WebGL context
                webglSupported: (() => {
                    try {
                        const canvas = document.createElement('canvas');
                        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                    } catch (e) {
                        return false;
                    }
                })(),
                
                // Get current error messages
                visibleErrors: Array.from(document.querySelectorAll('.error, .warning, [style*="color: red"]')).map(el => el.textContent),
                
                // Check dropdown state
                geometryOptions: document.querySelectorAll('.geometry-option').length,
                
                // Check if property controls are functional
                sliderElements: document.querySelectorAll('.property-slider, .reactivity-slider').length
            };
            
            return analysis;
        });

        console.log('📊 Page Analysis Results:');
        console.log(JSON.stringify(pageAnalysis, null, 2));

        // Test drag and drop functionality
        console.log('🖱️ Testing drag and drop functionality...');
        
        try {
            // Try to drag an element to the canvas
            const dragTestResult = await page.evaluate(() => {
                const elementItem = document.querySelector('.element-item[data-type="button"]');
                const canvasWorkspace = document.querySelector('.canvas-workspace');
                
                if (!elementItem || !canvasWorkspace) {
                    return { success: false, reason: 'Missing elements for drag test' };
                }

                // Simulate drag start
                const dragStartEvent = new DragEvent('dragstart', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: new DataTransfer()
                });
                
                // Try to add data
                try {
                    dragStartEvent.dataTransfer.setData('text/plain', JSON.stringify({
                        type: elementItem.dataset.type,
                        geometry: elementItem.dataset.geometry,
                        name: elementItem.querySelector('.element-name').textContent
                    }));
                } catch (e) {
                    return { success: false, reason: 'DataTransfer setData failed: ' + e.message };
                }
                
                return { success: true, dragStartEventCreated: true };
            });
            
            console.log('Drag test result:', dragTestResult);
        } catch (error) {
            console.error('Drag test failed:', error.message);
        }

        // Test button functionality
        console.log('🔲 Testing toolbar buttons...');
        
        const buttonTest = await page.evaluate(() => {
            const buttons = {
                newProject: !!document.querySelector('[onclick="newProject()"]'),
                loadProject: !!document.querySelector('[onclick="loadProject()"]'),
                saveProject: !!document.querySelector('[onclick="saveProject()"]'),
                togglePreview: !!document.querySelector('[onclick="togglePreview()"]'),
                exportCode: !!document.querySelector('[onclick="exportCode()"]'),
                generatePage: !!document.querySelector('[onclick="generatePage()"]')
            };
            
            // Check if functions exist
            const functions = {
                newProject: typeof newProject === 'function',
                loadProject: typeof loadProject === 'function',
                saveProject: typeof saveProject === 'function',
                togglePreview: typeof togglePreview === 'function',
                exportCode: typeof exportCode === 'function',
                generatePage: typeof generatePage === 'function'
            };
            
            return { buttons, functions };
        });
        
        console.log('Button test results:', buttonTest);

        // Check for specific errors in the system
        console.log('⚠️ Checking for specific issues...');
        
        const specificIssues = await page.evaluate(() => {
            const issues = [];
            
            // Check if scripts loaded
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            scripts.forEach(script => {
                if (script.src.includes('VIB34D_WORKING_CORE_ARCHITECTURE.js') && !window.VIB34D_WorkingCore) {
                    issues.push('VIB34D_WORKING_CORE_ARCHITECTURE.js failed to load or initialize');
                }
                if (script.src.includes('VIB34D_MOIRE_RGB_SYSTEM.js') && !window.VIB34DMoireRGBEngine) {
                    issues.push('VIB34D_MOIRE_RGB_SYSTEM.js failed to load or initialize');
                }
                if (script.src.includes('VIB34D_INTEGRATED_SYSTEM_BRIDGE.js') && !window.VIB34DIntegratedSystemBridge) {
                    issues.push('VIB34D_INTEGRATED_SYSTEM_BRIDGE.js failed to load or initialize');
                }
            });
            
            // Check WebGL
            if (!(() => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                } catch (e) {
                    return false;
                }
            })()) {
                issues.push('WebGL not supported or not available');
            }
            
            return issues;
        });

        // Compile comprehensive test report
        const testReport = {
            timestamp: new Date().toISOString(),
            url: 'http://localhost:8000/VIB34D_EDITOR_DASHBOARD.html',
            pageStatus: response.status(),
            pageAnalysis,
            consoleLogs,
            pageErrors,
            networkErrors,
            specificIssues,
            buttonTest,
            summary: {
                overallStatus: pageErrors.length === 0 && networkErrors.length === 0 ? 'HEALTHY' : 'ISSUES_DETECTED',
                criticalIssues: pageErrors.length + networkErrors.length,
                javascriptDependenciesLoaded: pageAnalysis.hasVIB34DWorkingCore && pageAnalysis.hasVIB34DMoireRGB && pageAnalysis.hasVIB34DIntegratedBridge,
                uiElementsPresent: pageAnalysis.hasEditorContainer && pageAnalysis.hasToolbar && pageAnalysis.hasElementLibrary && pageAnalysis.hasCanvasWorkspace && pageAnalysis.hasPropertiesPanel,
                interactivityReady: pageAnalysis.hasEditorDashboard && pageAnalysis.draggableElementsCount > 0,
                webglSupported: pageAnalysis.webglSupported
            }
        };

        // Save test report
        fs.writeFileSync('vib34d_editor_dashboard_test_report.json', JSON.stringify(testReport, null, 2));
        
        console.log('\n📋 VIB34D Editor Dashboard Test Results:');
        console.log('='.repeat(50));
        console.log(`Overall Status: ${testReport.summary.overallStatus}`);
        console.log(`Critical Issues: ${testReport.summary.criticalIssues}`);
        console.log(`JavaScript Dependencies Loaded: ${testReport.summary.javascriptDependenciesLoaded}`);
        console.log(`UI Elements Present: ${testReport.summary.uiElementsPresent}`);
        console.log(`Interactivity Ready: ${testReport.summary.interactivityReady}`);
        console.log(`WebGL Supported: ${testReport.summary.webglSupported}`);
        console.log('='.repeat(50));
        
        if (specificIssues.length > 0) {
            console.log('\n🚨 Specific Issues Found:');
            specificIssues.forEach(issue => console.log(`  • ${issue}`));
        }
        
        if (pageErrors.length > 0) {
            console.log('\n💥 Page Errors:');
            pageErrors.forEach(error => console.log(`  • ${error.message}`));
        }
        
        if (networkErrors.length > 0) {
            console.log('\n🌐 Network Errors:');
            networkErrors.forEach(error => console.log(`  • ${error.url}: ${error.failure}`));
        }

        return testReport;

    } catch (error) {
        console.error('❌ Test failed:', error);
        return { error: error.message, stack: error.stack };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
if (require.main === module) {
    testVIB34DEditorDashboard()
        .then(result => {
            console.log('\n✅ Test completed');
            if (result.error) {
                console.error('Test encountered an error:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Test runner failed:', error);
            process.exit(1);
        });
}

module.exports = testVIB34DEditorDashboard;