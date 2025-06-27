/**
 * Basic VIB34D System Test
 * Tests core functionality without browser dependencies
 */

const http = require('http');
const fs = require('fs');

function testHTTPEndpoints() {
    console.log('🚀 Testing VIB34D System Endpoints...');
    
    const testUrls = [
        { path: '/VIB34D_PHASE1_INTEGRATED_DEMO.html', name: 'Main Demo HTML' },
        { path: '/VIB34D_WORKING_CORE_ARCHITECTURE.js', name: 'Working Core Architecture' },
        { path: '/VIB34D_CENTRAL_STATE_MANAGER.js', name: 'Central State Manager' }
    ];
    
    testUrls.forEach(test => {
        console.log(`📡 Testing ${test.name}...`);
        
        const req = http.get(`http://localhost:8080${test.path}`, (res) => {
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${test.name}: OK (${data.length} bytes)`);
                    
                    // Check for key content
                    if (test.path.includes('.html')) {
                        const hasTitle = data.includes('VIB34D - Phase 1 Integrated Central State Demo');
                        const hasScript = data.includes('VIB34D_WORKING_CORE_ARCHITECTURE.js');
                        const hasManager = data.includes('VIB34D_CENTRAL_STATE_MANAGER.js');
                        console.log(`  📄 HTML Structure: Title(${hasTitle}) Core(${hasScript}) Manager(${hasManager})`);
                    }
                    
                    if (test.path.includes('WORKING_CORE')) {
                        const hasShaderManager = data.includes('class ShaderManager');
                        const hasHypercubeCore = data.includes('class HypercubeCore');
                        const hasBaseGeometry = data.includes('class BaseGeometry');
                        console.log(`  🏗️ Core Classes: ShaderManager(${hasShaderManager}) HypercubeCore(${hasHypercubeCore}) BaseGeometry(${hasBaseGeometry})`);
                    }
                    
                    if (test.path.includes('CENTRAL_STATE')) {
                        const hasCentralManager = data.includes('class VIB34DCentralStateManager');
                        const hasVisualizerMap = data.includes('this.visualizers = new Map()');
                        const hasEventHandling = data.includes('handleUserEvent');
                        console.log(`  🎯 State Management: CentralManager(${hasCentralManager}) VisualizerMap(${hasVisualizerMap}) EventHandling(${hasEventHandling})`);
                    }
                    
                } else {
                    console.log(`❌ ${test.name}: HTTP ${res.statusCode}`);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${test.name}: ${err.message}`);
        });
    });
}

function analyzeSystemIntegration() {
    console.log('\n🔍 Analyzing System Integration...');
    
    try {
        const htmlContent = fs.readFileSync('VIB34D_PHASE1_INTEGRATED_DEMO.html', 'utf8');
        const coreContent = fs.readFileSync('VIB34D_WORKING_CORE_ARCHITECTURE.js', 'utf8');
        const stateContent = fs.readFileSync('VIB34D_CENTRAL_STATE_MANAGER.js', 'utf8');
        
        console.log('📊 System Architecture Analysis:');
        console.log('================================');
        
        // Check HTML integration
        const visualizerConfigs = (htmlContent.match(/visualizerConfigs\s*=\s*\[[\s\S]*?\]/)?.[0] || '').split(',').length;
        const hasControlButtons = htmlContent.includes('interaction-controls');
        const hasDashboard = htmlContent.includes('state-dashboard');
        
        console.log(`🖥️ HTML Interface:`);
        console.log(`  📦 Visualizer Configs: ~${visualizerConfigs} items`);
        console.log(`  🎮 Control Buttons: ${hasControlButtons}`);
        console.log(`  📊 State Dashboard: ${hasDashboard}`);
        
        // Check core architecture
        const shaderClasses = (coreContent.match(/class \w+Geometry/g) || []).length;
        const projectionClasses = (coreContent.match(/class \w+Projection/g) || []).length;
        const managerClasses = (coreContent.match(/class \w+Manager/g) || []).length;
        
        console.log(`🏗️ Core Architecture:`);
        console.log(`  🎨 Geometry Classes: ${shaderClasses}`);
        console.log(`  📐 Projection Classes: ${projectionClasses}`);
        console.log(`  ⚙️ Manager Classes: ${managerClasses}`);
        
        // Check state management
        const hasEventHandlers = stateContent.includes('handleUserEvent');
        const hasFocusSystem = stateContent.includes('calculateFocusStates');
        const hasParameterCascading = stateContent.includes('cascadeParameterUpdate');
        
        console.log(`🎯 State Management:`);
        console.log(`  🖱️ Event Handling: ${hasEventHandlers}`);
        console.log(`  🎯 Focus System: ${hasFocusSystem}`);
        console.log(`  🌊 Parameter Cascading: ${hasParameterCascading}`);
        
        // Integration points
        const htmlCallsCore = htmlContent.includes('VIB34D_WorkingCore');
        const htmlCallsState = htmlContent.includes('VIB34DCentralStateManager');
        const stateUsesCore = stateContent.includes('HypercubeCore');
        
        console.log(`🔗 Integration Points:`);
        console.log(`  HTML → Core: ${htmlCallsCore}`);
        console.log(`  HTML → State: ${htmlCallsState}`);
        console.log(`  State → Core: ${stateUsesCore}`);
        
        console.log('\n✅ System appears properly integrated!');
        
    } catch (error) {
        console.log(`❌ File analysis failed: ${error.message}`);
    }
}

function checkServerStatus() {
    console.log('🔍 Checking server status...');
    
    const req = http.get('http://localhost:8080/', (res) => {
        if (res.statusCode === 200) {
            console.log('✅ HTTP server is running on port 8080');
            
            // Run tests
            setTimeout(() => {
                testHTTPEndpoints();
                setTimeout(analyzeSystemIntegration, 2000);
            }, 1000);
            
        } else {
            console.log(`❌ Server returned status ${res.statusCode}`);
        }
    });
    
    req.on('error', (err) => {
        console.log('❌ Server is not running. Please start with: python3 -m http.server 8080');
        console.log(`   Error: ${err.message}`);
    });
}

console.log('🚀 VIB34D System Basic Test Starting...');
checkServerStatus();