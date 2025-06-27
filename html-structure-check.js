const puppeteer = require('puppeteer');

async function checkHTMLStructure() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1920,1080']
  });
  
  const page = await browser.newPage();

  console.log('🌐 Loading page to check HTML structure...');
  await page.goto('https://domusgpt.github.io/vib3stylepack-v2-production/vib3code-morphing-blog.html', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await page.waitForTimeout(3000);

  // Extract the full HTML structure around faces
  const htmlStructure = await page.evaluate(() => {
    const container = document.querySelector('.tesseract-container');
    if (container) {
      return {
        containerExists: true,
        innerHTML: container.innerHTML.substring(0, 5000), // First 5000 chars
        faceElements: container.querySelectorAll('[id^="face-"]').length,
        allFaceIds: Array.from(container.querySelectorAll('[id^="face-"]')).map(el => el.id)
      };
    }
    
    // If no tesseract-container, check for individual faces
    const faces = [];
    for (let i = 0; i < 8; i++) {
      const face = document.querySelector(`#face-${i}`);
      if (face) faces.push(`face-${i}`);
    }
    
    return {
      containerExists: false,
      faceElements: faces.length,
      allFaceIds: faces,
      bodyContent: document.body.innerHTML.substring(0, 3000)
    };
  });

  console.log('\n📋 HTML STRUCTURE ANALYSIS:');
  console.log(`Container exists: ${htmlStructure.containerExists}`);
  console.log(`Face elements found: ${htmlStructure.faceElements}`);
  console.log(`Face IDs: ${htmlStructure.allFaceIds.join(', ')}`);

  if (htmlStructure.containerExists) {
    console.log('\n📄 Container HTML (first 1000 chars):');
    console.log(htmlStructure.innerHTML.substring(0, 1000));
  } else {
    console.log('\n📄 Body HTML (first 1000 chars):');
    console.log(htmlStructure.bodyContent.substring(0, 1000));
  }

  // Check if faces are generated dynamically
  const dynamicCheck = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(script => ({
      src: script.src || 'inline',
      content: script.innerHTML.substring(0, 200)
    }));
    
    return {
      totalScripts: scripts.length,
      vib3Scripts: scripts.filter(s => s.src.includes('VIB3')),
      inlineScripts: scripts.filter(s => s.src === 'inline' && s.content.includes('face'))
    };
  });

  console.log('\n🔧 SCRIPT ANALYSIS:');
  console.log(`Total scripts: ${dynamicCheck.totalScripts}`);
  console.log(`VIB3 scripts: ${dynamicCheck.vib3Scripts.length}`);
  console.log(`Inline scripts mentioning "face": ${dynamicCheck.inlineScripts.length}`);

  if (dynamicCheck.vib3Scripts.length > 0) {
    console.log('\nVIB3 Scripts:');
    dynamicCheck.vib3Scripts.forEach(script => {
      console.log(`  - ${script.src}`);
    });
  }

  await browser.close();
}

checkHTMLStructure().catch(console.error);