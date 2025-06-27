/**
 * VIB34D INTERACTION REACTIVITY SYSTEM TEST
 * 
 * Manual test script to verify USER INTERACTION → SHADER PARAMETER mapping
 * Focus: INTERACTION-DRIVEN REACTIVITY (not audio)
 */

console.log('🚀 VIB34D Interaction Reactivity System Test');
console.log('============================================');

// Test Configuration
const TEST_CONFIG = {
    targetDemo: 'VIB34D_PHASE1_INTEGRATED_DEMO.html',
    expectedVisualizers: 8,
    testDuration: 30000, // 30 seconds
    reportInterval: 1000 // 1 second
};

// Test Results Storage
const testResults = {
    hoverTests: [],
    clickTests: [],
    scrollTests: [],
    parameterMappings: {},
    focusStates: {},
    dashboardUpdates: {},
    totalEnvironmentReactions: []
};

function runInteractionReactivityTest() {
    console.log('🎯 Testing VIB34D Interaction → Parameter Mapping...');
    
    // Test 1: Check Central State Manager Initialization
    console.log('\n1️⃣ TESTING: Central State Manager Initialization');
    console.log('==================================================');
    
    if (!window.centralStateManager) {
        console.error('❌ FAIL: Central State Manager not found');
        return false;
    }
    
    const stateManager = window.centralStateManager;
    const globalState = stateManager.globalState;
    
    console.log('✅ PASS: Central State Manager initialized');
    console.log('📊 Visualizers registered:', stateManager.visualizers.size);
    console.log('🎮 Global state:', globalState);
    
    // Test 2: Verify Interaction → Parameter Event Mappings
    console.log('\n2️⃣ TESTING: Event → Parameter Mappings');
    console.log('=======================================');
    
    const eventMappings = stateManager.eventMappings;
    console.log('🗺️ Available event mappings:', Object.keys(eventMappings));
    
    // Check critical mappings
    const criticalMappings = {
        hover: ['u_morphFactor', 'u_audioBass', 'u_gridDensity'],
        click: ['u_morphFactor', 'u_patternIntensity', 'u_audioBass', 'u_glitchIntensity'],
        scroll: ['u_rotationSpeed', 'u_dimension', 'u_audioMid']
    };
    
    let mappingTestsPassed = 0;
    Object.keys(criticalMappings).forEach(eventType => {
        console.log(`\n🔍 Testing ${eventType} mappings:`);
        const mapping = eventMappings[eventType];
        
        if (!mapping) {
            console.error(`❌ FAIL: No mapping found for ${eventType}`);
            return;
        }
        
        const expectedParams = criticalMappings[eventType];
        expectedParams.forEach(param => {
            if (mapping[param]) {
                console.log(`  ✅ ${param}: base=${mapping[param].base}, decay=${mapping[param].decay}`);
            } else {
                console.error(`  ❌ Missing parameter: ${param}`);
            }
        });
        
        mappingTestsPassed++;
    });
    
    console.log(`\n📊 Event mapping tests: ${mappingTestsPassed}/${Object.keys(criticalMappings).length} passed`);
    
    // Test 3: Focus State System
    console.log('\n3️⃣ TESTING: Focus State System');
    console.log('===============================');
    
    const focusModifiers = stateManager.focusModifiers;
    console.log('🎯 Focus modifier states:', Object.keys(focusModifiers));
    
    Object.keys(focusModifiers).forEach(state => {
        const modifier = focusModifiers[state];
        console.log(`  ${state}: scale=${modifier.scale}, intensity=${modifier.intensity}, priority=${modifier.priority}`);
    });
    
    // Test 4: Parameter Validation System
    console.log('\n4️⃣ TESTING: Parameter Validation');
    console.log('=================================');
    
    const baseParams = stateManager.baseParameters;
    const criticalParams = [
        'u_morphFactor', 'u_patternIntensity', 'u_audioBass', 'u_audioMid', 'u_audioHigh',
        'u_gridDensity', 'u_dimension', 'u_rotationSpeed'
    ];
    
    let paramValidationPassed = 0;
    criticalParams.forEach(param => {
        if (baseParams.hasOwnProperty(param)) {
            console.log(`  ✅ ${param}: ${baseParams[param]}`);
            paramValidationPassed++;
        } else {
            console.error(`  ❌ Missing critical parameter: ${param}`);
        }
    });
    
    console.log(`\n📊 Parameter validation: ${paramValidationPassed}/${criticalParams.length} passed`);
    
    // Test 5: Interactive Test Functions
    console.log('\n5️⃣ CREATING: Interactive Test Functions');
    console.log('========================================');
    
    // Create interactive test functions
    window.testHoverReactivity = function(targetID) {
        console.log(`🖱️ Testing hover reactivity on ${targetID}...`);
        
        const beforeState = captureSystemState();
        
        stateManager.handleUserEvent('hover', {
            targetID: targetID,
            mousePosition: { x: 0.5, y: 0.5 }
        });
        
        setTimeout(() => {
            const afterState = captureSystemState();
            compareStates('HOVER', beforeState, afterState, targetID);
        }, 100);
    };
    
    window.testClickReactivity = function(targetID) {
        console.log(`👆 Testing click reactivity on ${targetID}...`);
        
        const beforeState = captureSystemState();
        
        stateManager.handleUserEvent('click', {
            targetID: targetID,
            intensity: 1.0
        });
        
        setTimeout(() => {
            const afterState = captureSystemState();
            compareStates('CLICK', beforeState, afterState, targetID);
        }, 100);
    };
    
    window.testScrollReactivity = function() {
        console.log('📜 Testing scroll reactivity...');
        
        const beforeState = captureSystemState();
        
        stateManager.handleUserEvent('scroll', {
            velocity: 0.8,
            direction: 'down'
        });
        
        setTimeout(() => {
            const afterState = captureSystemState();
            compareStates('SCROLL', beforeState, afterState, 'ALL');
        }, 100);
    };
    
    window.testTotalEnvironmentReaction = function() {
        console.log('🌍 Testing total environment reaction...');
        
        const visualizerIDs = Array.from(stateManager.visualizers.keys());
        const beforeStates = {};
        
        // Capture all visualizer states
        visualizerIDs.forEach(id => {
            beforeStates[id] = captureVisualizerState(id);
        });
        
        // Trigger major interaction
        stateManager.handleUserEvent('click', {
            targetID: visualizerIDs[0],
            intensity: 1.0
        });
        
        setTimeout(() => {
            console.log('🔍 Analyzing total environment reaction...');
            
            visualizerIDs.forEach(id => {
                const afterState = captureVisualizerState(id);
                const beforeState = beforeStates[id];
                
                if (afterState && beforeState) {
                    const changed = compareVisualizerStates(beforeState, afterState);
                    console.log(`  ${id}: ${changed ? '✅ REACTED' : '❌ NO REACTION'}`);
                }
            });
        }, 200);
    };
    
    // Helper functions
    function captureSystemState() {
        return {
            globalState: { ...stateManager.globalState },
            focusStates: Array.from(stateManager.visualizers.entries()).map(([id, viz]) => ({
                id,
                focusState: viz.focusState,
                parameters: { ...viz.currentParameters }
            }))
        };
    }
    
    function captureVisualizerState(visualizerID) {
        const viz = stateManager.visualizers.get(visualizerID);
        if (!viz) return null;
        
        return {
            focusState: viz.focusState,
            morphFactor: viz.currentParameters.u_morphFactor,
            patternIntensity: viz.currentParameters.u_patternIntensity,
            audioBass: viz.currentParameters.u_audioBass,
            audioMid: viz.currentParameters.u_audioMid,
            audioHigh: viz.currentParameters.u_audioHigh,
            lastUpdate: viz.lastUpdate
        };
    }
    
    function compareStates(eventType, beforeState, afterState, targetID) {
        console.log(`\n📊 ${eventType} REACTION ANALYSIS (Target: ${targetID})`);
        console.log('===============================================');
        
        // Check global state changes
        const globalChanged = JSON.stringify(beforeState.globalState) !== JSON.stringify(afterState.globalState);
        console.log(`🌍 Global state changed: ${globalChanged ? '✅ YES' : '❌ NO'}`);
        
        if (globalChanged) {
            console.log('  📈 Changes:');
            Object.keys(afterState.globalState).forEach(key => {
                if (beforeState.globalState[key] !== afterState.globalState[key]) {
                    console.log(`    ${key}: ${beforeState.globalState[key]} → ${afterState.globalState[key]}`);
                }
            });
        }
        
        // Check visualizer parameter changes
        let reactedCount = 0;
        afterState.focusStates.forEach((after, index) => {
            const before = beforeState.focusStates[index];
            if (!before) return;
            
            const paramChanged = compareVisualizerStates(before, after);
            if (paramChanged) {
                reactedCount++;
                console.log(`  ✅ ${after.id}: Parameters changed (Focus: ${after.focusState})`);
            }
        });
        
        console.log(`🎯 Visualizers reacted: ${reactedCount}/${afterState.focusStates.length}`);
        console.log(`📊 Total environment reaction: ${reactedCount >= afterState.focusStates.length * 0.8 ? '✅ SUCCESS' : '⚠️  PARTIAL'}`);
    }
    
    function compareVisualizerStates(before, after) {
        const threshold = 0.001;
        const criticalParams = ['morphFactor', 'patternIntensity', 'audioBass', 'audioMid', 'audioHigh'];
        
        return criticalParams.some(param => {
            const beforeVal = before[param] || 0;
            const afterVal = after[param] || 0;
            return Math.abs(beforeVal - afterVal) > threshold;
        });
    }
    
    // Test 6: Dashboard Monitoring
    console.log('\n6️⃣ TESTING: Dashboard Updates');
    console.log('==============================');
    
    const dashboardElements = [
        'focusedElement', 'interactionType', 'mousePos', 'interactionIntensity'
    ];
    
    dashboardElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`  ✅ ${elementId}: "${element.textContent}"`);
        } else {
            console.error(`  ❌ Missing dashboard element: ${elementId}`);
        }
    });
    
    console.log('\n🎮 INTERACTIVE TEST FUNCTIONS READY:');
    console.log('====================================');
    console.log('Run these in the browser console:');
    console.log('• testHoverReactivity("visualizer1")');
    console.log('• testClickReactivity("visualizer2")');
    console.log('• testScrollReactivity()');
    console.log('• testTotalEnvironmentReaction()');
    
    return true;
}

// Auto-run test when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInteractionReactivityTest);
} else {
    runInteractionReactivityTest();
}

console.log('✅ VIB34D Interaction Test Script Loaded');