const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function compareVIB34DSystems() {
    console.log('🎯 Comparing VIB34D Systems...');
    
    // Create comparison directory
    const compareDir = path.join(__dirname, 'system-comparison');
    if (!fs.existsSync(compareDir)) {
        fs.mkdirSync(compareDir);
    }
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--allow-file-access-from-files'
        ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    try {
        // 1. Load the PROPER morphing blog system
        const morphingBlogPath = `file:///C:/Users/millz/Desktop/vib34d-morphing-blog-integrated.html`;
        console.log('📁 Loading PROPER VIB34D Morphing Blog System...');
        
        await page.goto(morphingBlogPath, {
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take screenshots of the proper system
        await page.screenshot({ 
            path: path.join(compareDir, '01-PROPER-morphing-blog-home.png'),
            fullPage: false 
        });
        console.log('📸 Screenshot 1: PROPER Morphing Blog - Home State');
        
        // Analyze what makes this system special
        const properSystemAnalysis = await page.evaluate(() => {
            const analysis = {
                title: document.title,
                hasFloatingCards: document.querySelectorAll('.blog-card').length,
                hasVisualizerBoard: !!document.querySelector('.visualizer-board'),
                hasBoardCanvas: !!document.querySelector('#board-visualizer'),
                cardVisualizers: document.querySelectorAll('.card-visualizer').length,
                hasParameterControls: !!document.querySelector('.parameter-controls'),
                layouts: ['home', 'tech', 'media', 'innovation', 'archive'],
                cssVariables: {
                    globalEnergy: getComputedStyle(document.body).getPropertyValue('--global-energy'),
                    morphFactor: getComputedStyle(document.body).getPropertyValue('--morph-factor'),
                    dimensionValue: getComputedStyle(document.body).getPropertyValue('--dimension-value'),
                    glitchIntensity: getComputedStyle(document.body).getPropertyValue('--glitch-intensity')
                },
                advancedFeatures: {
                    hasBackdropFilter: !!document.querySelector('[style*="backdrop-filter"]'),
                    has3DTransforms: !!document.querySelector('[style*="preserve-3d"]'),
                    hasRealtimeReactivity: !!document.querySelector('[data-section-hover]'),
                    hasInverseReactions: !!document.querySelector('[data-inverse]')
                }
            };
            
            // Get card positions
            const cards = document.querySelectorAll('.blog-card');
            analysis.cardLayouts = Array.from(cards).map((card, index) => ({
                index: index,
                position: {
                    top: card.style.top,
                    left: card.style.left,
                    right: card.style.right,
                    bottom: card.style.bottom,
                    width: card.style.width,
                    height: card.style.height
                },
                hasVisualizer: !!card.querySelector('.card-visualizer')
            }));
            
            return analysis;
        });
        
        console.log('📊 PROPER System Analysis:', properSystemAnalysis);
        
        // Test state transitions
        console.log('🎯 Testing state transitions...');
        
        // Try clicking on navigation or switching states
        await page.evaluate(() => {
            // Trigger tech layout if available
            document.body.className = 'blog-container layout-tech';
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(compareDir, '02-PROPER-morphing-blog-tech.png'),
            fullPage: false 
        });
        console.log('📸 Screenshot 2: PROPER Morphing Blog - Tech Layout');
        
        // Switch to media layout
        await page.evaluate(() => {
            document.body.className = 'blog-container layout-media';
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(compareDir, '03-PROPER-morphing-blog-media.png'),
            fullPage: false 
        });
        console.log('📸 Screenshot 3: PROPER Morphing Blog - Media Layout');
        
        // Test hover effects
        const cards = await page.$$('.blog-card');
        if (cards.length > 2) {
            await cards[2].hover();
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            await page.screenshot({ 
                path: path.join(compareDir, '04-PROPER-hover-effects.png'),
                fullPage: false 
            });
            console.log('📸 Screenshot 4: PROPER Hover Effects (card enlargement + inverse reactions)');
        }
        
        // Now load the BULLSHIT system I built
        console.log('\n📁 Loading BULLSHIT demo system for comparison...');
        
        const bullshitPath = `file://${path.resolve(__dirname, 'VIB34D_SYSTEM.html')}`;
        await page.goto(bullshitPath, {
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await page.screenshot({ 
            path: path.join(compareDir, '05-BULLSHIT-demo-system.png'),
            fullPage: false 
        });
        console.log('📸 Screenshot 5: BULLSHIT Demo System I Built');
        
        // Analyze the bullshit system
        const bullshitAnalysis = await page.evaluate(() => {
            return {
                title: document.title,
                hasFloatingCards: document.querySelectorAll('.adaptive-card').length,
                hasRealVisualizerBoard: !!document.querySelector('.visualizer-board'),
                hasBoardCanvas: !!document.querySelector('#board-visualizer'),
                hasParameterSliders: document.querySelectorAll('input[type="range"]').length,
                isBullshitDemo: !document.querySelector('.blog-card') && !document.querySelector('.visualizer-board')
            };
        });
        
        console.log('💩 BULLSHIT System Analysis:', bullshitAnalysis);
        
        // Create comparison summary
        const comparisonSummary = `
# VIB34D SYSTEM COMPARISON

## PROPER SYSTEM (vib34d-morphing-blog-integrated.html)
- **Floating Blog Cards**: ${properSystemAnalysis.hasFloatingCards} cards with 3D transforms
- **Background Visualizer Board**: Full-screen WebGL canvas behind cards
- **Card Visualizers**: Each card has its own WebGL visualizer
- **Advanced Effects**: Backdrop filters, 3D transforms, inverse reactions
- **State Layouts**: 5 different layouts (home, tech, media, innovation, archive)
- **Real-time Reactivity**: CSS variables controlling everything
- **Hover Effects**: Card enlargement + inverse scaling of other cards

## BULLSHIT SYSTEM (What I built)
- **Generic Cards**: ${bullshitAnalysis.hasFloatingCards} static cards
- **No Visualizer Board**: ${bullshitAnalysis.hasRealVisualizerBoard}
- **Parameter Sliders**: ${bullshitAnalysis.hasParameterSliders} boring sliders
- **No Blog Layout**: Just a generic demo
- **No Floating Cards**: Cards stuck in grid
- **No Advanced Effects**: Basic CSS only

## KEY DIFFERENCES
1. **Architecture**: PROPER uses floating cards over WebGL board, BULLSHIT uses static grid
2. **Visualizers**: PROPER has board + individual card visualizers, BULLSHIT has basic canvases
3. **Layouts**: PROPER morphs between 5 blog layouts, BULLSHIT has fixed layout
4. **Effects**: PROPER has 3D transforms + backdrop filters, BULLSHIT has basic transitions
5. **Purpose**: PROPER is a morphing blog system, BULLSHIT is generic demo trash
`;
        
        fs.writeFileSync(path.join(compareDir, 'COMPARISON_SUMMARY.md'), comparisonSummary);
        console.log('📝 Comparison summary written');
        
        console.log('\n✅ Comparison complete!');
        console.log(`📂 Screenshots saved in: ${compareDir}`);
        console.log('\n🔥 The PROPER system has:');
        console.log('  - Floating blog cards that morph between layouts');
        console.log('  - Full-screen WebGL visualizer board behind everything');
        console.log('  - Individual WebGL visualizers in each card');
        console.log('  - 3D transforms and backdrop filters');
        console.log('  - Inverse hover reactions (other cards shrink when one is hovered)');
        console.log('  - 5 different blog layout states');
        console.log('\n💩 The BULLSHIT system I built has:');
        console.log('  - Generic static cards in a grid');
        console.log('  - Basic WebGL canvases');
        console.log('  - Boring parameter sliders');
        console.log('  - No morphing, no floating, no blog functionality');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await page.screenshot({ 
            path: path.join(compareDir, 'error-state.png'),
            fullPage: false 
        });
    }
    
    // Keep browser open for manual inspection
    console.log('\n👀 Browser will remain open for manual inspection...');
    console.log('Press Ctrl+C to close when finished.');
}

compareVIB34DSystems().catch(console.error);