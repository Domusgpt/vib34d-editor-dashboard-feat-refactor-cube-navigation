/**
 * QUICK VERIFICATION TEST FOR VIB3 COMPLETE UNIFIED SYSTEM
 * 
 * Quick test to verify basic functionality and element presence
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function quickVerificationTest() {
    console.log('🚀 Starting quick verification test...');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set up console logging
    page.on('console', msg => console.log(`🖥️ BROWSER: ${msg.text()}`));
    page.on('pageerror', error => console.error(`❌ ERROR: ${error.message}`));
    
    try {
        // Load the complete system via HTTP server to avoid CORS
        const serverUrl = 'http://127.0.0.1:8892/index_COMPLETE_SYSTEM.html';
        console.log(`📄 Loading: ${serverUrl}`);
        
        await page.goto(serverUrl);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for full initialization
        
        // Take screenshot
        await page.screenshot({
            path: path.join(__dirname, 'quick_verification_screenshot.png'),
            fullPage: true
        });
        
        // Check basic elements
        const verification = await page.evaluate(() => {
            const results = {
                timestamp: new Date().toISOString(),
                elements: {},
                systems: {},
                errors: []
            };
            
            // Check essential elements
            results.elements = {
                reactiveCanvas: !!document.getElementById('reactive-canvas'),
                magazineLayer: !!document.querySelector('.magazine-layer'),
                sections: document.querySelectorAll('.section').length,
                navDots: document.querySelectorAll('.nav-dot').length,
                interactionIndicator: !!document.querySelector('.interaction-indicator'),
                devControls: !!document.querySelector('.dev-controls')
            };
            
            // Check core systems
            if (window.vib3System) {
                results.systems = {
                    vib3SystemExists: true,
                    isInitialized: window.vib3System.isInitialized,
                    hasReactiveCore: !!window.vib3System.reactiveCore,
                    hasHomeMaster: !!window.vib3System.homeMaster,
                    hasEffectsSystem: !!window.vib3System.effectsSystem,
                    hasIntuitivePresets: !!window.vib3System.intuitivePresets,
                    hasConfigSystem: !!window.vib3System.configSystem,
                    currentSection: window.vib3System.currentSection
                };
                
                // Check WebGL
                if (window.vib3System.reactiveCore) {
                    const canvas = document.getElementById('reactive-canvas');
                    const gl = canvas ? (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) : null;
                    
                    results.systems.webgl = {
                        canvasExists: !!canvas,
                        webglSupported: !!gl,
                        currentTheme: window.vib3System.reactiveCore.currentTheme,
                        paramsExists: !!window.vib3System.reactiveCore.params
                    };
                }
                
                // Check HomeMaster state
                if (window.vib3System.homeMaster) {
                    const systemState = window.vib3System.homeMaster.getSystemState();
                    results.systems.homeMasterState = {
                        hasSystemState: !!systemState,
                        intensity: systemState?.masterState?.intensity,
                        coherence: systemState?.masterState?.coherence,
                        activeSection: systemState?.masterState?.activeSection
                    };
                }
            } else {
                results.systems.vib3SystemExists = false;
                results.errors.push('VIB3 System not found in window object');
            }
            
            // Check CSS variables
            const cssVars = getComputedStyle(document.documentElement);
            results.systems.cssVariables = {
                globalIntensity: cssVars.getPropertyValue('--global-intensity'),
                systemCoherence: cssVars.getPropertyValue('--system-coherence'),
                dimensionalDepth: cssVars.getPropertyValue('--dimensional-depth')
            };
            
            return results;
        });
        
        console.log('📊 Verification Results:');
        console.log('🔧 Elements:', verification.elements);
        console.log('🧠 Systems:', verification.systems);
        
        if (verification.errors.length > 0) {
            console.log('❌ Errors:', verification.errors);
        }
        
        // Test a simple interaction
        console.log('🎯 Testing simple interaction...');
        
        const homeSection = await page.$('.section[data-section="home"] .section-content');
        if (homeSection) {
            await homeSection.hover();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const afterInteraction = await page.evaluate(() => {
                const cssVars = getComputedStyle(document.documentElement);
                return {
                    focusIntensity: cssVars.getPropertyValue('--focus-intensity'),
                    globalIntensity: cssVars.getPropertyValue('--global-intensity'),
                    interactionType: document.getElementById('interactionType')?.textContent
                };
            });
            
            console.log('🎮 After interaction:', afterInteraction);
        }
        
        // Overall assessment
        const success = verification.elements.reactiveCanvas && 
                        verification.systems.vib3SystemExists && 
                        verification.systems.isInitialized &&
                        verification.systems.hasReactiveCore &&
                        verification.systems.webgl?.webglSupported;
        
        console.log(`\n${success ? '✅ VERIFICATION PASSED' : '❌ VERIFICATION FAILED'}`);
        console.log('📸 Screenshot saved as quick_verification_screenshot.png');
        
        // Save detailed results
        const fs = require('fs');
        fs.writeFileSync(
            path.join(__dirname, 'quick_verification_results.json'), 
            JSON.stringify(verification, null, 2)
        );
        
        console.log('💾 Detailed results saved to quick_verification_results.json');
        
        // Keep browser open for 10 seconds for manual inspection
        console.log('🔍 Keeping browser open for 10 seconds for manual inspection...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        await browser.close();
        return success;
        
    } catch (error) {
        console.error('💥 Test failed:', error);
        await browser.close();
        return false;
    }
}

// Run the quick test
quickVerificationTest().then(success => {
    console.log(`\n🎯 Quick Verification: ${success ? 'SUCCESS' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('💥 Test crashed:', error);
    process.exit(1);
});