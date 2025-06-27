// Quick Demo Check - Run this in the browser console on the demo page

console.log('🔍 Quick VIB34D Demo Check Starting...');

// Check 1: Basic DOM Elements
const grid = document.getElementById('visualizer-grid');
console.log('📊 Visualizer Grid:', grid ? `Found with ${grid.children.length} children` : 'NOT FOUND');

// Check 2: Required Scripts
console.log('📊 Working Core:', typeof window.VIB34D_WorkingCore !== 'undefined' ? 'LOADED' : 'NOT LOADED');
console.log('📊 Central State Manager:', typeof VIB34DCentralStateManager !== 'undefined' ? 'LOADED' : 'NOT LOADED');

// Check 3: Global Variables
console.log('📊 centralStateManager instance:', typeof centralStateManager !== 'undefined' && centralStateManager !== null ? 'EXISTS' : 'MISSING');
console.log('📊 visualizers array:', typeof visualizers !== 'undefined' ? `${visualizers.length} items` : 'MISSING');

// Check 4: Status Elements
const statusElements = ['architectureStatus', 'hypercubeCoreCount', 'centralStateStatus'];
statusElements.forEach(id => {
    const el = document.getElementById(id);
    console.log(`📊 ${id}:`, el ? el.textContent : 'NOT FOUND');
});

// Check 5: Error/Success Displays
const errors = document.querySelectorAll('.error-display');
const successes = document.querySelectorAll('.success-display');
console.log('📊 Error displays:', errors.length);
console.log('📊 Success displays:', successes.length);

if (errors.length > 0) {
    errors.forEach((error, i) => {
        console.log(`❌ Error ${i+1}:`, error.textContent.trim());
    });
}

// Check 6: Quick Fix Attempt
if (grid && grid.children.length === 0 && typeof window.VIB34D_WorkingCore !== 'undefined' && typeof VIB34DCentralStateManager !== 'undefined') {
    console.log('🔧 Attempting manual initialization...');
    
    try {
        // Try to create central state manager manually
        if (!window.centralStateManager) {
            window.centralStateManager = new VIB34DCentralStateManager();
            console.log('✅ Manual central state manager created');
        }
        
        // Try to create visualizers manually
        const testConfig = {
            id: 'test-hypercube',
            name: 'Test Hypercube',
            geometry: 'hypercube',
            projection: 'perspective',
            position: { x: 0.5, y: 0.5 },
            role: 'test'
        };
        
        const testCard = document.createElement('div');
        testCard.className = 'visualizer-card';
        testCard.innerHTML = `
            <canvas class="card-canvas" width="350" height="300"></canvas>
            <div class="card-overlay">
                <div class="card-info">
                    <div class="card-title">Manual Test Card</div>
                    <div class="card-geometry">Testing initialization...</div>
                </div>
            </div>
        `;
        
        grid.appendChild(testCard);
        
        const canvas = testCard.querySelector('.card-canvas');
        const registered = window.centralStateManager.registerVisualizer(testConfig.id, canvas, testConfig);
        
        console.log('🔧 Manual test card:', registered ? 'SUCCESS' : 'FAILED');
        
        if (registered) {
            console.log('✅ Manual initialization worked! The issue is in the automatic initialization.');
            console.log('💡 Check the createVisualizerCards() function and its error handling.');
        }
        
    } catch (error) {
        console.log('❌ Manual initialization failed:', error.message);
        console.log('💡 This suggests a deeper issue with the core classes or WebGL support.');
    }
}

console.log('🎯 Quick check complete. See results above.');

// Return summary for easy reading
const summary = {
    gridFound: !!grid,
    cardCount: grid ? grid.children.length : 0,
    coreLoaded: typeof window.VIB34D_WorkingCore !== 'undefined',
    managerLoaded: typeof VIB34DCentralStateManager !== 'undefined',
    instanceExists: typeof centralStateManager !== 'undefined' && centralStateManager !== null,
    errors: errors.length,
    successes: successes.length
};

console.log('📋 SUMMARY:', summary);

// Provide specific diagnosis
if (!summary.coreLoaded) {
    console.log('🎯 DIAGNOSIS: Working Core Architecture script not loading');
} else if (!summary.managerLoaded) {
    console.log('🎯 DIAGNOSIS: Central State Manager script not loading');
} else if (!summary.instanceExists) {
    console.log('🎯 DIAGNOSIS: Central State Manager instantiation failing');
} else if (summary.cardCount === 0) {
    console.log('🎯 DIAGNOSIS: Visualizer card creation failing');
} else if (summary.cardCount < 8) {
    console.log('🎯 DIAGNOSIS: Partial visualizer card creation');
} else {
    console.log('🎯 DIAGNOSIS: All systems appear normal - possible CSS/visibility issue');
}

return summary;