// Quick diagnostic check
console.log('=== VIB34D Demo Diagnostic ===');
console.log('1. Core Architecture:', window.VIB34D_WorkingCore ? 'LOADED' : 'MISSING');
console.log('2. Central State Manager:', window.VIB34DCentralStateManager ? 'LOADED' : 'MISSING'); 
console.log('3. Visualizer Grid Element:', document.getElementById('visualizer-grid') ? 'EXISTS' : 'MISSING');

const grid = document.getElementById('visualizer-grid');
if (grid) {
    console.log('4. Cards in Grid:', grid.children.length);
}

// Try to create a test visualizer
try {
  const testCanvas = document.createElement('canvas');
  testCanvas.width = 100;
  testCanvas.height = 100;
  const testCore = new window.VIB34D_WorkingCore.HypercubeCore(testCanvas);
  console.log('5. HypercubeCore Creation:', 'SUCCESS');
} catch (error) {
  console.log('5. HypercubeCore Creation:', 'FAILED -', error.message);
}

// Check if Central State Manager can be created
try {
  const testState = new VIB34DCentralStateManager();
  console.log('6. Central State Manager Creation:', 'SUCCESS');
} catch (error) {
  console.log('6. Central State Manager Creation:', 'FAILED -', error.message);
}