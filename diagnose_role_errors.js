const puppeteer = require('puppeteer');

(async () => {
    console.log('🔍 Diagnosing VIB3HomeMaster role errors...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Collect console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Unknown role')) {
            consoleMessages.push(text);
        }
    });
    
    console.log('📄 Loading dashboard...');
    await page.goto('http://localhost:8899/index_VIB34D_PROFESSIONAL.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait a bit to collect errors
    await page.waitForTimeout(5000);
    
    // Analyze the page structure
    const analysis = await page.evaluate(() => {
        // Find all elements with roles
        const elementsWithRoles = [];
        document.querySelectorAll('[data-role], .blog-card, .nav-bezel, canvas').forEach(elem => {
            const role = elem.getAttribute('data-role') || 
                         elem.className.split(' ').find(c => c.includes('role-')) ||
                         elem.id?.match(/role-(\w+)/)?.[1] ||
                         'unknown';
            
            elementsWithRoles.push({
                tagName: elem.tagName,
                id: elem.id || 'no-id',
                classes: elem.className,
                role: role,
                parent: elem.parentElement?.className || 'no-parent'
            });
        });
        
        // Check VIB3HomeMaster instance roles
        let homeMasterRoles = [];
        if (window.vib34dDashboard && window.vib34dDashboard.homeMaster) {
            homeMasterRoles = Object.keys(window.vib34dDashboard.homeMaster.instanceRoles || {});
        }
        
        // Find visualizers requesting unknown roles
        const visualizers = [];
        if (window.vib34dDashboard && window.vib34dDashboard.visualizers) {
            window.vib34dDashboard.visualizers.forEach((viz, key) => {
                visualizers.push({
                    id: key,
                    role: viz.role || 'unknown',
                    sectionIndex: viz.sectionIndex
                });
            });
        }
        
        return {
            elementsWithRoles,
            homeMasterRoles,
            visualizers,
            totalElements: document.querySelectorAll('*').length,
            canvasCount: document.querySelectorAll('canvas').length
        };
    });
    
    console.log('\n📊 DIAGNOSTIC RESULTS:');
    console.log('====================\n');
    
    // Show unique unknown roles
    const uniqueErrors = [...new Set(consoleMessages)];
    console.log(`❌ Unique Unknown Role Errors (${uniqueErrors.length}):`);
    uniqueErrors.forEach(err => {
        const role = err.match(/Unknown role: (\S+)/)?.[1];
        console.log(`   - Role: "${role}"`);
    });
    
    console.log(`\n✅ VIB3HomeMaster Registered Roles (${analysis.homeMasterRoles.length}):`);
    console.log('   ' + analysis.homeMasterRoles.join(', '));
    
    console.log(`\n📦 Visualizers Requesting Roles (${analysis.visualizers.length}):`);
    const roleCount = {};
    analysis.visualizers.forEach(viz => {
        roleCount[viz.role] = (roleCount[viz.role] || 0) + 1;
    });
    Object.entries(roleCount).forEach(([role, count]) => {
        console.log(`   - "${role}": ${count} visualizers`);
    });
    
    // Find the mismatch
    console.log('\n🔍 ROLE MISMATCH ANALYSIS:');
    const problemRoles = uniqueErrors.map(err => err.match(/Unknown role: (\S+)/)?.[1]).filter(Boolean);
    problemRoles.forEach(role => {
        console.log(`\n   Role "${role}":`);
        console.log(`   - Registered in HomeMaster: ${analysis.homeMasterRoles.includes(role) ? 'YES' : 'NO'}`);
        console.log(`   - Used by visualizers: ${roleCount[role] || 0} times`);
        
        // Find elements using this role
        const elements = analysis.elementsWithRoles.filter(el => 
            el.role === role || el.classes.includes(role) || el.id.includes(role)
        );
        if (elements.length > 0) {
            console.log(`   - Found in ${elements.length} HTML elements`);
        }
    });
    
    // Save detailed report
    const report = {
        timestamp: new Date().toISOString(),
        uniqueErrors,
        homeMasterRoles: analysis.homeMasterRoles,
        visualizers: analysis.visualizers,
        roleCount,
        problemRoles,
        canvasCount: analysis.canvasCount
    };
    
    require('fs').writeFileSync('role_error_diagnosis.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed report saved to role_error_diagnosis.json');
    
    await page.screenshot({ path: 'role_error_screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved to role_error_screenshot.png');
    
    console.log('\n🔍 Keeping browser open for manual inspection...');
    await page.waitForTimeout(10000);
    await browser.close();
})();