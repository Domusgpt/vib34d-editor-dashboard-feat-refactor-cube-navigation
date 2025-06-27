const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting VIB34D Browser Test with Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  // Capture all console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const text = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    console.log(text);
    consoleMessages.push(text);
  });
  
  // Capture errors
  page.on('error', err => {
    const text = `[BROWSER-ERROR] ${err.message}`;
    console.log(text);
    consoleMessages.push(text);
  });
  
  page.on('pageerror', err => {
    const text = `[PAGE-ERROR] ${err.message}\n${err.stack}`;
    console.log(text);
    consoleMessages.push(text);
  });
  
  try {
    // Start the HTTP server
    console.log('🌐 Starting HTTP server...');
    const { spawn } = require('child_process');
    const server = spawn('python', ['-m', 'http.server', '8000'], {
      stdio: 'pipe'
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📄 Loading test page...');
    await page.goto('http://localhost:8000/simple_test.html', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    // Wait for tests to complete
    console.log('⏳ Waiting for tests to complete...');
    await page.waitForTimeout(3000);
    
    // Get the test results from the page
    const testResults = await page.evaluate(() => {
      const output = document.getElementById('output');
      return output ? output.textContent : 'No test output found';
    });
    
    console.log('\n📊 TEST RESULTS FROM PAGE:');
    console.log('='.repeat(50));
    console.log(testResults);
    console.log('='.repeat(50));
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'vib34d_test_screenshot.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: vib34d_test_screenshot.png');
    
    // Clean up
    server.kill();
    
  } catch (error) {
    console.log(`❌ Error during testing: ${error.message}`);
    console.log(error.stack);
  }
  
  await browser.close();
  console.log('🏁 Browser test completed\!');
})();
