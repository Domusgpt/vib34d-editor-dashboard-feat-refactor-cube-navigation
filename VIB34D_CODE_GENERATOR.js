/**
 * VIB34D Code Generator - Handles code export and generation
 */
class VIB34DCodeGenerator {
    constructor(editorCore) {
        this.editorCore = editorCore;
        console.log('📄 VIB34D Code Generator initialized');
    }
    
    generateCodeForElement(elementId) {
        const elementData = this.editorCore.elements.get(elementId);
        if (!elementData) return;
        
        const code = `// ${elementData.name} (${elementData.type})
const ${elementId}Config = {
    type: "${elementData.type}",
    geometry: "${elementData.geometry}",
    position: { x: ${elementData.position.x}, y: ${elementData.position.y} },
    visualizer: {
        dimension: ${elementData.properties.dimension},
        morphFactor: ${elementData.properties.morphFactor},
        gridDensity: ${elementData.properties.gridDensity},
        rotationSpeed: ${elementData.properties.rotationSpeed}
    },
    reactivity: {
        hover: ${elementData.properties.hoverIntensity},
        click: ${elementData.properties.clickResponse},
        scroll: ${elementData.properties.scrollSensitivity}
    },
    relationships: {
        type: "${elementData.relationships.type}",
        strength: ${elementData.relationships.strength}
    }
};

// Apply to element
applyVIB34DConfig('${elementId}', ${elementId}Config);`;
        
        const codeOutput = document.getElementById('code-output');
        if (codeOutput) {
            codeOutput.textContent = code;
        }
    }
    
    exportCode() {
        let fullCode = '<!DOCTYPE html>\\n<html lang="en">\\n<head>\\n';
        fullCode += '    <meta charset="UTF-8">\\n';
        fullCode += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n';
        fullCode += '    <title>VIB34D Generated Page</title>\\n';
        fullCode += '    <style>\\n';
        fullCode += '        body { margin: 0; padding: 0; background: #000; color: #fff; }\\n';
        fullCode += '        .vib34d-element { position: absolute; }\\n';
        fullCode += '        .element-visualizer { width: 100%; height: 100%; }\\n';
        fullCode += '    </style>\\n';
        fullCode += '</head>\\n<body>\\n';
        
        this.editorCore.elements.forEach((elementData) => {
            fullCode += '    <div class="vib34d-element" id="' + elementData.id + '"';
            fullCode += ' style="left: ' + elementData.position.x + 'px; top: ' + elementData.position.y + 'px;">\\n';
            fullCode += '        ' + elementData.name + '\\n';
            fullCode += '        <canvas class="element-visualizer" width="200" height="120"></canvas>\\n';
            fullCode += '    </div>\\n';
        });
        
        fullCode += '    <script src="VIB34D_WORKING_CORE_ARCHITECTURE.js"></script>\\n';
        fullCode += '    <script>\\n';
        fullCode += '        // Initialize VIB34D elements\\n';
        
        this.editorCore.elements.forEach((elementData) => {
            fullCode += '        // ' + elementData.name + '\\n';
            fullCode += '        const ' + elementData.id + 'Canvas = document.querySelector("#' + elementData.id + ' canvas");\\n';
            fullCode += '        const ' + elementData.id + 'Core = new VIB34D_WorkingCore.HypercubeCore(' + elementData.id + 'Canvas);\\n';
            fullCode += '        ' + elementData.id + 'Core.updateParameters({\\n';
            fullCode += '            geometryType: "' + elementData.geometry + '",\\n';
            fullCode += '            dimension: ' + elementData.properties.dimension + ',\\n';
            fullCode += '            morphFactor: ' + elementData.properties.morphFactor + ',\\n';
            fullCode += '            gridDensity: ' + elementData.properties.gridDensity + ',\\n';
            fullCode += '            rotationSpeed: ' + elementData.properties.rotationSpeed + '\\n';
            fullCode += '        });\\n';
            fullCode += '        ' + elementData.id + 'Core.start();\\n\\n';
        });
        
        fullCode += '    </script>\\n';
        fullCode += '</body>\\n</html>';
        
        // Replace escaped newlines with actual newlines
        fullCode = fullCode.replace(/\\n/g, '\\n');
        
        const blob = new Blob([fullCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vib34d-generated-page.html';
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📄 Code exported successfully');
    }
    
    generatePage() {
        const generatedCode = document.getElementById('code-output')?.textContent || '// No elements selected';
        const newWindow = window.open('', '_blank');
        
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>VIB34D Generated Page Preview</title>
                <style>
                    body { background: #000; color: #fff; font-family: 'Courier New', monospace; }
                    .preview-container { padding: 20px; }
                </style>
            </head>
            <body>
                <div class="preview-container">
                    <h1>🎉 VIB34D Generated Page</h1>
                    <p>This page demonstrates the reactive UI elements you've created.</p>
                    <div id="generated-elements">
                        <!-- Generated elements would appear here -->
                    </div>
                    <pre>${generatedCode}</pre>
                </div>
            </body>
            </html>
        `);
        
        console.log('🚀 Generated page preview opened');
    }
}

window.VIB34DCodeGenerator = VIB34DCodeGenerator;