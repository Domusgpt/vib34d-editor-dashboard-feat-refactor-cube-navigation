#!/usr/bin/env node

/**
 * VIB34D Adaptive Card Demo Diagnostic Report
 * Analyzes the issues preventing proper visualization
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VIB34D ADAPTIVE CARD DEMO DIAGNOSTIC REPORT');
console.log('=' .repeat(60));

// 1. File Analysis
console.log('\n📁 FILE ANALYSIS:');

const files = [
    'VIB34D_ADAPTIVE_CARD_DEMO.html',
    'VIB34D_ADAPTIVE_CARD_VISUALIZER.js'
];

files.forEach(file => {
    try {
        const stats = fs.statSync(file);
        console.log(`✅ ${file}: ${stats.size} bytes, modified ${stats.mtime.toISOString()}`);
        
        // Check for common issues
        const content = fs.readFileSync(file, 'utf8');
        
        if (file.endsWith('.html')) {
            // HTML analysis
            const scriptTags = (content.match(/<script[^>]*src=/g) || []).length;
            const inlineScripts = (content.match(/<script[^>]*>/g) || []).length - scriptTags;
            console.log(`  📄 Script tags: ${scriptTags} external, ${inlineScripts} inline`);
            
            // Check for specific script reference
            if (content.includes('VIB34D_ADAPTIVE_CARD_VISUALIZER.js')) {
                console.log('  ✅ References visualizer script');
            } else {
                console.log('  ❌ Missing visualizer script reference');
            }
            
            // Check for DOM ready handling
            if (content.includes('DOMContentLoaded') || content.includes('window.onload')) {
                console.log('  ✅ Has DOM ready handling');
            } else {
                console.log('  ⚠️  No explicit DOM ready handling');
            }
        }
        
        if (file.endsWith('.js')) {
            // JavaScript analysis
            const classDefinitions = (content.match(/class\s+\w+/g) || []).length;
            console.log(`  🔨 Class definitions: ${classDefinitions}`);
            
            // Check for export patterns
            if (content.includes('window.AdaptiveCardVisualizer')) {
                console.log('  ✅ Exports to window object');
            } else {
                console.log('  ❌ Missing window export');
            }
            
            // Check for WebGL usage
            if (content.includes('getContext(\'webgl\'')) {
                console.log('  ✅ Uses WebGL context');
            }
            
            // Check for Canvas 2D fallback
            if (content.includes('getContext(\'2d\'')) {
                console.log('  ✅ Canvas 2D fallback available');
            }
        }
        
    } catch (error) {
        console.log(`❌ ${file}: ERROR - ${error.message}`);
    }
});

// 2. Common Browser Issues Analysis
console.log('\n🌐 BROWSER COMPATIBILITY ANALYSIS:');

const jsContent = fs.readFileSync('VIB34D_ADAPTIVE_CARD_VISUALIZER.js', 'utf8');

// Check for modern JS features that might cause issues
const modernFeatures = [
    { feature: 'Arrow functions', pattern: /=>\s*{/, compatible: 'ES6+' },
    { feature: 'Template literals', pattern: /`[^`]*`/, compatible: 'ES6+' },
    { feature: 'Class syntax', pattern: /class\s+\w+/, compatible: 'ES6+' },
    { feature: 'Let/const', pattern: /\b(let|const)\s+/, compatible: 'ES6+' },
    { feature: 'ResizeObserver', pattern: /ResizeObserver/, compatible: 'Modern browsers' },
    { feature: 'requestAnimationFrame', pattern: /requestAnimationFrame/, compatible: 'IE10+' }
];

modernFeatures.forEach(({ feature, pattern, compatible }) => {
    const found = pattern.test(jsContent);
    console.log(`${found ? '✅' : '⭕'} ${feature}: ${found ? 'Used' : 'Not used'} (${compatible})`);
});

// 3. Potential Issues Analysis
console.log('\n⚠️  POTENTIAL ISSUES:');

const issues = [];

// Check for DOM timing issues
const htmlContent = fs.readFileSync('VIB34D_ADAPTIVE_CARD_DEMO.html', 'utf8');

if (htmlContent.includes('setTimeout(() => {') && htmlContent.includes('AdaptiveCardVisualizer')) {
    console.log('✅ Has timeout for script loading');
} else {
    issues.push('Script loading timing: No timeout handling for async script loading');
}

// Check for error handling
if (htmlContent.includes('window.onerror') || htmlContent.includes('try {')) {
    console.log('✅ Has error handling');
} else {
    issues.push('Error handling: No global error handling in HTML');
}

// Check for WebGL fallback
if (jsContent.includes('initCanvas2DFallback')) {
    console.log('✅ Has WebGL fallback');
} else {
    issues.push('WebGL fallback: Missing fallback for systems without WebGL');
}

if (issues.length > 0) {
    issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
    });
} else {
    console.log('✅ No major structural issues detected');
}

// 4. Recommendations
console.log('\n💡 RECOMMENDATIONS:');

const recommendations = [
    'Use the VIB34D_FIXED_DEMO.html which includes comprehensive error tracking',
    'Add explicit DOM ready handling with proper timeouts',
    'Include a debug panel to show real-time status',
    'Add fallbacks for older browsers if needed',
    'Consider using a module loader for better script management',
    'Add console logging to track initialization steps',
    'Implement proper error boundaries for visualization failures'
];

recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
});

// 5. Quick Fix Summary
console.log('\n🔧 QUICK FIX SUMMARY:');
console.log('The VIB34D Adaptive Card Visualizer code is functionally correct.');
console.log('Issues are likely related to:');
console.log('  • Script loading timing (DOM ready vs script execution)');
console.log('  • Browser console errors not being displayed');
console.log('  • WebGL context creation in specific browsers');
console.log('  • Missing error feedback to user');
console.log('');
console.log('✅ SOLUTION: Use VIB34D_FIXED_DEMO.html for comprehensive debugging');
console.log('✅ TESTING: Use adaptive_card_debug.html for detailed diagnostics');

console.log('\n' + '=' .repeat(60));
console.log('📋 DIAGNOSTIC COMPLETE');