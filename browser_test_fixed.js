const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting VIB34D Browser Test...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    console.log(`[BROWSER-${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  // Capture errors
  page.on('error', err => {
    console.log(`[ERROR] ${err.message}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[PAGE-ERROR] ${err.message}`);
  });
  
  try {
    console.log('📄 Loading test page...');
    await page.goto('http://localhost:8000/simple_test.html', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });
    
    // Wait for tests to complete
    console.log('⏳ Waiting for tests...');
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Get test results
    const testResults = await page.evaluate(() => {
      const output = document.getElementById('output');
      return output ? output.textContent : 'No output found';
    });
    
    console.log('\n📊 TEST RESULTS:');
    console.log('='.repeat(60));
    console.log(testResults);
    console.log('='.repeat(60));
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test_results.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: test_results.png');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
  
  await browser.close();
  console.log('🏁 Browser test complete\!');
})();
