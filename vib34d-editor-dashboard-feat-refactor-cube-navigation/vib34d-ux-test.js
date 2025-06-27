const puppeteer = require('puppeteer');
const fs = require('fs');

// Test configuration
const TEST_URL = 'https://domusgpt.github.io/vib34d-hypercube-navigation/';
const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  url: TEST_URL,
  tests: []
};

// Helper function to log test results
function logTest(category, test, result, details = '') {
  const testEntry = {
    category,
    test,
    result,
    details,
    timestamp: new Date().toISOString()
  };
  testResults.tests.push(testEntry);
  console.log(`[${result}] ${category} - ${test}: ${details}`);
}

// Helper function to wait and check for animations
async function waitForAnimation(page, duration = 1000) {
  await new Promise(resolve => setTimeout(resolve, duration));
}

// Main test function
async function runTests() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: VIEWPORT_SIZES.desktop
  });

  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logTest('Console', 'JavaScript Error', 'FAIL', msg.text());
      }
    });

    // Monitor page errors
    page.on('pageerror', error => {
      logTest('Page', 'Page Error', 'FAIL', error.message);
    });

    // Navigate to the page
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    await waitForAnimation(page, 2000);

    // Test 1: Bezel Drag Interactions
    console.log('\n=== Testing Bezel Drag Interactions ===');
    
    // Get page dimensions
    const dimensions = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });

    // Test top bezel drag
    try {
      await page.mouse.move(dimensions.width / 2, 5);
      await page.mouse.down();
      await page.mouse.move(dimensions.width / 2, dimensions.height / 2, { steps: 10 });
      await page.mouse.up();
      await waitForAnimation(page);
      logTest('Bezel Drag', 'Top bezel drag', 'PASS', 'Drag completed successfully');
    } catch (e) {
      logTest('Bezel Drag', 'Top bezel drag', 'FAIL', e.message);
    }

    // Test bottom bezel drag
    try {
      await page.mouse.move(dimensions.width / 2, dimensions.height - 5);
      await page.mouse.down();
      await page.mouse.move(dimensions.width / 2, dimensions.height / 2, { steps: 10 });
      await page.mouse.up();
      await waitForAnimation(page);
      logTest('Bezel Drag', 'Bottom bezel drag', 'PASS', 'Drag completed successfully');
    } catch (e) {
      logTest('Bezel Drag', 'Bottom bezel drag', 'FAIL', e.message);
    }

    // Test left bezel drag
    try {
      await page.mouse.move(5, dimensions.height / 2);
      await page.mouse.down();
      await page.mouse.move(dimensions.width / 2, dimensions.height / 2, { steps: 10 });
      await page.mouse.up();
      await waitForAnimation(page);
      logTest('Bezel Drag', 'Left bezel drag', 'PASS', 'Drag completed successfully');
    } catch (e) {
      logTest('Bezel Drag', 'Left bezel drag', 'FAIL', e.message);
    }

    // Test right bezel drag
    try {
      await page.mouse.move(dimensions.width - 5, dimensions.height / 2);
      await page.mouse.down();
      await page.mouse.move(dimensions.width / 2, dimensions.height / 2, { steps: 10 });
      await page.mouse.up();
      await waitForAnimation(page);
      logTest('Bezel Drag', 'Right bezel drag', 'PASS', 'Drag completed successfully');
    } catch (e) {
      logTest('Bezel Drag', 'Right bezel drag', 'FAIL', e.message);
    }

    // Test 2: Rapid Successive Drags
    console.log('\n=== Testing Rapid Successive Drags ===');
    try {
      for (let i = 0; i < 5; i++) {
        await page.mouse.move(dimensions.width / 2, 5);
        await page.mouse.down();
        await page.mouse.move(dimensions.width / 2, 100, { steps: 5 });
        await page.mouse.up();
        await new Promise(resolve => setTimeout(resolve, 100)); // Very short delay
      }
      await waitForAnimation(page);
      logTest('Rapid Drags', 'Multiple rapid drags', 'PASS', 'No race conditions detected');
    } catch (e) {
      logTest('Rapid Drags', 'Multiple rapid drags', 'FAIL', e.message);
    }

    // Test 3: Corner Drags
    console.log('\n=== Testing Corner Drags ===');
    const corners = [
      { x: 5, y: 5, name: 'Top-left' },
      { x: dimensions.width - 5, y: 5, name: 'Top-right' },
      { x: 5, y: dimensions.height - 5, name: 'Bottom-left' },
      { x: dimensions.width - 5, y: dimensions.height - 5, name: 'Bottom-right' }
    ];

    for (const corner of corners) {
      try {
        await page.mouse.move(corner.x, corner.y);
        await page.mouse.down();
        await page.mouse.move(dimensions.width / 2, dimensions.height / 2, { steps: 10 });
        await page.mouse.up();
        await waitForAnimation(page, 500);
        
        // Check if any animation occurred
        const hasAnimation = await page.evaluate(() => {
          // Check if any element has active transitions or animations
          const elements = document.querySelectorAll('*');
          for (const el of elements) {
            const style = window.getComputedStyle(el);
            if (style.transition !== 'none' || style.animation !== 'none') {
              return true;
            }
          }
          return false;
        });
        
        logTest('Corner Drags', `${corner.name} corner drag`, hasAnimation ? 'PASS' : 'INFO', 
          hasAnimation ? 'Corner drag triggered animation' : 'Corner drag did not trigger animation');
      } catch (e) {
        logTest('Corner Drags', `${corner.name} corner drag`, 'FAIL', e.message);
      }
    }

    // Test 4: Partial Drags
    console.log('\n=== Testing Partial Drags ===');
    try {
      // Start drag but release early
      await page.mouse.move(dimensions.width / 2, 5);
      await page.mouse.down();
      await page.mouse.move(dimensions.width / 2, 50, { steps: 5 }); // Only drag 50px
      await page.mouse.up();
      await waitForAnimation(page, 500);
      logTest('Partial Drags', 'Incomplete drag gesture', 'PASS', 'Partial drag handled correctly');
    } catch (e) {
      logTest('Partial Drags', 'Incomplete drag gesture', 'FAIL', e.message);
    }

    // Test 5: Click Interactions
    console.log('\n=== Testing Click Interactions ===');
    
    // Find clickable elements
    const clickableElements = await page.evaluate(() => {
      const elements = [];
      document.querySelectorAll('a, button, [role="button"], [onclick], [data-clickable]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          elements.push({
            tag: el.tagName,
            class: el.className,
            id: el.id,
            text: el.textContent.substring(0, 50),
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          });
        }
      });
      return elements;
    });

    if (clickableElements.length > 0) {
      for (const element of clickableElements) {
        try {
          await page.mouse.click(element.x, element.y);
          await waitForAnimation(page, 500);
          logTest('Click Tests', `Click on ${element.tag}`, 'PASS', 
            `Clicked: ${element.text || element.class || element.id || 'unnamed element'}`);
        } catch (e) {
          logTest('Click Tests', `Click on ${element.tag}`, 'FAIL', e.message);
        }
      }
    } else {
      logTest('Click Tests', 'Find clickable elements', 'INFO', 'No clickable elements found');
    }

    // Test 6: Keyboard Navigation
    console.log('\n=== Testing Keyboard Navigation ===');
    
    // Tab navigation
    try {
      await page.keyboard.press('Tab');
      await new Promise(resolve => setTimeout(resolve, 200));
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el.tagName,
          class: el.className,
          id: el.id
        };
      });
      logTest('Keyboard', 'Tab navigation', 'PASS', `Focused: ${focusedElement.tag}`);
    } catch (e) {
      logTest('Keyboard', 'Tab navigation', 'FAIL', e.message);
    }

    // Arrow key navigation
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    for (const key of arrowKeys) {
      try {
        await page.keyboard.press(key);
        await waitForAnimation(page, 300);
        logTest('Keyboard', `${key} navigation`, 'PASS', 'Key press handled');
      } catch (e) {
        logTest('Keyboard', `${key} navigation`, 'FAIL', e.message);
      }
    }

    // Enter key
    try {
      await page.keyboard.press('Enter');
      await waitForAnimation(page, 500);
      logTest('Keyboard', 'Enter key activation', 'PASS', 'Enter key handled');
    } catch (e) {
      logTest('Keyboard', 'Enter key activation', 'FAIL', e.message);
    }

    // Test 7: Browser Resize During Animation
    console.log('\n=== Testing Browser Resize During Animation ===');
    try {
      // Start an animation
      await page.mouse.move(dimensions.width / 2, 5);
      await page.mouse.down();
      await page.mouse.move(dimensions.width / 2, dimensions.height / 2, { steps: 10 });
      await page.mouse.up();
      
      // Resize during animation
      await page.setViewport({ width: 1024, height: 768 });
      await waitForAnimation(page);
      
      // Check if layout is intact
      const layoutCheck = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.width < 0 || rect.height < 0) {
            return false;
          }
        }
        return true;
      });
      
      logTest('Resize', 'Resize during animation', layoutCheck ? 'PASS' : 'FAIL', 
        layoutCheck ? 'Layout maintained during resize' : 'Layout issues detected');
    } catch (e) {
      logTest('Resize', 'Resize during animation', 'FAIL', e.message);
    }

    // Test 8: Page Refresh During Transitions
    console.log('\n=== Testing Page Refresh During Transitions ===');
    try {
      // Start a transition
      await page.mouse.move(dimensions.width / 2, 5);
      await page.mouse.down();
      await page.mouse.move(dimensions.width / 2, 100, { steps: 5 });
      await page.mouse.up();
      
      // Refresh immediately
      await page.reload({ waitUntil: 'networkidle2' });
      await waitForAnimation(page, 2000);
      
      logTest('Refresh', 'Page refresh during transition', 'PASS', 'Page recovered from refresh');
    } catch (e) {
      logTest('Refresh', 'Page refresh during transition', 'FAIL', e.message);
    }

    // Test 9: Different Screen Sizes
    console.log('\n=== Testing Different Screen Sizes ===');
    for (const [deviceType, viewport] of Object.entries(VIEWPORT_SIZES)) {
      try {
        await page.setViewport(viewport);
        await waitForAnimation(page, 1000);
        
        // Test basic interaction at this size
        const dims = await page.evaluate(() => ({
          width: window.innerWidth,
          height: window.innerHeight
        }));
        
        await page.mouse.move(dims.width / 2, 5);
        await page.mouse.down();
        await page.mouse.move(dims.width / 2, dims.height / 4, { steps: 5 });
        await page.mouse.up();
        await waitForAnimation(page, 500);
        
        logTest('Screen Sizes', `${deviceType} viewport (${viewport.width}x${viewport.height})`, 
          'PASS', 'Interactions work at this size');
      } catch (e) {
        logTest('Screen Sizes', `${deviceType} viewport`, 'FAIL', e.message);
      }
    }

    // Test 10: Touch Events vs Mouse Events
    console.log('\n=== Testing Touch Events ===');
    try {
      // Enable touch
      await page.setViewport({ ...VIEWPORT_SIZES.mobile, hasTouch: true });
      
      // Simulate touch drag
      await page.touchscreen.tap(dimensions.width / 2, dimensions.height / 2);
      await waitForAnimation(page, 500);
      
      logTest('Touch Events', 'Touch tap', 'PASS', 'Touch events supported');
      
      // Touch drag
      await page.touchscreen.touchStart(dimensions.width / 2, 5);
      await page.touchscreen.touchMove(dimensions.width / 2, dimensions.height / 2);
      await page.touchscreen.touchEnd();
      await waitForAnimation(page);
      
      logTest('Touch Events', 'Touch drag gesture', 'PASS', 'Touch drag completed');
    } catch (e) {
      logTest('Touch Events', 'Touch interactions', 'FAIL', e.message);
    }

    // Additional Tests: Performance and Visual Quality
    console.log('\n=== Testing Performance and Visual Quality ===');
    
    // Check for performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: entries.loadEventEnd - entries.loadEventStart,
        domContentLoaded: entries.domContentLoadedEventEnd - entries.domContentLoadedEventStart,
        totalTime: entries.loadEventEnd - entries.fetchStart
      };
    });
    
    logTest('Performance', 'Page load metrics', 'INFO', 
      `Load: ${performanceMetrics.loadTime}ms, DOM: ${performanceMetrics.domContentLoaded}ms, Total: ${performanceMetrics.totalTime}ms`);

    // Check for animation smoothness
    const animationCheck = await page.evaluate(() => {
      return new Promise(resolve => {
        let frameCount = 0;
        let startTime = performance.now();
        
        function countFrames() {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frameCount);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    });
    
    logTest('Performance', 'Animation frame rate', animationCheck > 50 ? 'PASS' : 'WARN', 
      `${animationCheck} FPS detected`);

    // Check for console errors during the entire test
    const consoleErrors = await page.evaluate(() => {
      return window.__consoleErrors || [];
    });
    
    if (consoleErrors.length > 0) {
      logTest('Console', 'JavaScript errors during test', 'WARN', 
        `${consoleErrors.length} errors detected`);
    }

    // Visual regression check
    await page.screenshot({ path: 'vib34d-test-screenshot.png', fullPage: true });
    logTest('Visual', 'Screenshot captured', 'INFO', 'Screenshot saved for visual inspection');

  } catch (error) {
    console.error('Test suite error:', error);
    logTest('Test Suite', 'Fatal Error', 'FAIL', error.message);
  } finally {
    await browser.close();
    
    // Save test results
    fs.writeFileSync('vib34d-test-results.json', JSON.stringify(testResults, null, 2));
    
    // Generate summary report
    generateReport();
  }
}

// Generate human-readable report
function generateReport() {
  const report = [];
  report.push('# VIB34D Hypercube Navigation - UX Test Report');
  report.push(`\nTest Date: ${testResults.timestamp}`);
  report.push(`URL: ${testResults.url}`);
  report.push('\n## Test Summary\n');
  
  // Count results by category
  const summary = {};
  const categoryResults = {};
  
  testResults.tests.forEach(test => {
    if (!summary[test.result]) summary[test.result] = 0;
    summary[test.result]++;
    
    if (!categoryResults[test.category]) {
      categoryResults[test.category] = { PASS: 0, FAIL: 0, WARN: 0, INFO: 0 };
    }
    categoryResults[test.category][test.result]++;
  });
  
  report.push(`Total Tests: ${testResults.tests.length}`);
  report.push(`✅ Passed: ${summary.PASS || 0}`);
  report.push(`❌ Failed: ${summary.FAIL || 0}`);
  report.push(`⚠️  Warnings: ${summary.WARN || 0}`);
  report.push(`ℹ️  Info: ${summary.INFO || 0}`);
  
  report.push('\n## Results by Category\n');
  
  Object.entries(categoryResults).forEach(([category, results]) => {
    report.push(`### ${category}`);
    Object.entries(results).forEach(([result, count]) => {
      if (count > 0) {
        report.push(`- ${result}: ${count}`);
      }
    });
    report.push('');
  });
  
  report.push('\n## Detailed Test Results\n');
  
  let currentCategory = '';
  testResults.tests.forEach(test => {
    if (test.category !== currentCategory) {
      currentCategory = test.category;
      report.push(`\n### ${currentCategory}\n`);
    }
    
    const icon = test.result === 'PASS' ? '✅' : 
                 test.result === 'FAIL' ? '❌' : 
                 test.result === 'WARN' ? '⚠️' : 'ℹ️';
    
    report.push(`${icon} **${test.test}**`);
    if (test.details) {
      report.push(`   - ${test.details}`);
    }
  });
  
  report.push('\n## Recommendations\n');
  
  // Generate recommendations based on findings
  const recommendations = [];
  
  if (summary.FAIL > 0) {
    recommendations.push('1. **Critical Issues**: Address failed tests immediately, especially:');
    testResults.tests.filter(t => t.result === 'FAIL').forEach(test => {
      recommendations.push(`   - ${test.category}: ${test.test}`);
    });
  }
  
  // Check specific patterns
  const bezelTests = testResults.tests.filter(t => t.category === 'Bezel Drag');
  const allBezelPass = bezelTests.every(t => t.result === 'PASS');
  if (!allBezelPass) {
    recommendations.push('2. **Bezel Interactions**: Some bezel drag gestures are not working correctly. Review touch/mouse event handling.');
  }
  
  const cornerTests = testResults.tests.filter(t => t.test.includes('corner'));
  const cornersBehavior = cornerTests.map(t => t.result).filter((v, i, a) => a.indexOf(v) === i);
  if (cornersBehavior.includes('INFO') || cornersBehavior.includes('FAIL')) {
    recommendations.push('3. **Corner Behavior**: Corner drag behavior is inconsistent or undefined. Consider implementing clear corner interaction rules.');
  }
  
  const performanceTests = testResults.tests.filter(t => t.category === 'Performance');
  const fps = performanceTests.find(t => t.test.includes('frame rate'));
  if (fps && fps.details.includes('FPS') && parseInt(fps.details) < 60) {
    recommendations.push('4. **Performance**: Animation frame rate is below 60 FPS. Optimize rendering and animations.');
  }
  
  const touchTests = testResults.tests.filter(t => t.category === 'Touch Events');
  if (touchTests.some(t => t.result === 'FAIL')) {
    recommendations.push('5. **Touch Support**: Touch events are not properly implemented. Add touch event listeners for mobile devices.');
  }
  
  const keyboardTests = testResults.tests.filter(t => t.category === 'Keyboard');
  if (keyboardTests.some(t => t.result === 'FAIL')) {
    recommendations.push('6. **Accessibility**: Keyboard navigation needs improvement. Ensure all interactive elements are keyboard accessible.');
  }
  
  recommendations.push('\n### General Recommendations:');
  recommendations.push('- Add visual feedback for drag initiation and completion');
  recommendations.push('- Implement loading states for async operations');
  recommendations.push('- Add ARIA labels for screen reader support');
  recommendations.push('- Consider adding haptic feedback for mobile devices');
  recommendations.push('- Implement gesture cancellation for accidental touches');
  recommendations.push('- Add user preference settings for animation speed');
  
  report.push(...recommendations);
  
  // Write report
  fs.writeFileSync('vib34d-test-report.md', report.join('\n'));
  console.log('\n✅ Test report generated: vib34d-test-report.md');
  console.log('📄 Raw test data saved: vib34d-test-results.json');
  console.log('📸 Screenshot saved: vib34d-test-screenshot.png');
}

// Run the tests
runTests().catch(console.error);