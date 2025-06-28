/**
 * VIB34D File Structure Validation
 * Validates all components without needing a server
 */

const fs = require('fs');
const path = require('path');

class VIB34DFileValidator {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            totalTests: 0,
            passed: 0,
            failed: 0,
            errors: [],
            fileStructure: {},
            coreModules: {},
            jsonConfigs: {},
            mainDashboard: {}
        };
    }

    validateFileStructure() {
        console.log('📁 Validating File Structure...');
        this.results.totalTests++;
        
        const requiredFiles = [
            'index_VIB34D_PROFESSIONAL.html',
            'core/ReactiveHyperAVCore.js',
            'core/VIB3HomeMaster.js',
            'core/UnifiedReactivityBridge.js',
            'core/ShaderManager.js',
            'core/GeometryManager.js',
            'core/ProjectionManager.js',
            'core/DragScrollHandler.js',
            'config/visuals.json',
            'config/behavior.json',
            'config/content.json'
        ];
        
        const fileStatus = {};
        let foundFiles = 0;
        
        for (const file of requiredFiles) {
            const exists = fs.existsSync(file);
            const stats = exists ? fs.statSync(file) : null;
            
            fileStatus[file] = {
                exists: exists,
                size: stats ? stats.size : 0,
                modified: stats ? stats.mtime.toISOString() : null
            };
            
            if (exists) {
                foundFiles++;
                console.log(`✅ ${file} (${stats.size} bytes)`);
            } else {
                console.log(`❌ ${file} - MISSING`);
            }
        }
        
        this.results.fileStructure = {
            requiredFiles: requiredFiles.length,
            foundFiles: foundFiles,
            fileStatus: fileStatus
        };
        
        if (foundFiles === requiredFiles.length) {
            console.log(`✅ File Structure: All ${foundFiles} required files found`);
            this.results.passed++;
            return true;
        } else {
            console.log(`❌ File Structure: Only ${foundFiles}/${requiredFiles.length} files found`);
            this.results.failed++;
            return false;
        }
    }

    validateCoreModules() {
        console.log('🔧 Validating Core Modules...');
        this.results.totalTests++;
        
        const coreModules = [
            'core/ReactiveHyperAVCore.js',
            'core/VIB3HomeMaster.js', 
            'core/UnifiedReactivityBridge.js',
            'core/ShaderManager.js'
        ];
        
        let validModules = 0;
        const moduleResults = {};
        
        for (const modulePath of coreModules) {
            try {
                const content = fs.readFileSync(modulePath, 'utf8');
                
                // Check for ES6 export
                const hasExport = content.includes('export default') || content.includes('export {');
                
                // Check for class definition
                const hasClass = content.includes('class ');
                
                // Check for basic structure
                const hasConstructor = content.includes('constructor(');
                
                // Check file size
                const isSubstantial = content.length > 1000;
                
                moduleResults[modulePath] = {
                    hasExport: hasExport,
                    hasClass: hasClass,
                    hasConstructor: hasConstructor,
                    isSubstantial: isSubstantial,
                    size: content.length,
                    valid: hasExport && hasClass && hasConstructor && isSubstantial
                };
                
                if (moduleResults[modulePath].valid) {
                    validModules++;
                    console.log(`✅ ${modulePath} - Valid ES6 module`);
                } else {
                    console.log(`❌ ${modulePath} - Invalid: export=${hasExport}, class=${hasClass}, constructor=${hasConstructor}, substantial=${isSubstantial}`);
                }
                
            } catch (error) {
                console.log(`❌ ${modulePath} - Error reading: ${error.message}`);
                moduleResults[modulePath] = {
                    error: error.message,
                    valid: false
                };
            }
        }
        
        this.results.coreModules = {
            totalModules: coreModules.length,
            validModules: validModules,
            moduleResults: moduleResults
        };
        
        if (validModules === coreModules.length) {
            console.log(`✅ Core Modules: All ${validModules} modules are valid`);
            this.results.passed++;
            return true;
        } else {
            console.log(`❌ Core Modules: Only ${validModules}/${coreModules.length} modules are valid`);
            this.results.failed++;
            return false;
        }
    }

    validateJSONConfigs() {
        console.log('📊 Validating JSON Configurations...');
        this.results.totalTests++;
        
        const configFiles = [
            'config/visuals.json',
            'config/behavior.json',
            'config/content.json'
        ];
        
        let validConfigs = 0;
        const configResults = {};
        
        for (const configPath of configFiles) {
            try {
                const content = fs.readFileSync(configPath, 'utf8');
                const config = JSON.parse(content);
                
                // Check for required structure
                const hasVersion = config.version !== undefined;
                const hasMainStructure = Object.keys(config).length > 1;
                
                configResults[configPath] = {
                    hasVersion: hasVersion,
                    hasMainStructure: hasMainStructure,
                    keys: Object.keys(config),
                    keyCount: Object.keys(config).length,
                    valid: hasVersion && hasMainStructure
                };
                
                if (configResults[configPath].valid) {
                    validConfigs++;
                    console.log(`✅ ${configPath} - Valid JSON (${Object.keys(config).length} keys)`);
                } else {
                    console.log(`❌ ${configPath} - Invalid structure`);
                }
                
            } catch (error) {
                console.log(`❌ ${configPath} - Error: ${error.message}`);
                configResults[configPath] = {
                    error: error.message,
                    valid: false
                };
            }
        }
        
        this.results.jsonConfigs = {
            totalConfigs: configFiles.length,
            validConfigs: validConfigs,
            configResults: configResults
        };
        
        if (validConfigs === configFiles.length) {
            console.log(`✅ JSON Configs: All ${validConfigs} configurations are valid`);
            this.results.passed++;
            return true;
        } else {
            console.log(`❌ JSON Configs: Only ${validConfigs}/${configFiles.length} configurations are valid`);
            this.results.failed++;
            return false;
        }
    }

    validateMainDashboard() {
        console.log('🎯 Validating Main Dashboard...');
        this.results.totalTests++;
        
        try {
            const content = fs.readFileSync('index_VIB34D_PROFESSIONAL.html', 'utf8');
            
            // Check for essential components
            const hasTitle = content.includes('VIB34D Professional Dashboard');
            const hasHypercubeFaces = content.includes('hypercube-face');
            const hasBlogCards = content.includes('blog-card');
            const hasVisualizers = content.includes('card-visualizer');
            const hasNavigation = content.includes('nav-bezel');
            const hasModuleImports = content.includes('import(');
            const hasConfigLoading = content.includes('loadJSONConfigurations');
            
            // Count components
            const faceCount = (content.match(/class="hypercube-face/g) || []).length;
            const cardCount = (content.match(/class="[^"]*blog-card/g) || []).length;
            const visualizerCount = (content.match(/class="[^"]*card-visualizer/g) || []).length;
            const bezelCount = (content.match(/class="[^"]*nav-bezel/g) || []).length;
            
            this.results.mainDashboard = {
                hasTitle: hasTitle,
                hasHypercubeFaces: hasHypercubeFaces,
                hasBlogCards: hasBlogCards,
                hasVisualizers: hasVisualizers,
                hasNavigation: hasNavigation,
                hasModuleImports: hasModuleImports,
                hasConfigLoading: hasConfigLoading,
                faceCount: faceCount,
                cardCount: cardCount,
                visualizerCount: visualizerCount,
                bezelCount: bezelCount,
                fileSize: content.length
            };
            
            const essentialChecks = [
                hasTitle, hasHypercubeFaces, hasBlogCards, hasVisualizers, 
                hasNavigation, hasModuleImports, hasConfigLoading
            ];
            const passedChecks = essentialChecks.filter(check => check).length;
            
            console.log(`📊 Dashboard Analysis:`);
            console.log(`   Title: ${hasTitle ? '✅' : '❌'}`);
            console.log(`   Hypercube faces: ${hasHypercubeFaces ? '✅' : '❌'} (${faceCount} found)`);
            console.log(`   Blog cards: ${hasBlogCards ? '✅' : '❌'} (${cardCount} found)`);
            console.log(`   Visualizers: ${hasVisualizers ? '✅' : '❌'} (${visualizerCount} found)`);
            console.log(`   Navigation: ${hasNavigation ? '✅' : '❌'} (${bezelCount} bezels)`);
            console.log(`   Module imports: ${hasModuleImports ? '✅' : '❌'}`);
            console.log(`   Config loading: ${hasConfigLoading ? '✅' : '❌'}`);
            console.log(`   File size: ${(content.length / 1024).toFixed(1)}KB`);
            
            if (passedChecks === essentialChecks.length && faceCount === 8 && cardCount >= 30) {
                console.log(`✅ Main Dashboard: Complete (${passedChecks}/${essentialChecks.length} checks passed)`);
                this.results.passed++;
                return true;
            } else {
                console.log(`❌ Main Dashboard: Incomplete (${passedChecks}/${essentialChecks.length} checks passed)`);
                this.results.failed++;
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Main Dashboard: Error reading file: ${error.message}`);
            this.results.failed++;
            return false;
        }
    }

    generateReport() {
        console.log('📊 Generating Validation Report...');
        
        const successRate = this.results.totalTests > 0 ? 
            (this.results.passed / this.results.totalTests * 100).toFixed(1) : 0;
        
        this.results.successRate = parseFloat(successRate);
        this.results.status = successRate >= 90 ? 'EXCELLENT' : 
                             successRate >= 70 ? 'GOOD' : 
                             successRate >= 50 ? 'NEEDS_WORK' : 'FAILED';
        
        // Save detailed results
        const reportPath = 'file_validation_report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        // Generate summary
        const summary = `# VIB34D File Structure Validation Report

## Overall Result: ${this.results.status} (${successRate}% success rate)

## Test Summary
- **Total Tests**: ${this.results.totalTests}
- **Passed**: ${this.results.passed}
- **Failed**: ${this.results.failed}

## File Structure
- **Required Files**: ${this.results.fileStructure.requiredFiles || 0}
- **Found Files**: ${this.results.fileStructure.foundFiles || 0}

## Core Modules
- **Total Modules**: ${this.results.coreModules.totalModules || 0}
- **Valid Modules**: ${this.results.coreModules.validModules || 0}

## JSON Configurations
- **Total Configs**: ${this.results.jsonConfigs.totalConfigs || 0}
- **Valid Configs**: ${this.results.jsonConfigs.validConfigs || 0}

## Main Dashboard
- **Hypercube Faces**: ${this.results.mainDashboard.faceCount || 0}
- **Blog Cards**: ${this.results.mainDashboard.cardCount || 0}
- **Visualizers**: ${this.results.mainDashboard.visualizerCount || 0}
- **Navigation Bezels**: ${this.results.mainDashboard.bezelCount || 0}

---
Generated: ${this.results.timestamp}
`;

        const summaryPath = 'file_validation_summary.md';
        fs.writeFileSync(summaryPath, summary);
        
        console.log('');
        console.log('🎯 FILE VALIDATION COMPLETE');
        console.log('===========================');
        console.log(`Status: ${this.results.status}`);
        console.log(`Success Rate: ${successRate}%`);
        console.log(`Reports saved: ${reportPath}, ${summaryPath}`);
        console.log('');
        
        return this.results;
    }

    runCompleteValidation() {
        console.log('🚀 Starting VIB34D File Structure Validation...');
        console.log('');
        
        try {
            this.validateFileStructure();
            this.validateCoreModules();
            this.validateJSONConfigs();
            this.validateMainDashboard();
            
            const results = this.generateReport();
            
            if (results.successRate >= 90) {
                console.log('🏆 VIB34D system is READY FOR DEPLOYMENT!');
            } else if (results.successRate >= 70) {
                console.log('✅ VIB34D system is in GOOD shape with minor issues');
            } else {
                console.log('⚠️  VIB34D system NEEDS WORK before deployment');
            }
            
            return results;
            
        } catch (error) {
            console.error(`💥 Validation failed: ${error.message}`);
            throw error;
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new VIB34DFileValidator();
    validator.runCompleteValidation();
}

module.exports = VIB34DFileValidator;