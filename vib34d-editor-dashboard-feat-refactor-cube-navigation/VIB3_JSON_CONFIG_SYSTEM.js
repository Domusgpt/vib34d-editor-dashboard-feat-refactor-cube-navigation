/**
 * VIB3 JSON Configuration System
 * 
 * Loads and manages all JSON configurations for content, behavior, and visuals
 * Provides agent-friendly API for real-time modifications
 * Enables dashboard editor integration
 */

class VIB3JsonConfigSystem {
    constructor() {
        this.configs = {
            content: null,
            behavior: null,
            visuals: null
        };
        
        this.configPath = './config/';
        this.isLoaded = false;
        this.subscribers = new Map();
        this.agentAPI = null;
        
        console.log('📄 VIB3 JSON Configuration System initializing...');
    }
    
    /**
     * Load all configuration files
     */
    async loadAllConfigs() {
        try {
            console.log('📂 Loading JSON configurations...');
            
            // Load all config files in parallel
            const [contentConfig, behaviorConfig, visualsConfig] = await Promise.all([
                this.loadConfigFile('content.json'),
                this.loadConfigFile('behavior.json'),
                this.loadConfigFile('visuals.json')
            ]);
            
            this.configs.content = contentConfig;
            this.configs.behavior = behaviorConfig;
            this.configs.visuals = visualsConfig;
            
            this.isLoaded = true;
            this.initializeAgentAPI();
            this.notifySubscribers('configsLoaded', this.configs);
            
            console.log('✅ All JSON configurations loaded successfully');
            console.log('📊 Configuration summary:', {
                sections: Object.keys(this.configs.content.sections).length,
                themes: Object.keys(this.configs.visuals.themes).length,
                presets: Object.keys(this.configs.behavior.presets).length
            });
            
            return this.configs;
            
        } catch (error) {
            console.error('❌ Failed to load configurations:', error);
            throw error;
        }
    }
    
    /**
     * Load individual config file
     */
    async loadConfigFile(filename) {
        try {
            const response = await fetch(`${this.configPath}${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status}`);
            }
            
            const config = await response.json();
            console.log(`✅ Loaded ${filename}`);
            return config;
            
        } catch (error) {
            console.error(`❌ Error loading ${filename}:`, error);
            
            // Return default config if file fails to load
            return this.getDefaultConfig(filename);
        }
    }
    
    /**
     * Get default configuration if JSON file fails to load
     */
    getDefaultConfig(filename) {
        const defaults = {
            'content.json': {
                sections: {
                    "0": {
                        name: "HOME",
                        theme: "hypercube",
                        cards: [
                            {
                                id: "default-card",
                                title: "Default Configuration",
                                content: "JSON configuration failed to load. Using defaults.",
                                reactivity: {
                                    parameterChanges: {
                                        dimension: 3.5,
                                        morphFactor: 0.5,
                                        gridDensity: 12.0
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            
            'behavior.json': {
                interactions: {
                    cardHover: { enabled: true },
                    sectionTransition: { enabled: true, duration: 800 }
                },
                presets: {
                    reset: {
                        parameters: {
                            dimension: 3.5,
                            morphFactor: 0.5,
                            gridDensity: 12.0
                        }
                    }
                }
            },
            
            'visuals.json': {
                themes: {
                    hypercube: {
                        baseColor: [1.0, 0.0, 1.0],
                        parameters: {
                            dimension: 3.5,
                            morphFactor: 0.5,
                            gridDensity: 12.0
                        }
                    }
                }
            }
        };
        
        console.log(`🔄 Using default configuration for ${filename}`);
        return defaults[filename] || {};
    }
    
    /**
     * Get configuration value by path
     */
    getConfig(configType, path) {
        if (!this.isLoaded) {
            console.warn('Configurations not yet loaded');
            return null;
        }
        
        const config = this.configs[configType];
        if (!config) return null;
        
        // Support dot notation path (e.g., "sections.0.cards")
        const pathParts = path.split('.');
        let value = config;
        
        for (const part of pathParts) {
            if (value === null || value === undefined) return null;
            value = value[part];
        }
        
        return value;
    }
    
    /**
     * Update configuration value (agent-friendly)
     */
    async updateConfig(configType, path, value, source = 'api') {
        if (!this.isLoaded) {
            throw new Error('Configurations not yet loaded');
        }
        
        console.log(`📝 Updating ${configType}.${path} from ${source}:`, value);
        
        // Validate the update
        if (!this.validateConfigUpdate(configType, path, value)) {
            throw new Error(`Invalid configuration update: ${configType}.${path}`);
        }
        
        // Apply the update
        const config = this.configs[configType];
        const pathParts = path.split('.');
        let target = config;
        
        // Navigate to parent object
        for (let i = 0; i < pathParts.length - 1; i++) {
            if (!target[pathParts[i]]) {
                target[pathParts[i]] = {};
            }
            target = target[pathParts[i]];
        }
        
        // Set the value
        const lastPart = pathParts[pathParts.length - 1];
        const oldValue = target[lastPart];
        target[lastPart] = value;
        
        // Update metadata
        this.configs[configType].lastModified = new Date().toISOString();
        this.configs[configType].modifiedBy = source;
        
        // Notify subscribers
        this.notifySubscribers('configUpdated', {
            configType,
            path,
            newValue: value,
            oldValue,
            source
        });
        
        console.log(`✅ Configuration updated: ${configType}.${path}`);
        return true;
    }
    
    /**
     * Validate configuration updates
     */
    validateConfigUpdate(configType, path, value) {
        // Parameter range validation for behavior configs
        if (configType === 'behavior' && path.includes('parameters')) {
            const paramName = path.split('.').pop();
            const ranges = this.configs.behavior?.agentAPI?.validation?.parameterRanges;
            
            if (ranges && ranges[paramName]) {
                const range = ranges[paramName];
                if (value < range.min || value > range.max) {
                    console.error(`Parameter ${paramName} out of range: ${value} (${range.min}-${range.max})`);
                    return false;
                }
            }
        }
        
        // Color validation for visual configs
        if (configType === 'visuals' && path.includes('Color')) {
            if (Array.isArray(value) && value.length === 3) {
                const isValidColor = value.every(c => c >= 0.0 && c <= 1.0);
                if (!isValidColor) {
                    console.error(`Invalid color values: ${value}`);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Apply preset configuration
     */
    async applyPreset(presetName, source = 'api') {
        const preset = this.getConfig('behavior', `presets.${presetName}`);
        if (!preset) {
            throw new Error(`Preset not found: ${presetName}`);
        }
        
        console.log(`🎨 Applying preset: ${presetName}`);
        
        // Apply parameters if present
        if (preset.parameters) {
            await this.updateConfig('behavior', 'currentParameters', preset.parameters, source);
        }
        
        // Apply section if present
        if (preset.section !== undefined) {
            await this.updateConfig('content', 'currentSection', preset.section, source);
        }
        
        // Apply theme if present
        if (preset.theme) {
            await this.updateConfig('visuals', 'currentTheme', preset.theme, source);
        }
        
        this.notifySubscribers('presetApplied', { presetName, preset, source });
        return preset;
    }
    
    /**
     * Get current system state for dashboard
     */
    getSystemState() {
        if (!this.isLoaded) return null;
        
        return {
            version: this.configs.content?.version || '1.0.0',
            lastModified: Math.max(
                new Date(this.configs.content?.lastModified || 0),
                new Date(this.configs.behavior?.lastModified || 0),
                new Date(this.configs.visuals?.lastModified || 0)
            ),
            currentSection: this.getConfig('content', 'currentSection') || 0,
            currentTheme: this.getConfig('visuals', 'currentTheme') || 'hypercube',
            availablePresets: Object.keys(this.configs.behavior?.presets || {}),
            availableThemes: Object.keys(this.configs.visuals?.themes || {}),
            systemHealth: {
                configsLoaded: this.isLoaded,
                agentAPIEnabled: !!this.agentAPI,
                subscriberCount: this.subscribers.size
            }
        };
    }
    
    /**
     * Subscribe to configuration changes
     */
    subscribe(eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, new Set());
        }
        
        this.subscribers.get(eventType).add(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(eventType);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }
    
    /**
     * Notify subscribers of changes
     */
    notifySubscribers(eventType, data) {
        const callbacks = this.subscribers.get(eventType);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in subscriber callback for ${eventType}:`, error);
                }
            });
        }
    }
    
    /**
     * Initialize Agent API endpoints
     */
    initializeAgentAPI() {
        this.agentAPI = {
            // Update any configuration value
            updateConfig: (configType, path, value) => {
                return this.updateConfig(configType, path, value, 'agent');
            },
            
            // Apply preset
            applyPreset: (presetName) => {
                return this.applyPreset(presetName, 'agent');
            },
            
            // Get configuration value
            getConfig: (configType, path) => {
                return this.getConfig(configType, path);
            },
            
            // Get system state
            getSystemState: () => {
                return this.getSystemState();
            },
            
            // Bulk update (for dashboard editor)
            bulkUpdate: async (updates) => {
                const results = [];
                for (const update of updates) {
                    try {
                        await this.updateConfig(update.configType, update.path, update.value, 'bulk');
                        results.push({ success: true, update });
                    } catch (error) {
                        results.push({ success: false, update, error: error.message });
                    }
                }
                return results;
            },
            
            // Export current configuration
            exportConfig: () => {
                return {
                    content: this.configs.content,
                    behavior: this.configs.behavior,
                    visuals: this.configs.visuals,
                    exported: new Date().toISOString()
                };
            },
            
            // Validate configuration
            validateConfig: (configType, path, value) => {
                return this.validateConfigUpdate(configType, path, value);
            }
        };
        
        // Make agent API globally accessible
        window.agentAPI = this.agentAPI;
        
        console.log('🤖 Agent API initialized and available globally');
        console.log('📋 Available agent methods:', Object.keys(this.agentAPI));
    }
    
    /**
     * Hot reload configuration files (for development)
     */
    async hotReload(configType = null) {
        console.log('🔄 Hot reloading configurations...');
        
        if (configType) {
            // Reload specific config
            const filename = `${configType}.json`;
            this.configs[configType] = await this.loadConfigFile(filename);
            this.notifySubscribers('configReloaded', { configType });
        } else {
            // Reload all configs
            await this.loadAllConfigs();
        }
        
        console.log('✅ Hot reload complete');
    }
}

// Global configuration system instance
window.VIB3JsonConfigSystem = VIB3JsonConfigSystem;

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
    console.log('📄 VIB3 JSON Configuration System ready for initialization');
}