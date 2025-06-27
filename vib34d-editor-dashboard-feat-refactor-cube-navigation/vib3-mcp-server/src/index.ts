#!/usr/bin/env node

/**
 * VIB3STYLEPACK MCP Server
 * 
 * Model Context Protocol server for testing and controlling the VIB3STYLEPACK
 * 4D visualization system. Provides tools for:
 * - Running VIB3STYLEPACK tests
 * - Monitoring performance metrics
 * - Controlling visualization parameters
 * - Analyzing system state
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";
import puppeteer, { Browser, Page } from "puppeteer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// VIB3STYLEPACK test state
let browser: Browser | null = null;
let page: Page | null = null;
let vib3BaseUrl = "http://localhost:8000";
let testResults: any = {};

// Helper to ensure browser is initialized
async function ensureBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false, // Show browser for visual testing
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  if (!page) {
    page = await browser.newPage();
    
    // Set up console logging from the page
    page.on('console', msg => {
      console.log(`[VIB3 Browser]: ${msg.text()}`);
    });
    
    page.on('error', err => {
      console.error(`[VIB3 Browser Error]: ${err.message}`);
    });
  }
  return { browser, page };
}

// Create MCP server
const server = new Server(
  {
    name: "vib3stylepack-mcp",
    version: "1.0.0"
  },
  {
    capabilities: {
      resources: {},
      tools: {}
    }
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "start_vib3_test",
        description: "Start VIB3STYLEPACK visualization system test",
        inputSchema: {
          type: "object",
          properties: {
            testFile: {
              type: "string",
              description: "HTML test file to load (default: comprehensive-mcp-vib3-test.html)"
            },
            baseUrl: {
              type: "string", 
              description: "Base URL for VIB3STYLEPACK server (default: http://localhost:8000)"
            }
          }
        }
      },
      {
        name: "test_vib3_phase",
        description: "Test a specific VIB3STYLEPACK phase (1-8)",
        inputSchema: {
          type: "object",
          properties: {
            phase: {
              type: "number",
              description: "Phase number to test (1-8)"
            }
          },
          required: ["phase"]
        }
      },
      {
        name: "get_vib3_metrics",
        description: "Get current VIB3STYLEPACK performance metrics",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "control_vib3_parameters",
        description: "Control VIB3STYLEPACK shader parameters",
        inputSchema: {
          type: "object",
          properties: {
            parameters: {
              type: "object",
              description: "Shader parameters to update (e.g., u_dimension, u_morphFactor)"
            }
          },
          required: ["parameters"]
        }
      },
      {
        name: "trigger_vib3_interaction",
        description: "Trigger VIB3STYLEPACK interaction events",
        inputSchema: {
          type: "object",
          properties: {
            interaction: {
              type: "string",
              enum: ["click", "scroll", "mousemove", "phase_transition"],
              description: "Type of interaction to trigger"
            },
            data: {
              type: "object",
              description: "Additional interaction data"
            }
          },
          required: ["interaction"]
        }
      },
      {
        name: "analyze_vib3_state",
        description: "Analyze current VIB3STYLEPACK system state",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "run_vib3_test_suite",
        description: "Run complete VIB3STYLEPACK test suite",
        inputSchema: {
          type: "object",
          properties: {
            phases: {
              type: "array",
              items: { type: "number" },
              description: "Specific phases to test (default: all)"
            }
          }
        }
      },
      {
        name: "close_vib3_test",
        description: "Close VIB3STYLEPACK test and cleanup",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "screenshot_live_site",
        description: "Take a screenshot of the live VIB34D hypercube navigation site",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to screenshot (default: https://domusgpt.github.io/vib34d-hypercube-navigation/)",
              default: "https://domusgpt.github.io/vib34d-hypercube-navigation/"
            },
            waitTime: {
              type: "number",
              description: "Time to wait in seconds before screenshot (default: 5)",
              default: 5
            },
            element: {
              type: "string",
              description: "CSS selector of specific element to screenshot (optional)"
            },
            fullPage: {
              type: "boolean",
              description: "Take full page screenshot (default: true)",
              default: true
            }
          }
        }
      },
      {
        name: "debug_live_site",
        description: "Debug the live site: check WebGL canvases, console errors, element visibility",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to debug (default: https://domusgpt.github.io/vib34d-hypercube-navigation/)",
              default: "https://domusgpt.github.io/vib34d-hypercube-navigation/"
            }
          }
        }
      },
      {
        name: "test_live_site_interactions",
        description: "Test various interactions on the live site (drag from edges, navigation clicks)",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to test (default: https://domusgpt.github.io/vib34d-hypercube-navigation/)",
              default: "https://domusgpt.github.io/vib34d-hypercube-navigation/"
            },
            interactions: {
              type: "array",
              items: {
                type: "string",
                enum: ["drag_top", "drag_bottom", "drag_left", "drag_right", "click_nav", "scroll_test"]
              },
              description: "Which interactions to test (default: all)",
              default: ["drag_top", "drag_bottom", "drag_left", "drag_right", "click_nav", "scroll_test"]
            }
          }
        }
      },
      {
        name: "inspect_live_site_elements",
        description: "Inspect specific elements on the live site for content and styling issues",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to inspect (default: https://domusgpt.github.io/vib34d-hypercube-navigation/)",
              default: "https://domusgpt.github.io/vib34d-hypercube-navigation/"
            },
            selectors: {
              type: "array",
              items: { type: "string" },
              description: "CSS selectors to inspect (default: common elements)",
              default: ["canvas", ".face", ".nav-item", ".content-section", "[data-face]"]
            }
          }
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "start_vib3_test": {
      const { testFile = "comprehensive-mcp-vib3-test.html", baseUrl = vib3BaseUrl } = request.params.arguments as any;
      
      try {
        const { page } = await ensureBrowser();
        
        const url = `${baseUrl}/${testFile}`;
        console.log(`Loading VIB3STYLEPACK test: ${url}`);
        
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for VIB3 system to initialize
        await page.waitForFunction(() => {
          return window.hasOwnProperty('vib3System') || window.hasOwnProperty('VIB34D_Phase7');
        }, { timeout: 10000 });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "VIB3STYLEPACK test started successfully",
              url: url,
              timestamp: new Date().toISOString()
            }, null, 2)
          }]
        };
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to start VIB3 test: ${error.message}`
        );
      }
    }
    
    case "test_vib3_phase": {
      const { phase } = request.params.arguments as any;
      
      if (!page) {
        throw new McpError(ErrorCode.InvalidRequest, "VIB3 test not started");
      }
      
      try {
        const result = await page.evaluate(async (phaseNum) => {
          // Test specific phase
          const results: any = { phase: phaseNum, tests: [] };
          
          switch (phaseNum) {
            case 1: // Core Architecture
              if ((window as any).VIB34D_Phase1) {
                results.tests.push({ 
                  name: "HypercubeCore", 
                  available: !!(window as any).VIB34D_Phase1.HypercubeCore 
                });
              }
              break;
              
            case 2: // Geometry Implementations
              if ((window as any).VIB34D_Phase2) {
                const geometries = ['Hypercube', 'Hypersphere', 'Hypertetrahedron', 'Torus', 'KleinBottle', 'Fractal', 'Wave', 'Crystal'];
                geometries.forEach(geom => {
                  results.tests.push({
                    name: `${geom}Geometry`,
                    available: !!(window as any).VIB34D_Phase2[`${geom}Geometry`]
                  });
                });
              }
              break;
              
            case 3: // Projection System
              if ((window as any).VIB34D_Phase3) {
                results.tests.push({ 
                  name: "ProjectionManager", 
                  available: !!(window as any).VIB34D_Phase3.ProjectionManager 
                });
              }
              break;
              
            case 4: // Shader Uniforms
              if ((window as any).VIB34D_Phase4) {
                results.tests.push({ 
                  name: "EnhancedShaderManager", 
                  available: !!(window as any).VIB34D_Phase4.EnhancedShaderManager 
                });
              }
              break;
              
            case 5: // Interaction Integration
              if ((window as any).VIB34D_Phase5) {
                results.tests.push({ 
                  name: "VIB34DInteractionEngine", 
                  available: !!(window as any).VIB34D_Phase5.VIB34DInteractionEngine 
                });
              }
              break;
              
            case 6: // Chromatic Integration
              if ((window as any).VIB34D_Phase6) {
                results.tests.push({ 
                  name: "VIB34DChromaticParameterBridge", 
                  available: !!(window as any).VIB34D_Phase6.VIB34DChromaticParameterBridge 
                });
              }
              break;
              
            case 7: // VIB3 Integration
              if ((window as any).VIB34D_Phase7) {
                results.tests.push({ 
                  name: "VIB34DVIb3IntegrationBridge", 
                  available: !!(window as any).VIB34D_Phase7.VIB34DVIb3IntegrationBridge 
                });
              }
              break;
              
            case 8: // Editor Dashboard
              results.tests.push({ 
                name: "EditorDashboard", 
                available: document.querySelector('.editor-dashboard') !== null 
              });
              break;
          }
          
          results.success = results.tests.every((t: any) => t.available);
          return results;
          
        }, phase);
        
        testResults[`phase${phase}`] = result;
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to test phase ${phase}: ${error.message}`
        );
      }
    }
    
    case "get_vib3_metrics": {
      if (!page) {
        throw new McpError(ErrorCode.InvalidRequest, "VIB3 test not started");
      }
      
      try {
        const metrics = await page.evaluate(() => {
          const getMetricValue = (id: string) => {
            const element = document.getElementById(id);
            return element ? element.textContent : '--';
          };
          
          return {
            fps: getMetricValue('vib3-fps'),
            latency: getMetricValue('mcp-latency'),
            parseAccuracy: getMetricValue('parse-accuracy'),
            integrationHealth: getMetricValue('integration-health'),
            totalParses: getMetricValue('total-parses'),
            successRate: getMetricValue('success-rate'),
            timestamp: new Date().toISOString()
          };
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(metrics, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to get metrics: ${error.message}`
        );
      }
    }
    
    case "control_vib3_parameters": {
      const { parameters } = request.params.arguments as any;
      
      if (!page) {
        throw new McpError(ErrorCode.InvalidRequest, "VIB3 test not started");
      }
      
      try {
        const result = await page.evaluate((params) => {
          if (!(window as any).vib3System) {
            return { success: false, error: "VIB3 system not initialized" };
          }
          
          try {
            (window as any).vib3System.hypercubeCore.updateParameters(params);
            return { 
              success: true, 
              message: "Parameters updated",
              parameters: params 
            };
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        }, parameters);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to control parameters: ${error.message}`
        );
      }
    }
    
    case "trigger_vib3_interaction": {
      const { interaction, data = {} } = request.params.arguments as any;
      
      if (!page) {
        throw new McpError(ErrorCode.InvalidRequest, "VIB3 test not started");
      }
      
      try {
        const result = await page.evaluate((type, interactionData) => {
          switch (type) {
            case 'click':
              const clickBtn = document.querySelector('button[onclick="triggerInteraction()"]') as HTMLButtonElement;
              if (clickBtn) clickBtn.click();
              break;
              
            case 'scroll':
              window.scrollBy(0, interactionData.delta || 100);
              break;
              
            case 'mousemove':
              const event = new MouseEvent('mousemove', {
                clientX: interactionData.x || 100,
                clientY: interactionData.y || 100
              });
              document.dispatchEvent(event);
              break;
              
            case 'phase_transition':
              const phaseBtn = document.querySelector('button[onclick="testPhaseTransition()"]') as HTMLButtonElement;
              if (phaseBtn) phaseBtn.click();
              break;
          }
          
          return { 
            success: true, 
            interaction: type,
            timestamp: new Date().toISOString()
          };
        }, interaction, data);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to trigger interaction: ${error.message}`
        );
      }
    }
    
    case "analyze_vib3_state": {
      if (!page) {
        throw new McpError(ErrorCode.InvalidRequest, "VIB3 test not started");
      }
      
      try {
        const analysis = await page.evaluate(() => {
          const results: any = {
            systemInitialized: false,
            availablePhases: [],
            currentState: null,
            errors: []
          };
          
          // Check system initialization
          if ((window as any).vib3System) {
            results.systemInitialized = true;
            
            try {
              results.currentState = (window as any).vib3System.getSystemAnalysis();
            } catch (e: any) {
              results.errors.push(`Failed to get system analysis: ${e.message}`);
            }
          }
          
          // Check available phases
          for (let i = 1; i <= 8; i++) {
            if ((window as any)[`VIB34D_Phase${i}`]) {
              results.availablePhases.push(i);
            }
          }
          
          // Check for console errors
          const errorElements = document.querySelectorAll('.log-error');
          errorElements.forEach((el) => {
            results.errors.push(el.textContent);
          });
          
          return results;
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(analysis, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to analyze state: ${error.message}`
        );
      }
    }
    
    case "run_vib3_test_suite": {
      const { phases = [1, 2, 3, 4, 5, 6, 7, 8] } = request.params.arguments as any;
      
      if (!page) {
        throw new McpError(ErrorCode.InvalidRequest, "VIB3 test not started");
      }
      
      try {
        const results: any = {
          timestamp: new Date().toISOString(),
          phases: {},
          summary: { total: 0, passed: 0, failed: 0 }
        };
        
        // Test each phase
        for (const phase of phases) {
          const phaseResult = await page.evaluate(async (phaseNum) => {
            // Same logic as test_vib3_phase but simplified
            return { phase: phaseNum, success: !!(window as any)[`VIB34D_Phase${phaseNum}`] };
          }, phase);
          
          results.phases[`phase${phase}`] = phaseResult;
          results.summary.total++;
          if (phaseResult.success) {
            results.summary.passed++;
          } else {
            results.summary.failed++;
          }
        }
        
        // Test interactions
        await page.evaluate(() => {
          // Initialize if not already
          const initBtn = document.querySelector('button[onclick="initVIB3()"]') as HTMLButtonElement;
          if (initBtn) initBtn.click();
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for init
        
        // Get final metrics
        const metrics = await page.evaluate(() => {
          const getMetricValue = (id: string) => {
            const element = document.getElementById(id);
            return element ? element.textContent : '--';
          };
          
          return {
            fps: getMetricValue('vib3-fps'),
            integrationHealth: getMetricValue('integration-health')
          };
        });
        
        results.finalMetrics = metrics;
        testResults.fullSuite = results;
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(results, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to run test suite: ${error.message}`
        );
      }
    }
    
    case "close_vib3_test": {
      try {
        if (page) {
          await page.close();
          page = null;
        }
        if (browser) {
          await browser.close();
          browser = null;
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "VIB3STYLEPACK test closed",
              testResults: testResults
            }, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to close test: ${error.message}`
        );
      }
    }
    
    case "screenshot_live_site": {
      const { 
        url = "https://domusgpt.github.io/vib34d-hypercube-navigation/", 
        waitTime = 5, 
        element, 
        fullPage = true 
      } = request.params.arguments as any;
      
      try {
        const { page } = await ensureBrowser();
        
        console.log(`Taking screenshot of: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for the specified time to let WebGL/animations load
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        
        // Take screenshot
        const screenshotOptions: any = {
          type: 'png',
          fullPage: fullPage
        };
        
        let screenshot;
        if (element) {
          const elementHandle = await page.$(element);
          if (elementHandle) {
            screenshot = await elementHandle.screenshot(screenshotOptions);
          } else {
            throw new Error(`Element not found: ${element}`);
          }
        } else {
          screenshot = await page.screenshot(screenshotOptions);
        }
        
        // Save screenshot to file
        const fs = await import('fs/promises');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshot_${timestamp}.png`;
        const filepath = join(process.cwd(), filename);
        
        await fs.writeFile(filepath, screenshot);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Screenshot taken successfully",
              url: url,
              filepath: filepath,
              timestamp: new Date().toISOString(),
              waitTime: waitTime,
              element: element || "full page",
              fullPage: fullPage
            }, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to take screenshot: ${error.message}`
        );
      }
    }
    
    case "debug_live_site": {
      const { url = "https://domusgpt.github.io/vib34d-hypercube-navigation/" } = request.params.arguments as any;
      
      try {
        const { page } = await ensureBrowser();
        
        console.log(`Debugging live site: ${url}`);
        
        // Capture console messages
        const consoleMessages: any[] = [];
        page.on('console', msg => {
          consoleMessages.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
          });
        });
        
        // Capture errors
        const errors: any[] = [];
        page.on('error', err => {
          errors.push({
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
          });
        });
        
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for site to load and execute
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Debug information
        const debugInfo = await page.evaluate(() => {
          const results: any = {
            webglSupport: false,
            canvases: [],
            visibleElements: {},
            computedStyles: {},
            documentReady: document.readyState,
            errors: []
          };
          
          // Check WebGL support
          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            results.webglSupport = !!gl;
            if (gl) {
              results.webglInfo = {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION)
              };
            }
          } catch (e: any) {
            results.errors.push(`WebGL check failed: ${e.message}`);
          }
          
          // Check all canvases
          const canvases = document.querySelectorAll('canvas');
          canvases.forEach((canvas, index) => {
            const rect = canvas.getBoundingClientRect();
            results.canvases.push({
              index,
              id: canvas.id,
              className: canvas.className,
              width: canvas.width,
              height: canvas.height,
              displayWidth: rect.width,
              displayHeight: rect.height,
              visible: rect.width > 0 && rect.height > 0,
              contextType: canvas.getContext('webgl') ? 'webgl' : 
                          canvas.getContext('2d') ? '2d' : 'none'
            });
          });
          
          // Check key elements
          const selectors = ['.face', '.nav-item', '.content-section', '[data-face]', '.hypercube-container'];
          selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            results.visibleElements[selector] = {
              count: elements.length,
              visible: Array.from(elements).map(el => {
                const rect = el.getBoundingClientRect();
                return {
                  hasContent: el.textContent?.trim().length > 0,
                  visible: rect.width > 0 && rect.height > 0,
                  rect: {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left
                  }
                };
              })
            };
          });
          
          // Check for common styling issues
          const body = document.body;
          if (body) {
            const bodyStyle = getComputedStyle(body);
            results.computedStyles.body = {
              display: bodyStyle.display,
              visibility: bodyStyle.visibility,
              overflow: bodyStyle.overflow,
              backgroundColor: bodyStyle.backgroundColor
            };
          }
          
          return results;
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              url: url,
              timestamp: new Date().toISOString(),
              debugInfo: debugInfo,
              consoleMessages: consoleMessages,
              errors: errors
            }, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to debug live site: ${error.message}`
        );
      }
    }
    
    case "test_live_site_interactions": {
      const { 
        url = "https://domusgpt.github.io/vib34d-hypercube-navigation/",
        interactions = ["drag_top", "drag_bottom", "drag_left", "drag_right", "click_nav", "scroll_test"]
      } = request.params.arguments as any;
      
      try {
        const { page } = await ensureBrowser();
        
        console.log(`Testing interactions on: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for site to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const testResults: any = {
          url: url,
          timestamp: new Date().toISOString(),
          interactions: {}
        };
        
        for (const interaction of interactions) {
          console.log(`Testing interaction: ${interaction}`);
          
          try {
            switch (interaction) {
              case "drag_top":
                await page.mouse.move(window.innerWidth / 2, 10);
                await page.mouse.down();
                await page.mouse.move(window.innerWidth / 2, 100);
                await page.mouse.up();
                break;
                
              case "drag_bottom":
                await page.mouse.move(window.innerWidth / 2, window.innerHeight - 10);
                await page.mouse.down();
                await page.mouse.move(window.innerWidth / 2, window.innerHeight - 100);
                await page.mouse.up();
                break;
                
              case "drag_left":
                await page.mouse.move(10, window.innerHeight / 2);
                await page.mouse.down();
                await page.mouse.move(100, window.innerHeight / 2);
                await page.mouse.up();
                break;
                
              case "drag_right":
                await page.mouse.move(window.innerWidth - 10, window.innerHeight / 2);
                await page.mouse.down();
                await page.mouse.move(window.innerWidth - 100, window.innerHeight / 2);
                await page.mouse.up();
                break;
                
              case "click_nav":
                const navElements = await page.$$('.nav-item, [data-face]');
                if (navElements.length > 0) {
                  await navElements[0].click();
                }
                break;
                
              case "scroll_test":
                await page.evaluate(() => {
                  window.scrollBy(0, 100);
                });
                break;
            }
            
            // Wait a bit after each interaction
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if anything changed
            const postInteractionState = await page.evaluate(() => {
              return {
                scrollTop: window.scrollY,
                activeElement: document.activeElement?.tagName,
                visibleCanvases: Array.from(document.querySelectorAll('canvas')).filter(c => {
                  const rect = c.getBoundingClientRect();
                  return rect.width > 0 && rect.height > 0;
                }).length
              };
            });
            
            testResults.interactions[interaction] = {
              success: true,
              postState: postInteractionState,
              timestamp: new Date().toISOString()
            };
            
          } catch (error: any) {
            testResults.interactions[interaction] = {
              success: false,
              error: error.message,
              timestamp: new Date().toISOString()
            };
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(testResults, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to test interactions: ${error.message}`
        );
      }
    }
    
    case "inspect_live_site_elements": {
      const { 
        url = "https://domusgpt.github.io/vib34d-hypercube-navigation/",
        selectors = ["canvas", ".face", ".nav-item", ".content-section", "[data-face]"]
      } = request.params.arguments as any;
      
      try {
        const { page } = await ensureBrowser();
        
        console.log(`Inspecting elements on: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for site to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const inspection = await page.evaluate((selectorList) => {
          const results: any = {
            timestamp: new Date().toISOString(),
            elements: {}
          };
          
          selectorList.forEach((selector: string) => {
            const elements = document.querySelectorAll(selector);
            results.elements[selector] = {
              count: elements.length,
              details: Array.from(elements).map((el, index) => {
                const rect = el.getBoundingClientRect();
                const style = getComputedStyle(el);
                
                return {
                  index,
                  tagName: el.tagName,
                  id: el.id,
                  className: el.className,
                  textContent: el.textContent?.trim().substring(0, 100) || '',
                  hasTextContent: (el.textContent?.trim().length || 0) > 0,
                  rect: {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left
                  },
                  isVisible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
                  computedStyle: {
                    display: style.display,
                    visibility: style.visibility,
                    opacity: style.opacity,
                    position: style.position,
                    zIndex: style.zIndex,
                    backgroundColor: style.backgroundColor,
                    color: style.color
                  },
                  attributes: Array.from(el.attributes).reduce((acc: any, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                  }, {})
                };
              })
            };
          });
          
          return results;
        }, selectors);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(inspection, null, 2)
          }]
        };
        
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to inspect elements: ${error.message}`
        );
      }
    }
    
    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "vib3://test-results",
        name: "VIB3STYLEPACK Test Results",
        description: "Current test results from VIB3STYLEPACK testing",
        mimeType: "application/json"
      },
      {
        uri: "vib3://shader-uniforms", 
        name: "VIB3 Shader Uniforms Reference",
        description: "Complete list of 17 shader uniforms with ranges",
        mimeType: "application/json"
      },
      {
        uri: "vib3://phase-status",
        name: "VIB3 Phase Implementation Status",
        description: "Status of all 8 VIB34D phases",
        mimeType: "application/json"
      }
    ]
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  switch (uri) {
    case "vib3://test-results":
      return {
        contents: [{
          uri: uri,
          mimeType: "application/json",
          text: JSON.stringify(testResults, null, 2)
        }]
      };
      
    case "vib3://shader-uniforms":
      return {
        contents: [{
          uri: uri,
          mimeType: "application/json",
          text: JSON.stringify({
            uniforms: {
              u_resolution: { type: "vec2", description: "Canvas dimensions" },
              u_time: { type: "float", range: [0, Infinity], description: "Animation time" },
              u_mouse: { type: "vec2", range: [0, 1], description: "Mouse position normalized" },
              u_dimension: { type: "float", range: [3.0, 5.0], description: "3D to 4D+ dimension" },
              u_morphFactor: { type: "float", range: [0.0, 1.5], description: "Morph intensity" },
              u_rotationSpeed: { type: "float", range: [0.0, 3.0], description: "4D rotation speed" },
              u_gridDensity: { type: "float", range: [1.0, 25.0], description: "Lattice density" },
              u_lineThickness: { type: "float", range: [0.002, 0.1], description: "Line width" },
              u_universeModifier: { type: "float", range: [0.3, 2.5], description: "Universe scaling" },
              u_patternIntensity: { type: "float", range: [0.0, 3.0], description: "Brightness/contrast" },
              u_shellWidth: { type: "float", range: [0.005, 0.08], description: "Shell thickness" },
              u_tetraThickness: { type: "float", range: [0.003, 0.1], description: "Tetra thickness" },
              u_glitchIntensity: { type: "float", range: [0.0, 0.15], description: "RGB glitch" },
              u_colorShift: { type: "float", range: [-1.0, 1.0], description: "Hue rotation" },
              u_audioBass: { type: "float", range: [0.0, 1.0], description: "Bass/interaction" },
              u_audioMid: { type: "float", range: [0.0, 1.0], description: "Mid/morph" },
              u_audioHigh: { type: "float", range: [0.0, 1.0], description: "High/detail" }
            }
          }, null, 2)
        }]
      };
      
    case "vib3://phase-status":
      return {
        contents: [{
          uri: uri,
          mimeType: "application/json",
          text: JSON.stringify({
            phases: {
              1: { name: "Core Architecture", status: "complete", components: ["HypercubeCore", "GeometryManager", "ProjectionManager", "ShaderManager"] },
              2: { name: "Geometry Implementations", status: "complete", geometries: ["Hypercube", "Hypersphere", "Hypertetrahedron", "Torus", "KleinBottle", "Fractal", "Wave", "Crystal"] },
              3: { name: "Projection System", status: "complete", projections: ["Perspective", "Orthographic", "Stereographic"] },
              4: { name: "Shader Uniform System", status: "complete", uniforms: 17 },
              5: { name: "Interaction Integration", status: "complete", interactions: ["scroll", "click", "mouse", "energy"] },
              6: { name: "Chromatic Integration", status: "complete", features: ["color emergence", "blend modes", "parameter bridge"] },
              7: { name: "VIB3 Integration", status: "complete", features: ["HomeMaster bridge", "blog integration", "section mapping"] },
              8: { name: "Editor Dashboard", status: "ready", features: ["parameter control", "preset management", "performance monitoring"] }
            }
          }, null, 2)
        }]
      };
      
    default:
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Unknown resource: ${uri}`
      );
  }
});

// Start server
async function main() {
  console.log("🚀 Starting VIB3STYLEPACK MCP Server...");
  console.log("📡 Ready to test VIB3STYLEPACK 4D visualization system");
  console.log("🛠️ Tools available: start_vib3_test, test_vib3_phase, get_vib3_metrics, etc.");
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Cleanup on exit
  process.on('SIGINT', async () => {
    console.log("\n🛑 Shutting down VIB3STYLEPACK MCP Server...");
    if (page) await page.close();
    if (browser) await browser.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});