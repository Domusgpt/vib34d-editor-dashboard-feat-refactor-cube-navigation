#!/usr/bin/env node

/**
 * COMPREHENSIVE VIB34D PARAMETER CODEX COMPLIANCE AUDIT
 * Tests current production system against the complete parameter specification
 */

const puppeteer = require('puppeteer');

async function comprehensiveParameterAudit() {
    console.log('🎯 COMPREHENSIVE VIB34D PARAMETER CODEX AUDIT');
    console.log('='.repeat(60));
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 }
    });
    const page = await browser.newPage();
    
    // Capture console messages
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('🎯') || text.includes('VIB34D') || text.includes('ERROR')) {
            console.log(`[BROWSER]: ${text}`);
        }
    });
    
    await page.goto('http://localhost:8000/vib3code-morphing-blog.html', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
    });
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('\n📋 PARAMETER CODEX COMPLIANCE AUDIT');
    console.log('-'.repeat(50));
    
    const auditResults = await page.evaluate(() => {
        const results = {
            phases: {},
            uniforms: {},
            geometries: {},
            classes: {},
            integration: {},
            errors: []
        };
        
        // 1. PHASE COMPLETION CHECK
        console.log('🔍 Phase Implementation Audit...');
        for (let i = 1; i <= 8; i++) {
            const phaseKey = `VIB34D_Phase${i}`;
            results.phases[`Phase${i}`] = {
                exists: !!(window[phaseKey]),
                classes: window[phaseKey] ? Object.keys(window[phaseKey]) : []
            };
        }
        
        // 2. 17 SHADER UNIFORMS CHECK
        console.log('🎛️ Shader Uniform System Audit...');
        const requiredUniforms = [
            'u_resolution', 'u_time', 'u_mouse', 'u_dimension',
            'u_gridDensity', 'u_lineThickness', 'u_universeModifier', 'u_patternIntensity',
            'u_morphFactor', 'u_rotationSpeed',
            'u_shellWidth', 'u_tetraThickness', 'u_glitchIntensity',
            'u_colorShift', 'u_audioBass', 'u_audioMid', 'u_audioHigh'
        ];
        
        requiredUniforms.forEach(uniform => {
            const found = document.body.innerHTML.includes(uniform);
            results.uniforms[uniform] = { found, required: true };
        });
        
        // 3. 8 GEOMETRY CLASSES CHECK
        console.log('📐 Geometry Implementation Audit...');
        const requiredGeometries = [
            'HypercubeGeometry', 'HypersphereGeometry', 'HypertetrahedronGeometry',
            'TorusGeometry', 'KleinBottleGeometry', 'FractalGeometry', 
            'WaveGeometry', 'CrystalGeometry'
        ];
        
        requiredGeometries.forEach(geom => {
            const found = document.body.innerHTML.includes(geom);
            results.geometries[geom] = { found, required: true };
        });
        
        // 4. CORE CLASS ARCHITECTURE
        console.log('🏗️ Core Architecture Audit...');
        const coreClasses = [
            'BaseGeometry', 'BaseProjection', 'GeometryManager',
            'ProjectionManager', 'ShaderManager', 'HypercubeCore'
        ];
        
        coreClasses.forEach(cls => {
            const found = document.body.innerHTML.includes(cls);
            results.classes[cls] = { found, required: true };
        });
        
        // 5. HYPERCUBE FACE SYSTEM
        console.log('🎮 Hypercube Face System Audit...');
        const faces = [];
        for (let i = 0; i < 8; i++) {
            const face = document.querySelector(`#face-${i}`);
            const canvas = face ? face.querySelector('canvas') : null;
            faces.push({
                id: `face-${i}`,
                exists: !!face,
                hasCanvas: !!canvas,
                visible: face ? face.style.display !== 'none' : false
            });
        }
        results.integration.hypercubeFaces = faces;
        
        // 6. VIB3 INTEGRATION CHECK
        console.log('🏠 VIB3 Integration Audit...');
        results.integration.vib3Systems = {
            homeMaster: !!(window.VIB3HomeMaster),
            reactivityBridge: !!(window.UnifiedReactivityBridge),
            semanticEngine: !!(window.SemanticReactivityEngine),
            vib3TransitionSystem: !!(window.vib3TransitionSystem)
        };
        
        // 7. EDITOR DASHBOARD CHECK
        console.log('🎛️ Editor Dashboard Audit...');
        const dashboard = document.querySelector('.editor-dashboard') || document.querySelector('.control-panel');
        results.integration.editorDashboard = {
            exists: !!dashboard,
            controls: dashboard ? dashboard.querySelectorAll('input, select').length : 0
        };
        
        // 8. VISUAL SYSTEM STATUS
        console.log('👁️ Visual System Status...');
        const canvases = document.querySelectorAll('canvas');
        const webglContexts = [];
        canvases.forEach((canvas, i) => {
            const gl = canvas.getContext('webgl');
            webglContexts.push({
                index: i,
                hasWebGL: !!gl,
                width: canvas.width,
                height: canvas.height,
                id: canvas.id || `canvas-${i}`
            });
        });
        results.integration.webglContexts = webglContexts;
        
        console.log('✅ Parameter Codex audit complete');
        return results;
    });
    
    // ANALYSIS AND REPORTING
    console.log('\n📊 PARAMETER CODEX COMPLIANCE REPORT');
    console.log('='.repeat(60));
    
    // Phase Status
    console.log('\n🏗️ PHASE IMPLEMENTATION STATUS:');
    Object.entries(auditResults.phases).forEach(([phase, data]) => {
        const status = data.exists ? '✅ FOUND' : '❌ MISSING';
        console.log(`  ${phase}: ${status} (${data.classes.length} classes)`);
        if (data.classes.length > 0) {
            console.log(`    Classes: ${data.classes.join(', ')}`);
        }
    });
    
    // Shader Uniform Status
    console.log('\n🎛️ SHADER UNIFORM COMPLIANCE:');
    const uniformCount = Object.values(auditResults.uniforms).filter(u => u.found).length;
    console.log(`  Found: ${uniformCount}/17 required uniforms`);
    Object.entries(auditResults.uniforms).forEach(([uniform, data]) => {
        const status = data.found ? '✅' : '❌';
        console.log(`  ${status} ${uniform}`);
    });
    
    // Geometry Status
    console.log('\n📐 GEOMETRY IMPLEMENTATION:');
    const geomCount = Object.values(auditResults.geometries).filter(g => g.found).length;
    console.log(`  Found: ${geomCount}/8 required geometries`);
    Object.entries(auditResults.geometries).forEach(([geom, data]) => {
        const status = data.found ? '✅' : '❌';
        console.log(`  ${status} ${geom}`);
    });
    
    // Core Architecture
    console.log('\n🏗️ CORE ARCHITECTURE:');
    const classCount = Object.values(auditResults.classes).filter(c => c.found).length;
    console.log(`  Found: ${classCount}/6 required core classes`);
    Object.entries(auditResults.classes).forEach(([cls, data]) => {
        const status = data.found ? '✅' : '❌';
        console.log(`  ${status} ${cls}`);
    });
    
    // Integration Status
    console.log('\n🔗 INTEGRATION SYSTEMS:');
    console.log(`  Hypercube Faces: ${auditResults.integration.hypercubeFaces.filter(f => f.exists).length}/8`);
    console.log(`  Faces with Canvas: ${auditResults.integration.hypercubeFaces.filter(f => f.hasCanvas).length}/8`);
    console.log(`  VIB3 HomeMaster: ${auditResults.integration.vib3Systems.homeMaster ? '✅' : '❌'}`);
    console.log(`  Reactivity Bridge: ${auditResults.integration.vib3Systems.reactivityBridge ? '✅' : '❌'}`);
    console.log(`  Transition System: ${auditResults.integration.vib3Systems.vib3TransitionSystem ? '✅' : '❌'}`);
    console.log(`  Editor Dashboard: ${auditResults.integration.editorDashboard.exists ? '✅' : '❌'}`);
    console.log(`  WebGL Contexts: ${auditResults.integration.webglContexts.filter(c => c.hasWebGL).length}`);
    
    // Face Details
    console.log('\n🎮 HYPERCUBE FACE DETAILS:');
    auditResults.integration.hypercubeFaces.forEach(face => {
        const status = face.exists ? '✅' : '❌';
        const canvasStatus = face.hasCanvas ? '🎨' : '⬜';
        console.log(`  ${status} ${canvasStatus} ${face.id} (canvas: ${face.hasCanvas})`);
    });
    
    // Canvas Details
    console.log('\n🎨 WEBGL CANVAS STATUS:');
    auditResults.integration.webglContexts.forEach(ctx => {
        const status = ctx.hasWebGL ? '✅' : '❌';
        console.log(`  ${status} ${ctx.id} (${ctx.width}x${ctx.height})`);
    });
    
    // CRITICAL ISSUES IDENTIFICATION
    console.log('\n🚨 CRITICAL ISSUES IDENTIFIED:');
    const issues = [];
    
    // Check Phase completeness
    const missingPhases = Object.entries(auditResults.phases).filter(([_, data]) => !data.exists);
    if (missingPhases.length > 0) {
        issues.push(`Missing Phases: ${missingPhases.map(([name]) => name).join(', ')}`);
    }
    
    // Check uniform completeness  
    if (uniformCount < 17) {
        const missing = Object.entries(auditResults.uniforms).filter(([_, data]) => !data.found).map(([name]) => name);
        issues.push(`Missing Uniforms: ${missing.join(', ')}`);
    }
    
    // Check geometry completeness
    if (geomCount < 8) {
        const missing = Object.entries(auditResults.geometries).filter(([_, data]) => !data.found).map(([name]) => name);
        issues.push(`Missing Geometries: ${missing.join(', ')}`);
    }
    
    // Check core architecture
    if (classCount < 6) {
        const missing = Object.entries(auditResults.classes).filter(([_, data]) => !data.found).map(([name]) => name);
        issues.push(`Missing Core Classes: ${missing.join(', ')}`);
    }
    
    // Check face system
    const facesWithCanvas = auditResults.integration.hypercubeFaces.filter(f => f.hasCanvas).length;
    if (facesWithCanvas < 6) {
        issues.push(`Only ${facesWithCanvas}/6+ faces have canvas elements`);
    }
    
    if (issues.length > 0) {
        issues.forEach(issue => console.log(`  ❌ ${issue}`));
    } else {
        console.log('  ✅ No critical issues identified - system appears compliant');
    }
    
    console.log('\n🎯 DEPLOYMENT STATUS:');
    const overallCompliance = (uniformCount >= 15) && (geomCount >= 6) && (classCount >= 4) && (facesWithCanvas >= 6);
    if (overallCompliance) {
        console.log('✅ SYSTEM READY FOR GITHUB PAGES DEPLOYMENT');
    } else {
        console.log('⚠️  SYSTEM NEEDS FIXES BEFORE DEPLOYMENT');
    }
    
    await page.screenshot({ path: 'parameter-codex-audit.png' });
    
    // Keep browser open for manual testing
    console.log('\n🔍 Browser kept open for manual verification...');
    console.log('Press Ctrl+C to close and deploy to GitHub Pages');
    
    await new Promise(() => {}); // Keep running
}

comprehensiveParameterAudit().catch(console.error);