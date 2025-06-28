/**
 * VIB34D Property Manager - Handles property updates and relationships
 */
class VIB34DPropertyManager {
    constructor(editorCore) {
        this.editorCore = editorCore;
        console.log('🎛️ VIB34D Property Manager initialized');
    }
    
    updatePropertiesPanel(elementId) {
        const elementData = this.editorCore.elements.get(elementId);
        if (!elementData) return;
        
        // Update basic properties
        const propsPanel = document.getElementById('element-properties');
        if (propsPanel) {
            propsPanel.innerHTML = `
                <div class="property-group">
                    <label class="property-label">Element Type</label>
                    <input type="text" class="property-input" value="${elementData.type}" readonly>
                </div>
                <div class="property-group">
                    <label class="property-label">Element Name</label>
                    <input type="text" class="property-input" value="${elementData.name}" 
                           onchange="window.vib34dPropertyManager.updateElementName('${elementId}', this.value)">
                </div>
                <div class="property-group">
                    <label class="property-label">Position X</label>
                    <input type="number" class="property-input" value="${elementData.position.x}" 
                           onchange="window.vib34dPropertyManager.updateElementPosition('${elementId}', 'x', this.value)">
                </div>
                <div class="property-group">
                    <label class="property-label">Position Y</label>
                    <input type="number" class="property-input" value="${elementData.position.y}" 
                           onchange="window.vib34dPropertyManager.updateElementPosition('${elementId}', 'y', this.value)">
                </div>
            `;
        }
        
        // Update visualizer settings
        this.updateSliderValues(elementData);
        
        // Update relationships
        this.updateRelationshipControls(elementData);
        
        // Update geometry selector
        this.updateGeometrySelector(elementData.geometry);
    }
    
    updateSliderValues(elementData) {
        const sliderMap = {
            'dimension-slider': elementData.properties.dimension,
            'morph-slider': elementData.properties.morphFactor,
            'grid-slider': elementData.properties.gridDensity,
            'rotation-slider': elementData.properties.rotationSpeed
        };
        
        const valueMap = {
            'dimension-value': elementData.properties.dimension.toFixed(1),
            'morph-value': elementData.properties.morphFactor.toFixed(2),
            'grid-value': elementData.properties.gridDensity.toFixed(1),
            'rotation-value': elementData.properties.rotationSpeed.toFixed(2)
        };
        
        Object.entries(sliderMap).forEach(([sliderId, value]) => {
            const slider = document.getElementById(sliderId);
            if (slider) slider.value = value;
        });
        
        Object.entries(valueMap).forEach(([valueId, text]) => {
            const valueEl = document.getElementById(valueId);
            if (valueEl) valueEl.textContent = text;
        });
    }
    
    updateRelationshipControls(elementData) {
        const relationshipType = document.getElementById('relationship-type');
        const relationshipStrength = document.getElementById('relationship-strength');
        const relationshipStrengthValue = document.getElementById('relationship-strength-value');
        
        if (relationshipType) relationshipType.value = elementData.relationships.type;
        if (relationshipStrength) relationshipStrength.value = elementData.relationships.strength;
        if (relationshipStrengthValue) relationshipStrengthValue.textContent = elementData.relationships.strength.toFixed(1);
    }
    
    updateGeometrySelector(geometry) {
        document.querySelectorAll('.geometry-option').forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.geometry === geometry) {
                option.classList.add('selected');
            }
        });
    }
    
    updateElementProperty(property, value) {
        const elementData = this.editorCore.elements.get(this.editorCore.selectedElement);
        if (!elementData) return;
        
        const propertyMap = {
            'dimension': 'dimension',
            'morph': 'morphFactor',
            'grid': 'gridDensity',
            'rotation': 'rotationSpeed'
        };
        
        const actualProperty = propertyMap[property];
        elementData.properties[actualProperty] = value;
        
        // Update visualizer
        this.updateVisualizer(elementData, actualProperty, value);
        
        // Update relationships
        this.updateRelatedElements(this.editorCore.selectedElement, actualProperty, value);
        
        window.vib34dCodeGenerator?.generateCodeForElement(this.editorCore.selectedElement);
    }
    
    updateVisualizer(elementData, property, value) {
        if (!elementData.visualizer) return;
        
        try {
            if (elementData.visualizer.updateParameters) {
                const updateObj = {};
                updateObj[property] = value;
                elementData.visualizer.updateParameters(updateObj);
            }
        } catch (error) {
            console.warn(`Failed to update visualizer property ${property}:`, error);
        }
    }
    
    updateRelatedElements(sourceId, property, value) {
        const sourceElement = this.editorCore.elements.get(sourceId);
        if (!sourceElement || sourceElement.relationships.type === 'none') return;
        
        this.editorCore.elements.forEach((targetElement, targetId) => {
            if (targetId === sourceId) return;
            
            switch (sourceElement.relationships.type) {
                case 'sync':
                    this.applyRelationshipEffect(targetElement, property, value, sourceElement.relationships.strength);
                    break;
                    
                case 'inverse':
                    const maxValue = this.getPropertyMax(property);
                    const inverseValue = maxValue - value;
                    this.applyRelationshipEffect(targetElement, property, inverseValue, sourceElement.relationships.strength);
                    break;
                    
                case 'cascade':
                    const distance = this.calculateDistance(sourceElement, targetElement);
                    const cascadeStrength = sourceElement.relationships.strength * (1 / (1 + distance * 0.01));
                    const cascadeValue = value * cascadeStrength;
                    this.applyRelationshipEffect(targetElement, property, cascadeValue, 1);
                    break;
                    
                case 'amplify':
                    const currentValue = targetElement.properties[property] || 0;
                    const amplifiedValue = currentValue * (1 + sourceElement.relationships.strength * 0.5);
                    this.applyRelationshipEffect(targetElement, property, amplifiedValue, 1);
                    break;
            }
        });
    }
    
    applyRelationshipEffect(targetElement, property, value, strength) {
        const effectValue = targetElement.properties[property] + (value - targetElement.properties[property]) * strength;
        targetElement.properties[property] = Math.max(0, effectValue);
        
        if (targetElement.visualizer) {
            this.updateVisualizer(targetElement, property, effectValue);
        }
    }
    
    calculateDistance(elem1, elem2) {
        const dx = elem1.position.x - elem2.position.x;
        const dy = elem1.position.y - elem2.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    getPropertyMax(property) {
        const maxValues = {
            dimension: 5.0,
            morphFactor: 1.5,
            gridDensity: 25.0,
            rotationSpeed: 3.0
        };
        return maxValues[property] || 1.0;
    }
    
    updateElementName(elementId, newName) {
        const elementData = this.editorCore.elements.get(elementId);
        if (!elementData) return;
        
        elementData.name = newName;
        
        const element = document.getElementById(elementId);
        if (element) {
            const nameDiv = element.querySelector('div:first-child');
            if (nameDiv) nameDiv.textContent = newName;
        }
        
        window.vib34dCodeGenerator?.generateCodeForElement(elementId);
    }
    
    updateElementPosition(elementId, axis, value) {
        const elementData = this.editorCore.elements.get(elementId);
        if (!elementData) return;
        
        const numValue = parseFloat(value);
        elementData.position[axis] = Math.max(0, numValue);
        
        const element = document.getElementById(elementId);
        if (element) {
            element.style[axis === 'x' ? 'left' : 'top'] = `${elementData.position[axis]}px`;
        }
        
        window.vib34dCodeGenerator?.generateCodeForElement(elementId);
    }
}

window.VIB34DPropertyManager = VIB34DPropertyManager;