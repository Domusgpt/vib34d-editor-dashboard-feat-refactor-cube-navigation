class JsonConfigSystem {
    constructor() {
        this.configs = {
            layout: null,
            visuals: null,
            behavior: null,
            stateMap: null
        };
        this.eventBus = new EventTarget();
        this.configFiles = {
            layout: 'layout-content.json',
            visuals: 'visuals.json',
            behavior: 'behavior.json',
            stateMap: 'state-map.json'
        };
    }

    async loadAllConfigs() {
        try {
            const loadPromises = Object.entries(this.configFiles).map(([key, filename]) => 
                this.loadConfig(key, filename)
            );
            
            await Promise.all(loadPromises);
            
            this.eventBus.dispatchEvent(new CustomEvent('configLoaded', {
                detail: { ...this.configs }
            }));
            
            return this.configs;
        } catch (error) {
            console.error('Failed to load configs:', error);
            throw error;
        }
    }

    async loadConfig(configType, filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filename}: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!this.validateConfig(configType, data)) {
                throw new Error(`Invalid configuration format for ${configType}`);
            }
            
            this.configs[configType] = data;
            
            this.eventBus.dispatchEvent(new CustomEvent(`${configType}ConfigLoaded`, {
                detail: data
            }));
            
            return data;
        } catch (error) {
            console.error(`Error loading ${configType} config:`, error);
            throw error;
        }
    }

    validateConfig(configType, data) {
        if (!data || typeof data !== 'object') return false;
        
        switch (configType) {
            case 'layout':
                return data.layout && data.components && data.cards;
            case 'visuals':
                return data.themes && data.geometries && data.parameters;
            case 'behavior':
                return data.interactionBlueprints;
            case 'stateMap':
                return data.states && data.initialState;
            default:
                return false;
        }
    }

    getConfig(configType) {
        return this.configs[configType];
    }

    getConfigValue(configType, path) {
        const config = this.configs[configType];
        if (!config) return null;
        
        const keys = path.split('.');
        let value = config;
        
        for (const key of keys) {
            if (value === null || value === undefined) return null;
            value = value[key];
        }
        
        return value;
    }

    async updateConfig(configType, newData) {
        if (!this.validateConfig(configType, newData)) {
            throw new Error(`Invalid configuration format for ${configType}`);
        }
        
        this.configs[configType] = newData;
        
        this.eventBus.dispatchEvent(new CustomEvent(`${configType}ConfigUpdated`, {
            detail: newData
        }));
        
        return newData;
    }

    addEventListener(eventType, listener) {
        this.eventBus.addEventListener(eventType, listener);
    }

    removeEventListener(eventType, listener) {
        this.eventBus.removeEventListener(eventType, listener);
    }
}

window.JsonConfigSystem = JsonConfigSystem;