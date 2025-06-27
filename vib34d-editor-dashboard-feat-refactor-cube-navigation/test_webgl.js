const puppeteer = require('puppeteer');

(async () => {
  console.log('🔧 Testing WebGL support in Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--enable-webgl',
      '--enable-webgl2',
      '--use-gl=desktop',
      '--enable-gpu',
      '--ignore-gpu-blacklist',
      '--disable-gpu-sandbox',
      '--enable-accelerated-2d-canvas',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });
  
  const page = await browser.newPage();
  await page.goto('data:text/html,<canvas id="test" width="100" height="100"></canvas>');
  
  const webglSupport = await page.evaluate(() => {
    const canvas = document.getElementById('test');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const gl2 = canvas.getContext('webgl2');
    
    return {
      webglSupported: !!gl,
      webgl2Supported: !!gl2,
      webglVersion: gl ? gl.getParameter(gl.VERSION) : null,
      renderer: gl ? gl.getParameter(gl.RENDERER) : null,
      vendor: gl ? gl.getParameter(gl.VENDOR) : null,
      canvasSize: { width: canvas.width, height: canvas.height }
    };
  });
  
  console.log('🎯 WebGL Support Results:', webglSupport);
  
  if (webglSupport.webglSupported) {
    console.log('✅ WebGL is working - the issue is in our visualizer code');
  } else {
    console.log('❌ WebGL is not available in this environment');
  }
  
  await browser.close();
})();