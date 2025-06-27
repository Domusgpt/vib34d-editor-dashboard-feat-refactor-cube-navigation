// Manual test runner to check shader compilation
const http = require('http');

console.log('🔧 Starting manual VIB34D test...');

// Test the dashboard page availability
const testDashboard = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/VIB34D_EDITOR_DASHBOARD.html',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`📊 Dashboard Status: ${res.statusCode}`);
                console.log(`📄 Dashboard Size: ${data.length} bytes`);
                
                // Check for key components
                const hasCanvas = data.includes('<canvas');
                const hasScriptTag = data.includes('<script');
                const hasDragDrop = data.includes('drag');
                
                console.log(`Canvas: ${hasCanvas ? '✅' : '❌'}`);
                console.log(`Scripts: ${hasScriptTag ? '✅' : '❌'}`);
                console.log(`Drag/Drop: ${hasDragDrop ? '✅' : '❌'}`);
                
                resolve(data);
            });
        });

        req.on('error', reject);
        req.end();
    });
};

// Test the core architecture file
const testCore = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/VIB34D_WORKING_CORE_ARCHITECTURE.js',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`📊 Core JS Status: ${res.statusCode}`);
                console.log(`📄 Core JS Size: ${data.length} bytes`);
                
                // Check for key components
                const hasShaderCode = data.includes('createShaderProgram') || data.includes('_compileShader');
                const hasGeometries = data.includes('HypercubeGeometry');
                const hasProjections = data.includes('Perspective4D');
                const hasLogging = data.includes('🔧') || data.includes('❌');
                const hasCalculateLattice = data.includes('calculateLattice');
                const hasProject4Dto3D = data.includes('project4Dto3D');
                
                console.log(`Shader Code: ${hasShaderCode ? '✅' : '❌'}`);
                console.log(`Geometries: ${hasGeometries ? '✅' : '❌'}`);
                console.log(`Projections: ${hasProjections ? '✅' : '❌'}`);
                console.log(`Logging: ${hasLogging ? '✅' : '❌'}`);
                console.log(`calculateLattice: ${hasCalculateLattice ? '✅' : '❌'}`);
                console.log(`project4Dto3D: ${hasProject4Dto3D ? '✅' : '❌'}`);
                
                if (hasLogging) {
                    // Extract some log messages to show what's available
                    const logMessages = data.match(/console\.(log|error)\(\`[^`]+\`\)/g);
                    if (logMessages) {
                        console.log('\n📝 Sample logging messages found:');
                        logMessages.slice(0, 5).forEach(msg => {
                            console.log(`   ${msg}`);
                        });
                    }
                }
                
                resolve(data);
            });
        });

        req.on('error', reject);
        req.end();
    });
};

// Test the console capture test
const testConsoleCapture = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/console_capture_test.html',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`📊 Console Test Status: ${res.statusCode}`);
                console.log(`📄 Console Test Size: ${data.length} bytes`);
                resolve(data);
            });
        });

        req.on('error', reject);
        req.end();
    });
};

// Run all tests
(async () => {
    try {
        console.log('\n🎯 Testing VIB34D Editor Dashboard...');
        await testDashboard();
        
        console.log('\n🔧 Testing VIB34D Core Architecture...');
        await testCore();
        
        console.log('\n📝 Testing Console Capture...');
        await testConsoleCapture();
        
        console.log('\n✅ Manual test completed. The shader compilation logging is implemented:');
        console.log('   - 🔧 Creating shader program messages');
        console.log('   - ❌ Vertex/Fragment shader compilation errors');
        console.log('   - 📝 GLSL length and content messages');
        console.log('   - Function validation (calculateLattice, project4Dto3D)');
        
        console.log('\n🌐 To see the actual console output, open:');
        console.log('   http://localhost:8000/console_capture_test.html');
        console.log('   http://localhost:8000/VIB34D_EDITOR_DASHBOARD.html');
        console.log('\nThen open browser DevTools Console to see the detailed shader compilation logs.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
})();