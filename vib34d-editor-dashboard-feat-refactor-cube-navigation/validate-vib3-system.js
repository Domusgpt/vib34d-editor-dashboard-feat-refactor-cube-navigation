#!/usr/bin/env node

/**
 * VIB3STYLEPACK System Validation Script
 * Tests all components without browser requirements
 */

const fs = require('fs');
const path = require('path');

console.log('🔮 VIB3STYLEPACK System Validation\n');

// Test 1: Verify all phase files exist
console.log('📋 Test 1: Phase File Availability');
const requiredPhases = [
    'VIB34D_PHASE1_CORE_ARCHITECTURE.js',
    'VIB34D_PHASE2_GEOMETRY_IMPLEMENTATIONS.js', 
    'VIB34D_PHASE3_PROJECTION_SYSTEM.js',
    'VIB34D_PHASE4_SHADER_UNIFORM_SYSTEM.js',
    'VIB34D_PHASE5_INTERACTION_INTEGRATION.js',
    'VIB34D_PHASE6_CHROMATIC_INTEGRATION.js',
    'VIB34D_PHASE7_VIB3_INTEGRATION.js',
    'VIB34D_PHASE8_EDITOR_DASHBOARD.js'
];

let phaseResults = [];
requiredPhases.forEach((phase, index) => {
    const exists = fs.existsSync(phase);
    const size = exists ? fs.statSync(phase).size : 0;
    phaseResults.push({
        phase: index + 1,
        file: phase,
        exists,
        size,
        status: exists && size > 1000 ? 'READY' : 'MISSING'
    });
    
    console.log(`  Phase ${index + 1}: ${exists ? '✅' : '❌'} ${phase} (${size} bytes)`);
});

// Test 2: Verify test interface
console.log('\n🌐 Test 2: Test Interface Availability');
const testFiles = [
    'comprehensive-mcp-vib3-test.html',
    'vib3-realtime-mcp-parser.js'
];

let interfaceResults = [];
testFiles.forEach(file => {
    const exists = fs.existsSync(file);
    const size = exists ? fs.statSync(file).size : 0;
    interfaceResults.push({
        file,
        exists,
        size,
        status: exists ? 'READY' : 'MISSING'
    });
    
    console.log(`  ${exists ? '✅' : '❌'} ${file} (${size} bytes)`);
});

// Test 3: Verify MCP server
console.log('\n🤖 Test 3: MCP Server Status');
const mcpFiles = [
    'vib3-mcp-server/dist/index.js',
    'vib3-mcp-server/package.json'
];

let mcpResults = [];
mcpFiles.forEach(file => {
    const exists = fs.existsSync(file);
    const size = exists ? fs.statSync(file).size : 0;
    mcpResults.push({
        file,
        exists, 
        size,
        status: exists ? 'READY' : 'MISSING'
    });
    
    console.log(`  ${exists ? '✅' : '❌'} ${file} (${size} bytes)`);
});

// Test 4: JavaScript syntax validation
console.log('\n🔍 Test 4: JavaScript Syntax Validation');
const { exec } = require('child_process');

let syntaxResults = [];
let validationPromises = requiredPhases.map(phase => {
    return new Promise((resolve) => {
        if (!fs.existsSync(phase)) {
            syntaxResults.push({ phase, valid: false, error: 'File not found' });
            resolve();
            return;
        }
        
        exec(`node -c ${phase}`, (error) => {
            const valid = !error;
            syntaxResults.push({ 
                phase, 
                valid, 
                error: error ? error.message.split('\n')[0] : null 
            });
            console.log(`  ${valid ? '✅' : '❌'} ${phase} ${valid ? 'VALID' : 'SYNTAX ERROR'}`);
            resolve();
        });
    });
});

Promise.all(validationPromises).then(() => {
    // Generate final report
    console.log('\n📊 FINAL TEST RESULTS');
    console.log('='.repeat(50));
    
    const totalPhases = phaseResults.length;
    const readyPhases = phaseResults.filter(p => p.status === 'READY').length;
    const validSyntax = syntaxResults.filter(s => s.valid).length;
    const interfaceReady = interfaceResults.filter(i => i.status === 'READY').length;
    const mcpReady = mcpResults.filter(m => m.status === 'READY').length;
    
    console.log(`📋 Phase Files: ${readyPhases}/${totalPhases} ready`);
    console.log(`🔍 Syntax Valid: ${validSyntax}/${totalPhases} valid`);
    console.log(`🌐 Test Interface: ${interfaceReady}/${testFiles.length} ready`);
    console.log(`🤖 MCP Server: ${mcpReady}/${mcpFiles.length} ready`);
    
    const overallScore = Math.round(
        ((readyPhases / totalPhases) * 0.4 +
         (validSyntax / totalPhases) * 0.4 +
         (interfaceReady / testFiles.length) * 0.1 +
         (mcpReady / mcpFiles.length) * 0.1) * 100
    );
    
    console.log(`\n🏆 OVERALL SYSTEM HEALTH: ${overallScore}%`);
    
    if (overallScore >= 90) {
        console.log('🎉 VIB3STYLEPACK is READY FOR TESTING!');
    } else if (overallScore >= 70) {
        console.log('⚠️  VIB3STYLEPACK has minor issues but is mostly functional');
    } else {
        console.log('❌ VIB3STYLEPACK needs significant fixes before testing');
    }
    
    console.log('\n🚀 QUICK START COMMANDS:');
    console.log('  HTTP Server: python3 -m http.server 8000');
    console.log('  MCP Server: cd vib3-mcp-server && npm start');
    console.log('  Test URL: http://localhost:8000/comprehensive-mcp-vib3-test.html');
    
    // Summary object for programmatic use
    const summary = {
        timestamp: new Date().toISOString(),
        overallScore,
        phases: { ready: readyPhases, total: totalPhases },
        syntax: { valid: validSyntax, total: totalPhases },
        interface: { ready: interfaceReady, total: testFiles.length },
        mcp: { ready: mcpReady, total: mcpFiles.length },
        status: overallScore >= 90 ? 'READY' : overallScore >= 70 ? 'FUNCTIONAL' : 'NEEDS_FIXES'
    };
    
    fs.writeFileSync('vib3-validation-results.json', JSON.stringify(summary, null, 2));
    console.log('\n📄 Detailed results saved to: vib3-validation-results.json');
});