const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    console.log(`[BROWSER-${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  // Capture errors
  page.on('error', err => {
    console.log(`[BROWSER-ERROR] ${err.message}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[PAGE-ERROR] ${err.message}`);
  });
  
  try {
    console.log('🚀 Loading debug test page...');
    await page.goto('http://localhost:8000/debug_test.html', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    // Wait for tests to complete
    await page.waitForTimeout(3000);
    
    // Get the results
    const results = await page.evaluate(() => {
      return document.getElementById('results').innerHTML;
    });
    
    console.log('📊 TEST RESULTS:');
    console.log(results.replace(/<[^>]*>/g, '')); // Strip HTML tags
    
    // Take a screenshot
    await page.screenshot({ path: 'debug_test_screenshot.png' });
    console.log('📸 Screenshot saved as debug_test_screenshot.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await browser.close();
})();