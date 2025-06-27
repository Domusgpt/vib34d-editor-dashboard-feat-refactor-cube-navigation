#!/usr/bin/env node

/**
 * Test script for enhanced MCP Puppeteer server
 * Tests the new screenshot and debugging functionality for the live site
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testMCPServer() {
    console.log('🚀 Testing Enhanced MCP Puppeteer Server...');
    
    // Start the MCP server
    const serverProcess = spawn('node', ['vib3-mcp-server/dist/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    serverProcess.stdout.on('data', (data) => {
        console.log('Server:', data.toString());
    });
    
    serverProcess.stderr.on('data', (data) => {
        console.error('Server Error:', data.toString());
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test requests
    const testRequests = [
        {
            id: 1,
            method: 'tools/list'
        },
        {
            id: 2,
            method: 'tools/call',
            params: {
                name: 'screenshot_live_site',
                arguments: {
                    url: 'https://domusgpt.github.io/vib34d-hypercube-navigation/',
                    waitTime: 3
                }
            }
        },
        {
            id: 3,
            method: 'tools/call',
            params: {
                name: 'debug_live_site',
                arguments: {
                    url: 'https://domusgpt.github.io/vib34d-hypercube-navigation/'
                }
            }
        }
    ];
    
    for (const request of testRequests) {
        console.log(`\n📤 Sending request: ${request.method}`);
        
        const message = JSON.stringify({
            jsonrpc: '2.0',
            ...request
        }) + '\n';
        
        serverProcess.stdin.write(message);
        
        // Wait for response
        await new Promise(resolve => setTimeout(resolve, 8000));
    }
    
    // Cleanup
    serverProcess.kill();
    console.log('\n✅ Test completed!');
}

testMCPServer().catch(console.error);