/**
 * VIB34D Editor Core - Modular Dashboard System
 */
class VIB34DEditorCore {
    constructor() {
        this.elements = new Map();
        this.selectedElement = null;
        this.nextElementId = 1;
        this.relationships = new Map();
        this.isPreviewMode = false;
        
        console.log('🎨 VIB34D Editor Core initializing...');
    }
    
    initialize() {
        this.setupDragAndDrop();
        this.setupPropertyControls();
        this.setupCanvasInteraction();
        console.log('✅ VIB34D Editor Core ready');
    }
    
    setupDragAndDrop() {
        // Setup drag from element library
        const elementItems = document.querySelectorAll('.element-item');
        elementItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: item.dataset.type,
                    geometry: item.dataset.geometry,
                    name: item.querySelector('.element-name').textContent
                }));
            });
        });
        
        // Setup drop on canvas
        const canvas = document.getElementById('canvas-workspace');
        const canvasContent = document.getElementById('canvas-content');
        
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvas.classList.add('drag-over');
        });
        
        canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
        });
        
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.classList.remove('drag-over');
            
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const rect = canvasContent.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (data.action === 'move') {
                    this.moveElement(data.elementId, x - data.offsetX, y - data.offsetY);
                } else {
                    this.createElement(data, x, y);
                }
            } catch (error) {
                console.error('Drop error:', error);
            }
        });
    }
    
    createElement(data, x, y) {
        const elementId = `element-${this.nextElementId++}`;
        
        // Create DOM element
        const element = document.createElement('div');
        element.className = 'dropped-element';
        element.id = elementId;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.innerHTML = `
            <div>${data.name}</div>
            <div style="font-size: 10px; color: #888;">${data.geometry}</div>
        `;
        
        // Add visualizer canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'element-visualizer';
        canvas.width = 200;
        canvas.height = 120;
        element.appendChild(canvas);
        
        // Make draggable
        this.makeDraggable(element, elementId);
        
        // Make selectable
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(elementId);
        });
        
        document.getElementById('canvas-content').appendChild(element);
        
        // Create element data
        const elementData = {
            id: elementId,
            type: data.type,
            geometry: data.geometry,
            name: data.name,
            position: { x, y },
            visualizer: null,
            properties: {
                dimension: 4.0,
                morphFactor: 0.7,
                gridDensity: 8.0,
                rotationSpeed: 0.5,
                hoverIntensity: 1.0,
                clickResponse: 1.2,
                scrollSensitivity: 0.8
            },
            relationships: {
                type: 'none',
                strength: 0.5,
                targets: []
            }
        };
        
        this.elements.set(elementId, elementData);
        
        // Initialize visualizer
        this.initializeVisualizer(elementData, canvas);
        
        // Auto-select new element
        this.selectElement(elementId);
        
        console.log(`✅ Created ${data.type} element with ${data.geometry} geometry`);
    }
    
    makeDraggable(element, elementId) {
        element.draggable = true;
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify({
                action: 'move',
                elementId: elementId,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            }));
            element.style.opacity = '0.5';
            element.style.zIndex = '1000';
        });
        
        element.addEventListener('dragend', (e) => {
            element.style.opacity = '1';
            element.style.zIndex = '';
        });
    }
    
    moveElement(elementId, x, y) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        elementData.position.x = Math.max(0, x);
        elementData.position.y = Math.max(0, y);
        
        const element = document.getElementById(elementId);
        if (element) {
            element.style.left = `${elementData.position.x}px`;
            element.style.top = `${elementData.position.y}px`;
        }
        
        if (this.selectedElement === elementId) {
            window.vib34dPropertyManager?.updatePropertiesPanel(elementId);
        }
        
        console.log(`📍 Moved ${elementId} to (${elementData.position.x}, ${elementData.position.y})`);
    }
    
    selectElement(elementId) {
        if (this.selectedElement) {
            document.getElementById(this.selectedElement)?.classList.remove('selected');
        }
        
        this.selectedElement = elementId;
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('selected');
            window.vib34dPropertyManager?.updatePropertiesPanel(elementId);
            window.vib34dCodeGenerator?.generateCodeForElement(elementId);
        }
    }
    
    initializeVisualizer(elementData, canvas) {
        try {
            // Simple working visualizer initialization
            if (window.VIB34D_WorkingCore?.HypercubeCore) {
                const core = new window.VIB34D_WorkingCore.HypercubeCore(canvas);
                core.updateParameters({
                    geometryType: elementData.geometry,
                    dimension: elementData.properties.dimension,
                    morphFactor: elementData.properties.morphFactor,
                    gridDensity: elementData.properties.gridDensity,
                    rotationSpeed: elementData.properties.rotationSpeed
                });
                core.start();
                elementData.visualizer = core;
                document.getElementById(elementData.id).classList.add('has-visualizer');
                console.log(`✅ Visualizer created for ${elementData.id}`);
            } else {
                // Fallback placeholder
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#333';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#00ffff';
                ctx.font = '12px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(elementData.geometry, canvas.width/2, canvas.height/2);
            }
        } catch (error) {
            console.warn(`Failed to initialize visualizer for ${elementData.id}:`, error);
        }
    }
    
    setupPropertyControls() {
        // Basic property slider setup
        const sliders = ['dimension', 'morph', 'grid', 'rotation'];
        sliders.forEach(slider => {
            const sliderElement = document.getElementById(`${slider}-slider`);
            const valueElement = document.getElementById(`${slider}-value`);
            
            if (sliderElement) {
                sliderElement.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    const decimals = slider === 'grid' ? 1 : 2;
                    if (valueElement) valueElement.textContent = value.toFixed(decimals);
                    
                    if (this.selectedElement) {
                        window.vib34dPropertyManager?.updateElementProperty(slider, value);
                    }
                });
            }
        });
    }
    
    setupCanvasInteraction() {
        document.getElementById('canvas-content')?.addEventListener('click', (e) => {
            if (e.target.id === 'canvas-content') {
                this.deselectAll();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (this.selectedElement) {
                    e.preventDefault();
                    this.deleteSelectedElement();
                }
            }
            if (e.key === 'Escape') {
                this.deselectAll();
            }
        });
    }
    
    deselectAll() {
        if (this.selectedElement) {
            document.getElementById(this.selectedElement)?.classList.remove('selected');
            this.selectedElement = null;
        }
    }
    
    deleteSelectedElement() {
        if (!this.selectedElement) return;
        
        if (confirm(`Delete element ${this.selectedElement}?`)) {
            const elementId = this.selectedElement;
            this.deselectAll();
            
            // Remove DOM element
            const element = document.getElementById(elementId);
            if (element) element.remove();
            
            // Clean up data
            this.elements.delete(elementId);
            
            console.log(`🗑️ Deleted element: ${elementId}`);
        }
    }
}

// Export to global scope
window.VIB34DEditorCore = VIB34DEditorCore;