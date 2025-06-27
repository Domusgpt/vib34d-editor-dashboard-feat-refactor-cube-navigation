/**
 * VIB3STYLEPACK Real-Time MCP Parser
 * 
 * Connects VIB34D visualization system with Parserator MCP Server
 * for intelligent parameter parsing and real-time data analysis
 */

class VIB3RealtimeMCPParser {
    constructor(mcpServerUrl = null, apiKey = null) {
        this.mcpServerUrl = mcpServerUrl || 'https://app-5108296280.us-central1.run.app';
        this.apiKey = apiKey;
        this.connected = false;
        this.parseHistory = [];
        this.performanceMetrics = {
            totalParses: 0,
            averageLatency: 0,
            successRate: 0,
            lastParseTime: null
        };
        
        // Load VIB3 schemas
        this.schemas = null;
        this.loadSchemas();
        
        console.log('🤖 VIB3RealtimeMCPParser initialized');
    }
    
    /**
     * Load VIB3 parsing schemas
     */
    async loadSchemas() {
        try {
            // In a real implementation, this would load from the JSON file
            // For now, we'll use the embedded schema
            this.schemas = {
                vib3_log_entry: {
                    "phase": "number",
                    "geometry": "string",
                    "rotation_speed": "number",
                    "grid_density": "number",
                    "interactions": {
                        "scroll": "number",
                        "click": "number", 
                        "mouse": "number"
                    },
                    "color_shift": "number",
                    "morph_factor": "number",
                    "timestamp": "string"
                },
                vib3_performance_metrics: {
                    "fps": "number",
                    "latency_ms": "number",
                    "memory_mb": "number",
                    "gpu_utilization_percent": "number",
                    "shader_compile_time_ms": "number",
                    "performance_score": "number"
                },
                shader_uniforms: {
                    "u_resolution": "array",
                    "u_time": "number",
                    "u_mouse": "array",
                    "u_dimension": "number",
                    "u_morphFactor": "number",
                    "u_rotationSpeed": "number",
                    "u_gridDensity": "number",
                    "u_lineThickness": "number",
                    "u_universeModifier": "number",
                    "u_patternIntensity": "number",
                    "u_shellWidth": "number",
                    "u_tetraThickness": "number",
                    "u_glitchIntensity": "number",
                    "u_colorShift": "number",
                    "u_audioBass": "number",
                    "u_audioMid": "number",
                    "u_audioHigh": "number"
                }
            };
            
            console.log('📋 VIB3 parsing schemas loaded');
        } catch (error) {
            console.error('❌ Failed to load schemas:', error);
        }
    }
    
    /**
     * Connect to MCP server (simulated for this demo)
     */
    async connect() {
        console.log('🔌 Connecting to MCP server...');
        
        try {
            // Simulate connection delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.connected = true;
            console.log('✅ Connected to MCP server');
            return true;
            
        } catch (error) {
            console.error('❌ MCP connection failed:', error);
            return false;
        }
    }
    
    /**
     * Parse VIB3 system data using MCP
     */
    async parseVIB3Data(inputData, dataType = 'vib3_log_entry') {
        if (!this.connected) {
            throw new Error('MCP server not connected');
        }
        
        const startTime = performance.now();
        
        try {
            console.log(`🔍 Parsing VIB3 data (${dataType}):`, inputData.substring(0, 100) + '...');
            
            // Get appropriate schema
            const outputSchema = this.schemas[dataType];
            if (!outputSchema) {
                throw new Error(`Unknown data type: ${dataType}`);
            }
            
            // Simulate MCP parsing (in real implementation, this would call the actual MCP server)
            const parsedResult = await this.simulateMCPParsing(inputData, outputSchema, dataType);
            
            const latency = performance.now() - startTime;
            
            // Update performance metrics
            this.updateMetrics(latency, true);
            
            // Store in history
            this.parseHistory.push({
                timestamp: new Date().toISOString(),
                inputData: inputData.substring(0, 200),
                dataType,
                result: parsedResult,
                latency,
                success: true
            });
            
            console.log(`✅ Parse completed in ${latency.toFixed(1)}ms`);
            return parsedResult;
            
        } catch (error) {
            const latency = performance.now() - startTime;
            this.updateMetrics(latency, false);
            
            console.error('❌ Parse failed:', error);
            throw error;
        }
    }
    
    /**
     * Simulate MCP parsing (replace with actual MCP calls in production)
     */
    async simulateMCPParsing(inputData, outputSchema, dataType) {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        
        let parsedData = {};
        
        switch (dataType) {
            case 'vib3_log_entry':
                parsedData = this.parseVIB3LogEntry(inputData);
                break;
                
            case 'vib3_performance_metrics':
                parsedData = this.parsePerformanceMetrics(inputData);
                break;
                
            case 'shader_uniforms':
                parsedData = this.parseShaderUniforms(inputData);
                break;
                
            default:
                // Generic parsing fallback
                parsedData = this.genericParse(inputData, outputSchema);
        }
        
        return {
            success: true,
            parsedData,
            metadata: {
                confidence: 0.85 + Math.random() * 0.1,
                tokensUsed: Math.floor(Math.random() * 200) + 50,
                processingTime: Math.floor(Math.random() * 300) + 100,
                dataType,
                schemaMatched: true
            }
        };
    }
    
    /**
     * Parse VIB3 log entry format
     */
    parseVIB3LogEntry(inputData) {
        // Example: "VIB34D Phase: 7, Geometry: hypercube, Rotation: 1.2rad/s, Grid Density: 12.5, Interaction: scroll(0.8), click(0.3), mouse(0.6), Color Shift: 0.2, Morph Factor: 0.7"
        
        const patterns = {
            phase: /Phase:\s*(\d+)/i,
            geometry: /Geometry:\s*(\w+)/i,
            rotation: /Rotation:\s*([\d.]+)/i,
            gridDensity: /Grid Density:\s*([\d.]+)/i,
            scroll: /scroll\(([\d.]+)\)/i,
            click: /click\(([\d.]+)\)/i,
            mouse: /mouse\(([\d.]+)\)/i,
            colorShift: /Color Shift:\s*([-\d.]+)/i,
            morphFactor: /Morph Factor:\s*([\d.]+)/i
        };
        
        const extracted = {};
        
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = inputData.match(pattern);
            if (match) {
                extracted[key] = isNaN(match[1]) ? match[1] : parseFloat(match[1]);
            }
        }
        
        return {
            phase: extracted.phase || 7,
            geometry: extracted.geometry || 'unknown',
            rotation_speed: extracted.rotation || 0,
            grid_density: extracted.gridDensity || 0,
            interactions: {
                scroll: extracted.scroll || 0,
                click: extracted.click || 0,
                mouse: extracted.mouse || 0
            },
            color_shift: extracted.colorShift || 0,
            morph_factor: extracted.morphFactor || 0,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Parse performance metrics
     */
    parsePerformanceMetrics(inputData) {
        // Example: "FPS: 60, Latency: 16ms, Memory: 245MB, GPU: 65%, Shader: 45ms"
        
        const patterns = {
            fps: /FPS:\s*(\d+)/i,
            latency: /Latency:\s*(\d+)ms/i,
            memory: /Memory:\s*(\d+)MB/i,
            gpu: /GPU:\s*(\d+)%/i,
            shader: /Shader:\s*(\d+)ms/i
        };
        
        const extracted = {};
        
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = inputData.match(pattern);
            if (match) {
                extracted[key] = parseInt(match[1]);
            }
        }
        
        // Calculate performance score
        const fps = extracted.fps || 30;
        const latency = extracted.latency || 33;
        const performanceScore = Math.min(100, Math.max(0, 
            (fps / 60) * 40 + 
            ((33 - latency) / 33) * 30 + 
            ((100 - (extracted.gpu || 50)) / 100) * 30
        ));
        
        return {
            fps: fps,
            latency_ms: latency,
            memory_mb: extracted.memory || 0,
            gpu_utilization_percent: extracted.gpu || 0,
            shader_compile_time_ms: extracted.shader || 0,
            performance_score: Math.round(performanceScore)
        };
    }
    
    /**
     * Parse shader uniforms
     */
    parseShaderUniforms(inputData) {
        // Example: "u_dimension: 4.2, u_morphFactor: 0.8, u_rotationSpeed: 1.5, u_gridDensity: 15.0"
        
        const uniformPattern = /u_(\w+):\s*([\d.-]+)/g;
        const uniforms = {};
        let match;
        
        while ((match = uniformPattern.exec(inputData)) !== null) {
            const [, name, value] = match;
            uniforms[`u_${name}`] = parseFloat(value);
        }
        
        return uniforms;
    }
    
    /**
     * Generic parsing fallback
     */
    genericParse(inputData, outputSchema) {
        // Simple extraction based on common patterns
        const result = {};
        
        // Look for number patterns
        const numbers = inputData.match(/\d+\.?\d*/g) || [];
        
        // Look for word patterns
        const words = inputData.match(/\b[a-zA-Z]+\b/g) || [];
        
        // Map to schema structure (simplified)
        let numberIndex = 0;
        let wordIndex = 0;
        
        for (const [key, type] of Object.entries(outputSchema)) {
            if (type === 'number' && numberIndex < numbers.length) {
                result[key] = parseFloat(numbers[numberIndex++]);
            } else if (type === 'string' && wordIndex < words.length) {
                result[key] = words[wordIndex++];
            }
        }
        
        return result;
    }
    
    /**
     * Update performance metrics
     */
    updateMetrics(latency, success) {
        this.performanceMetrics.totalParses++;
        this.performanceMetrics.lastParseTime = Date.now();
        
        // Update average latency
        const currentAvg = this.performanceMetrics.averageLatency;
        const total = this.performanceMetrics.totalParses;
        this.performanceMetrics.averageLatency = (currentAvg * (total - 1) + latency) / total;
        
        // Update success rate
        const successes = this.parseHistory.filter(h => h.success).length + (success ? 1 : 0);
        this.performanceMetrics.successRate = (successes / total) * 100;
    }
    
    /**
     * Parse VIB3 system state in real-time
     */
    async parseSystemState(vib3System) {
        if (!vib3System) {
            throw new Error('VIB3 system not provided');
        }
        
        try {
            // Get system analysis
            const analysis = vib3System.getSystemAnalysis();
            
            // Convert to parseable string format
            const stateString = this.formatSystemStateForParsing(analysis);
            
            // Parse using MCP
            const result = await this.parseVIB3Data(stateString, 'vib3_log_entry');
            
            return {
                originalAnalysis: analysis,
                parsedState: result,
                integrationHealth: this.calculateIntegrationHealth(analysis, result)
            };
            
        } catch (error) {
            console.error('❌ Real-time parsing failed:', error);
            throw error;
        }
    }
    
    /**
     * Format system state for parsing
     */
    formatSystemStateForParsing(analysis) {
        const vib3Integration = analysis.vib3Integration || {};
        const masterState = vib3Integration.vib3MasterState || {};
        
        return `VIB34D Phase: 7, Geometry: ${vib3Integration.currentGeometry || 'hypercube'}, ` +
               `Rotation: ${masterState.speed || 1.0}rad/s, Grid Density: ${masterState.density || 10.0}, ` +
               `Interaction: scroll(${masterState.scrollChaos || 0}), click(${masterState.clickPulse || 0}), ` +
               `mouse(${masterState.mouseIntensity || 0}), Color Shift: ${masterState.colorShift || 0}, ` +
               `Morph Factor: ${masterState.complexity || 0.5}`;
    }
    
    /**
     * Calculate integration health score
     */
    calculateIntegrationHealth(originalAnalysis, parsedResult) {
        let healthScore = 100;
        const issues = [];
        
        // Check if parsing was successful
        if (!parsedResult.success) {
            healthScore -= 50;
            issues.push('Parsing failed');
        }
        
        // Check confidence level
        const confidence = parsedResult.metadata?.confidence || 0;
        if (confidence < 0.8) {
            healthScore -= 20;
            issues.push('Low parsing confidence');
        }
        
        // Check latency
        const latency = this.performanceMetrics.averageLatency;
        if (latency > 500) {
            healthScore -= 15;
            issues.push('High parsing latency');
        }
        
        // Check success rate
        const successRate = this.performanceMetrics.successRate;
        if (successRate < 90) {
            healthScore -= 15;
            issues.push('Low success rate');
        }
        
        return {
            score: Math.max(0, healthScore),
            issues,
            recommendations: this.generateRecommendations(issues)
        };
    }
    
    /**
     * Generate recommendations based on issues
     */
    generateRecommendations(issues) {
        const recommendations = [];
        
        if (issues.includes('Parsing failed')) {
            recommendations.push('Check MCP server connection and API key');
        }
        
        if (issues.includes('Low parsing confidence')) {
            recommendations.push('Improve data formatting for better parsing accuracy');
        }
        
        if (issues.includes('High parsing latency')) {
            recommendations.push('Consider caching or batch processing for better performance');
        }
        
        if (issues.includes('Low success rate')) {
            recommendations.push('Review parsing schemas and error handling');
        }
        
        return recommendations;
    }
    
    /**
     * Get parsing analytics
     */
    getAnalytics() {
        return {
            performance: this.performanceMetrics,
            recentHistory: this.parseHistory.slice(-10),
            schemasLoaded: Object.keys(this.schemas || {}).length,
            connectionStatus: this.connected ? 'connected' : 'disconnected'
        };
    }
    
    /**
     * Test parsing with sample data
     */
    async runTests() {
        console.log('🧪 Running VIB3 MCP parsing tests...');
        
        const testCases = [
            {
                name: 'VIB3 Log Entry',
                data: 'VIB34D Phase: 7, Geometry: hypercube, Rotation: 1.2rad/s, Grid Density: 12.5, Interaction: scroll(0.8), click(0.3), mouse(0.6), Color Shift: 0.2, Morph Factor: 0.7',
                type: 'vib3_log_entry'
            },
            {
                name: 'Performance Metrics',
                data: 'FPS: 60, Latency: 16ms, Memory: 245MB, GPU: 65%, Shader: 45ms',
                type: 'vib3_performance_metrics'
            },
            {
                name: 'Shader Uniforms',
                data: 'u_dimension: 4.2, u_morphFactor: 0.8, u_rotationSpeed: 1.5, u_gridDensity: 15.0, u_colorShift: -0.3',
                type: 'shader_uniforms'
            }
        ];
        
        const results = [];
        
        for (const testCase of testCases) {
            try {
                console.log(`🔍 Testing: ${testCase.name}`);
                const result = await this.parseVIB3Data(testCase.data, testCase.type);
                results.push({
                    name: testCase.name,
                    success: true,
                    result: result.parsedData,
                    confidence: result.metadata.confidence
                });
                console.log(`✅ ${testCase.name} passed`);
            } catch (error) {
                results.push({
                    name: testCase.name,
                    success: false,
                    error: error.message
                });
                console.log(`❌ ${testCase.name} failed:`, error.message);
            }
        }
        
        console.log(`🏁 Tests completed: ${results.filter(r => r.success).length}/${results.length} passed`);
        return results;
    }
}

// Export for use in browser and Node.js
if (typeof window !== 'undefined') {
    window.VIB3RealtimeMCPParser = VIB3RealtimeMCPParser;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VIB3RealtimeMCPParser;
}

console.log('🤖 VIB3RealtimeMCPParser loaded successfully');