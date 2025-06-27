// HYPERCUBE FACE SYSTEM - PROPER IMPLEMENTATION
// Fix the broken face system with real canvases and geometry switching

function fixHypercubeFaces() {
    console.log('🔧 FIXING HYPERCUBE FACE SYSTEM');
    
    // 1. CREATE CANVASES FOR ALL FACES
    const faces = document.querySelectorAll('.hypercube-face');
    console.log(`Found ${faces.length} faces, fixing...`);
    
    faces.forEach((face, index) => {
        const faceId = face.id || `face-${index}`;
        
        // Check if face has canvas
        let canvas = face.querySelector('canvas');
        
        if (!canvas) {
            console.log(`🎨 Creating canvas for ${faceId}`);
            
            // Create canvas for face
            canvas = document.createElement('canvas');
            canvas.id = `${faceId}-visualizer`;
            canvas.width = face.clientWidth || 800;
            canvas.height = face.clientHeight || 600;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            
            face.appendChild(canvas);
        }
        
        // 2. ASSIGN DIFFERENT GEOMETRIES TO EACH FACE
        const geometries = ['hypercube', 'tetrahedron', 'sphere', 'torus', 'klein', 'crystal'];
        const geometry = geometries[index % geometries.length];
        
        console.log(`🎯 Assigning ${geometry} to ${faceId}`);
        
        // Initialize WebGL for this face
        try {
            if (window.ReactiveHyperAVCore) {
                const core = new window.ReactiveHyperAVCore(canvas, {
                    geometry: geometry,
                    role: 'face',
                    instanceId: faceId
                });
                
                // Store reference
                if (!window.hypercubeFaces) window.hypercubeFaces = {};
                window.hypercubeFaces[faceId] = {
                    canvas: canvas,
                    core: core,
                    geometry: geometry,
                    active: index === 0
                };
                
                console.log(`✅ ${faceId} initialized with ${geometry}`);
            }
        } catch (error) {
            console.error(`❌ Failed to initialize ${faceId}:`, error.message);
        }
    });
    
    // 3. FIX FACE TRANSITIONS
    function switchToFace(faceIndex) {
        console.log(`🔄 Switching to face ${faceIndex}`);
        
        const faces = document.querySelectorAll('.hypercube-face');
        
        faces.forEach((face, index) => {
            if (index === faceIndex) {
                face.style.zIndex = '10';
                face.style.opacity = '1';
                face.classList.add('active');
                
                // Activate the visualizer
                const faceId = face.id || `face-${index}`;
                if (window.hypercubeFaces && window.hypercubeFaces[faceId]) {
                    window.hypercubeFaces[faceId].active = true;
                    console.log(`✅ Activated ${faceId} with ${window.hypercubeFaces[faceId].geometry}`);
                }
            } else {
                face.style.zIndex = '1';
                face.style.opacity = '0.3';
                face.classList.remove('active');
                
                // Deactivate
                const faceId = face.id || `face-${index}`;
                if (window.hypercubeFaces && window.hypercubeFaces[faceId]) {
                    window.hypercubeFaces[faceId].active = false;
                }
            }
        });
    }
    
    // 4. FIX KEYBOARD NAVIGATION
    window.currentFace = 0;
    document.addEventListener('keydown', (event) => {
        const faceCount = document.querySelectorAll('.hypercube-face').length;
        
        switch (event.key) {
            case 'ArrowUp':
                window.currentFace = (window.currentFace - 1 + faceCount) % faceCount;
                switchToFace(window.currentFace);
                break;
            case 'ArrowDown':
                window.currentFace = (window.currentFace + 1) % faceCount;
                switchToFace(window.currentFace);
                break;
            case 'ArrowLeft':
                window.currentFace = (window.currentFace - 1 + faceCount) % faceCount;
                switchToFace(window.currentFace);
                break;
            case 'ArrowRight':
                window.currentFace = (window.currentFace + 1) % faceCount;
                switchToFace(window.currentFace);
                break;
        }
    });
    
    // 5. START RENDER LOOP FOR ALL FACES
    function renderAllFaces() {
        if (window.hypercubeFaces) {
            Object.values(window.hypercubeFaces).forEach(face => {
                if (face.core && face.active) {
                    try {
                        face.core.render();
                    } catch (error) {
                        console.error(`Render error for ${face.geometry}:`, error.message);
                    }
                }
            });
        }
        requestAnimationFrame(renderAllFaces);
    }
    
    // Start the system
    switchToFace(0);
    renderAllFaces();
    
    console.log('🎉 Hypercube face system fixed!');
    console.log('Use arrow keys to switch between faces');
    console.log('Available faces:', Object.keys(window.hypercubeFaces || {}));
}

// Export for console use
window.fixHypercubeFaces = fixHypercubeFaces;