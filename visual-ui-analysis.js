const puppeteer = require('puppeteer');
const fs = require('fs');

// Visual analysis of UI elements and interactions
async function analyzeUIElements() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to the page
    await page.goto('https://domusgpt.github.io/vib34d-hypercube-navigation/', { 
      waitUntil: 'networkidle2' 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Analyze UI structure and visual elements
    const uiAnalysis = await page.evaluate(() => {
      const analysis = {
        layout: {},
        typography: {},
        colors: {},
        interactiveElements: {},
        accessibility: {},
        visualHierarchy: {},
        responsiveness: {}
      };

      // Layout analysis
      const body = document.body;
      const bodyStyles = window.getComputedStyle(body);
      analysis.layout = {
        bodyDisplay: bodyStyles.display,
        bodyOverflow: bodyStyles.overflow,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth
      };

      // Find all visible elements
      const allElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.display !== 'none';
      });

      // Typography analysis
      const textElements = allElements.filter(el => el.textContent.trim().length > 0);
      analysis.typography = {
        totalTextElements: textElements.length,
        fonts: [...new Set(textElements.map(el => window.getComputedStyle(el).fontFamily))],
        fontSizes: [...new Set(textElements.map(el => window.getComputedStyle(el).fontSize))],
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          tag: h.tagName,
          text: h.textContent.substring(0, 50),
          fontSize: window.getComputedStyle(h).fontSize,
          color: window.getComputedStyle(h).color
        }))
      };

      // Color analysis
      const colorElements = allElements.slice(0, 50); // Sample first 50 elements
      analysis.colors = {
        backgroundColors: [...new Set(colorElements.map(el => window.getComputedStyle(el).backgroundColor).filter(c => c !== 'rgba(0, 0, 0, 0)'))],
        textColors: [...new Set(colorElements.map(el => window.getComputedStyle(el).color))],
        borderColors: [...new Set(colorElements.map(el => window.getComputedStyle(el).borderColor).filter(c => c !== 'rgba(0, 0, 0, 0)'))]
      };

      // Interactive elements analysis
      const clickableElements = document.querySelectorAll('a, button, [role="button"], [onclick], input, select, textarea');
      const draggableElements = document.querySelectorAll('[draggable="true"], [data-draggable]');
      
      analysis.interactiveElements = {
        clickableCount: clickableElements.length,
        clickableTypes: [...new Set(Array.from(clickableElements).map(el => el.tagName.toLowerCase()))],
        draggableCount: draggableElements.length,
        hasHoverEffects: Array.from(clickableElements).some(el => {
          const styles = window.getComputedStyle(el);
          return styles.cursor === 'pointer' || el.style.cursor === 'pointer';
        })
      };

      // Accessibility analysis
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(img => !img.alt);
      const inputsWithoutLabels = Array.from(document.querySelectorAll('input')).filter(input => {
        return !input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`) && !input.closest('label');
      });

      analysis.accessibility = {
        imagesTotal: document.querySelectorAll('img').length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        inputsWithoutLabels: inputsWithoutLabels.length,
        hasSkipLinks: !!document.querySelector('a[href="#main"], a[href="#content"]'),
        hasAriaLabels: document.querySelectorAll('[aria-label]').length,
        hasAriaDescriptions: document.querySelectorAll('[aria-describedby]').length,
        focusableElements: document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').length
      };

      // Visual hierarchy analysis
      const canvas = document.querySelector('canvas');
      const containers = document.querySelectorAll('div');
      
      analysis.visualHierarchy = {
        hasCanvas: !!canvas,
        canvasSize: canvas ? { width: canvas.width, height: canvas.height } : null,
        containerCount: containers.length,
        maxZIndex: Math.max(...Array.from(allElements).map(el => {
          const z = window.getComputedStyle(el).zIndex;
          return z === 'auto' ? 0 : parseInt(z) || 0;
        })),
        hasFixedElements: Array.from(allElements).some(el => window.getComputedStyle(el).position === 'fixed'),
        hasAbsoluteElements: Array.from(allElements).some(el => window.getComputedStyle(el).position === 'absolute')
      };

      // Check for animations and transitions
      const animatedElements = Array.from(allElements).filter(el => {
        const styles = window.getComputedStyle(el);
        return styles.transition !== 'all 0s ease 0s' || styles.animation !== 'none';
      });

      analysis.animations = {
        elementsWithTransitions: animatedElements.length,
        transitionProperties: [...new Set(animatedElements.map(el => window.getComputedStyle(el).transitionProperty))],
        animationNames: [...new Set(animatedElements.map(el => window.getComputedStyle(el).animationName).filter(name => name !== 'none'))]
      };

      return analysis;
    });

    // Test visual feedback during interactions
    console.log('\n=== Testing Visual Feedback ===');
    
    const dimensions = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));

    // Test hover effects
    const hoverTest = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')).slice(0, 20);
      let hoverEffects = 0;
      
      elements.forEach(el => {
        const originalStyles = {
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color,
          transform: window.getComputedStyle(el).transform
        };
        
        // Simulate hover
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        
        const hoverStyles = {
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color,
          transform: window.getComputedStyle(el).transform
        };
        
        if (JSON.stringify(originalStyles) !== JSON.stringify(hoverStyles)) {
          hoverEffects++;
        }
        
        // Reset
        el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });
      
      return hoverEffects;
    });

    // Test drag visual feedback
    let dragFeedback = false;
    try {
      // Start a drag and check for visual changes
      await page.mouse.move(dimensions.width / 2, 10);
      await page.mouse.down();
      
      // Check if any visual changes occurred
      dragFeedback = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => {
          const styles = window.getComputedStyle(el);
          return styles.cursor === 'grabbing' || styles.cursor === 'move' || 
                 el.classList.contains('dragging') || el.classList.contains('active');
        });
      });
      
      await page.mouse.up();
    } catch (e) {
      console.log('Drag feedback test error:', e.message);
    }

    // Performance analysis
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve({
            paintEntries: entries.filter(entry => entry.entryType === 'paint').length,
            measureEntries: entries.filter(entry => entry.entryType === 'measure').length,
            navigationTiming: performance.getEntriesByType('navigation')[0]
          });
        });
        
        observer.observe({ entryTypes: ['paint', 'measure', 'navigation'] });
        
        // Fallback after 1 second
        setTimeout(() => {
          resolve({
            paintEntries: 0,
            measureEntries: 0,
            navigationTiming: performance.getEntriesByType('navigation')[0] || {}
          });
        }, 1000);
      });
    });

    // Compile comprehensive report
    const visualReport = {
      timestamp: new Date().toISOString(),
      url: 'https://domusgpt.github.io/vib34d-hypercube-navigation/',
      uiAnalysis,
      interactionFeedback: {
        hoverEffects: hoverTest,
        dragFeedback: dragFeedback,
        hasVisualFeedback: hoverTest > 0 || dragFeedback
      },
      performanceMetrics,
      recommendations: []
    };

    // Generate recommendations based on analysis
    if (visualReport.uiAnalysis.accessibility.imagesWithoutAlt > 0) {
      visualReport.recommendations.push('Add alt text to images for better accessibility');
    }
    
    if (visualReport.uiAnalysis.accessibility.focusableElements === 0) {
      visualReport.recommendations.push('Add focusable elements for keyboard navigation');
    }
    
    if (!visualReport.interactionFeedback.hasVisualFeedback) {
      visualReport.recommendations.push('Add visual feedback for user interactions (hover, active states)');
    }
    
    if (visualReport.uiAnalysis.interactiveElements.clickableCount === 0) {
      visualReport.recommendations.push('Consider adding interactive UI elements for better user engagement');
    }
    
    if (!visualReport.uiAnalysis.visualHierarchy.hasCanvas) {
      visualReport.recommendations.push('Canvas element not detected - may impact 3D rendering functionality');
    }

    visualReport.recommendations.push('Add loading indicators for better user experience');
    visualReport.recommendations.push('Implement error boundaries for robust error handling');
    visualReport.recommendations.push('Add tooltips or help text for complex interactions');
    visualReport.recommendations.push('Consider adding animation easing for smoother transitions');

    // Save the visual analysis report
    fs.writeFileSync('visual-ui-analysis-report.json', JSON.stringify(visualReport, null, 2));
    
    console.log('\n=== Visual UI Analysis Complete ===');
    console.log(`UI Elements Analyzed: ${visualReport.uiAnalysis.layout.viewportWidth}x${visualReport.uiAnalysis.layout.viewportHeight}`);
    console.log(`Typography: ${visualReport.uiAnalysis.typography.totalTextElements} text elements`);
    console.log(`Interactive Elements: ${visualReport.uiAnalysis.interactiveElements.clickableCount} clickable`);
    console.log(`Hover Effects: ${visualReport.interactionFeedback.hoverEffects} detected`);
    console.log(`Drag Feedback: ${visualReport.interactionFeedback.dragFeedback ? 'Yes' : 'No'}`);
    console.log(`Accessibility Issues: ${visualReport.uiAnalysis.accessibility.imagesWithoutAlt} images without alt text`);
    console.log(`Canvas Detected: ${visualReport.uiAnalysis.visualHierarchy.hasCanvas ? 'Yes' : 'No'}`);

    return visualReport;

  } catch (error) {
    console.error('Visual analysis error:', error);
    return null;
  } finally {
    await browser.close();
  }
}

// Run the visual analysis
analyzeUIElements().catch(console.error);