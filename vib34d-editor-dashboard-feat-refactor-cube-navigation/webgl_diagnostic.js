#!/usr/bin/env node

/**
 * WebGL Diagnostic Test
 * Check WebGL support and capabilities
 */

const puppeteer = require('puppeteer').default || require('puppeteer');

async function testWebGL() {
    console.log('🔍 Running WebGL Diagnostic...');
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false, // Try with head to see if that helps WebGL
            args: [
                '--enable-webgl',
                '--enable-webgl2',
                '--use-gl=desktop',
                '--enable-gpu',
                '--disable-software-rasterizer',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

        const page = await browser.newPage();
        
        const webglTest = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            const gl2 = canvas.getContext('webgl2');
            
            if (!gl) {
                return { supported: false, version: null, error: 'No WebGL context available' };
            }
            
            const info = {
                supported: true,
                version: gl.getParameter(gl.VERSION),
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
                maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
                maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
                webgl2Supported: !!gl2
            };
            
            // Test shader compilation
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, `
                attribute vec4 position;
                void main() {
                    gl_Position = position;
                }
            `);
            gl.compileShader(vertexShader);
            info.vertexShaderSupported = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
            
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, `
                precision mediump float;
                void main() {
                    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
                }
            `);
            gl.compileShader(fragmentShader);
            info.fragmentShaderSupported = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
            
            return info;
        });
        
        console.log('WebGL Test Results:');
        console.log(JSON.stringify(webglTest, null, 2));
        
        return webglTest;

    } catch (error) {
        console.error('WebGL test failed:', error);
        return { error: error.message };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testWebGL().then(result => {
    console.log('✅ WebGL diagnostic completed');
});