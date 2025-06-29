const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function visualVerify() {
    console.log('🎯 Starting Visual Verification...');
    
    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'visual-proof');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }
    
    const browser = await puppeteer.launch({
        headless: true, // Run headless for faster screenshots
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
        // Load local file
        const localPath = `file://${path.resolve(__dirname, 'index.html')}`;
        console.log('📁 Loading VIB34D System...');
        
        await page.goto(localPath, {
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        
        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 1. Initial state screenshot
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-initial-home-state.png'),
            fullPage: true 
        });
        console.log('📸 Screenshot 1: Initial home state');
        
        // 2. Navigate to tech state
        await page.evaluate(() => {
            if (window.agentAPI) {
                window.agentAPI.navigateTo('tech');
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '02-tech-state.png'),
            fullPage: true 
        });
        console.log('📸 Screenshot 2: Tech state (quantum_flux theme)');
        
        // 3. Navigate to media state
        await page.evaluate(() => {
            if (window.agentAPI) {
                window.agentAPI.navigateTo('media');
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '03-media-state.png'),
            fullPage: true 
        });
        console.log('📸 Screenshot 3: Media state (neural_matrix theme)');
        
        // 4. Update parameters for visual change
        await page.evaluate(() => {
            if (window.agentAPI) {
                window.agentAPI.setParameters({
                    'u_patternIntensity': 3.0,
                    'u_dimension': 6.0,
                    'u_rotationSpeed': 2.0,
                    'u_colorShift': 0.8
                });
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '04-enhanced-parameters.png'),
            fullPage: true 
        });
        console.log('📸 Screenshot 4: Enhanced visual parameters');
        
        // 5. Navigate to innovation state
        await page.evaluate(() => {
            if (window.agentAPI) {
                window.agentAPI.navigateTo('innovation');
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '05-innovation-state.png'),
            fullPage: true 
        });
        console.log('📸 Screenshot 5: Innovation state (dark_matter theme)');
        
        // 6. Test hover effect simulation
        const cards = await page.$$('.adaptive-card');
        if (cards.length > 0) {
            // Get card position
            const box = await cards[0].boundingBox();
            if (box) {
                // Move mouse to card center
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                await page.screenshot({ 
                    path: path.join(screenshotDir, '06-card-hover-effect.png'),
                    fullPage: true 
                });
                console.log('📸 Screenshot 6: Card hover effect');
            }
        }
        
        // 7. Navigate to context state
        await page.evaluate(() => {
            if (window.agentAPI) {
                window.agentAPI.navigateTo('context');
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '07-context-state.png'),
            fullPage: true 
        });
        console.log('📸 Screenshot 7: Context state');
        
        // 8. Close-up of single card with WebGL
        const firstCard = await page.$('.adaptive-card');
        if (firstCard) {
            await firstCard.screenshot({ 
                path: path.join(screenshotDir, '08-single-card-closeup.png')
            });
            console.log('📸 Screenshot 8: Single card close-up');
        }
        
        // 9. Check what's actually visible
        const visualAnalysis = await page.evaluate(() => {
            const cards = document.querySelectorAll('.adaptive-card');
            const visibleCards = [];
            
            cards.forEach(card => {
                const styles = getComputedStyle(card);
                if (styles.opacity > 0 && styles.display !== 'none') {
                    const canvas = card.querySelector('canvas');
                    visibleCards.push({
                        id: card.id,
                        opacity: styles.opacity,
                        transform: styles.transform,
                        hasCanvas: !!canvas,
                        canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
                        backgroundColor: styles.backgroundColor
                    });
                }
            });
            
            return {
                totalCards: cards.length,
                visibleCards: visibleCards,
                currentTheme: document.body.className,
                containerBackground: getComputedStyle(document.getElementById('vib34d-container')).background
            };
        });
        
        console.log('\n📊 Visual Analysis:');
        console.log(`Total cards: ${visualAnalysis.totalCards}`);
        console.log(`Visible cards: ${visualAnalysis.visibleCards.length}`);
        console.log(`Current theme: ${visualAnalysis.currentTheme}`);
        console.log('\nVisible card details:');
        visualAnalysis.visibleCards.forEach(card => {
            console.log(`  ${card.id}: opacity=${card.opacity}, canvas=${card.canvasSize}`);
        });
        
        // 10. Final full page screenshot
        await page.screenshot({ 
            path: path.join(screenshotDir, '09-final-full-page.png'),
            fullPage: true,
            captureBeyondViewport: true
        });
        console.log('📸 Screenshot 9: Final full page capture');
        
        console.log('\n✅ Visual verification complete!');
        console.log(`📂 Screenshots saved in: ${screenshotDir}`);
        console.log('\n🖼️ View the screenshots to see:');
        console.log('  - WebGL visualizers rendering');
        console.log('  - State transitions between tesseract faces');
        console.log('  - Theme changes (dark_matter, quantum_flux, neural_matrix)');
        console.log('  - Card visibility and transformations');
        console.log('  - Visual parameter effects');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await page.screenshot({ 
            path: path.join(screenshotDir, 'error-state.png'),
            fullPage: true 
        });
    } finally {
        await browser.close();
    }
}

visualVerify().catch(console.error);