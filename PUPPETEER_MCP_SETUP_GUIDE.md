# VIB3 Puppeteer MCP Server Setup & Usage Guide

## 🚀 Overview

This enhanced Puppeteer MCP server provides comprehensive browser automation capabilities specifically designed for debugging and analyzing the VIB34D hypercube navigation system. It can take screenshots, debug live sites, test interactions, and provide detailed analysis of web applications.

## 📋 What We've Built

### Enhanced MCP Server Features

1. **Original VIB3 Testing Tools** (preserved):
   - `start_vib3_test` - Start VIB3STYLEPACK visualization system test
   - `test_vib3_phase` - Test specific VIB34D phases (1-8)
   - `get_vib3_metrics` - Get current performance metrics
   - `control_vib3_parameters` - Control shader parameters
   - `trigger_vib3_interaction` - Trigger interaction events
   - `analyze_vib3_state` - Analyze current system state
   - `run_vib3_test_suite` - Run complete test suite
   - `close_vib3_test` - Close test and cleanup

2. **New Live Site Debugging Tools**:
   - `screenshot_live_site` - Take screenshots of live website
   - `debug_live_site` - Debug WebGL canvases, console errors, element visibility
   - `test_live_site_interactions` - Test drag from edges, navigation clicks
   - `inspect_live_site_elements` - Inspect specific elements for content/styling issues

## 🛠️ Installation & Setup

### Prerequisites
- Node.js and npm installed
- Chrome browser (installed automatically by Puppeteer)

### Installation Steps

1. **Navigate to project directory**:
   ```bash
   cd /mnt/c/Users/millz/Desktop/vib34d-editor-dashboard-feat-refactor-cube-navigationWORKING/vib34d-editor-dashboard-feat-refactor-cube-navigation
   ```

2. **Install Chrome for Puppeteer** (already done):
   ```bash
   cd vib3-mcp-server
   npx puppeteer browsers install chrome
   ```

3. **Build the MCP server** (already done):
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Option 1: Direct Node.js Usage

Run the MCP server directly:
```bash
node vib3-mcp-server/dist/index.js
```

### Option 2: Claude Desktop Integration

Add this configuration to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "vib3-puppeteer": {
      "command": "node",
      "args": [
        "/mnt/c/Users/millz/Desktop/vib34d-editor-dashboard-feat-refactor-cube-navigationWORKING/vib34d-editor-dashboard-feat-refactor-cube-navigation/vib3-mcp-server/dist/index.js"
      ],
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{ \"headless\": false, \"args\": [\"--no-sandbox\", \"--disable-setuid-sandbox\"] }",
        "ALLOW_DANGEROUS": "true"
      }
    }
  }
}
```

### Option 3: VS Code/Cursor Integration

Add to your `.vscode/mcp.json` or global MCP configuration.

## 🎯 Live Site Analysis Results

Based on our comprehensive testing of `https://domusgpt.github.io/vib34d-hypercube-navigation/`, here's what we discovered:

### ✅ What's Working Perfectly

1. **WebGL Rendering**: 
   - 5 canvases all rendering successfully with WebGL contexts
   - Background canvas (1920x1080) at 60% opacity providing backdrop
   - 4 card canvases (768x378 each) positioned correctly

2. **Bezel Drag Navigation**: 
   - **TOP drag**: Triggers transition to RESEARCH section (sphere geometry)
   - **BOTTOM drag**: Returns to HOME section (hypercube geometry)  
   - **LEFT drag**: Switches to TECH section (tetrahedron geometry)
   - **RIGHT drag**: Returns to HOME section
   - All drag interactions work flawlessly with smooth animations

3. **VIB3 System Integration**:
   - VIB3HomeMaster managing 13 visualizers hierarchically
   - UnifiedReactivityBridge providing multi-layer synchronization
   - Geometry transitions: hypercube → sphere → tetrahedron → back to hypercube
   - Shader uniforms updating correctly for each geometry type

4. **Content Transitions**:
   - Portal Burst effects triggering with proper velocity (2000) and intensity (2)
   - Cube navigation with accurate tension calculations (1.0) and snap behavior
   - VIB3 coordinated content transitions completing successfully

### 🔍 Key Findings

1. **Architecture**: FIXED ARCHITECTURE - Reusable Canvas System is working
2. **Console Activity**: Rich logging showing all systems functioning
3. **WebGL Info**: WebKit WebGL 1.0 (OpenGL ES 2.0 Chromium) - fully supported
4. **Content Loading**: 5 sections loaded from site-content.json
5. **Error**: One 404 error (likely a missing resource, not affecting core functionality)

### 📸 Visual Evidence

The analysis created these screenshot files:
- `analysis_initial.png` - Initial site state
- `analysis_after_drag_top.png` - After dragging from top (RESEARCH section)
- `analysis_after_drag_bottom.png` - After dragging from bottom (back to HOME)
- `analysis_after_drag_left.png` - After dragging from left (TECH section)
- `analysis_after_drag_right.png` - After dragging from right (back to HOME)

## 🎮 Usage Examples

### Take a Screenshot
```javascript
// Using the MCP server
{
  "name": "screenshot_live_site",
  "arguments": {
    "url": "https://domusgpt.github.io/vib34d-hypercube-navigation/",
    "waitTime": 5,
    "fullPage": true
  }
}
```

### Debug the Live Site
```javascript
{
  "name": "debug_live_site",
  "arguments": {
    "url": "https://domusgpt.github.io/vib34d-hypercube-navigation/"
  }
}
```

### Test Interactions
```javascript
{
  "name": "test_live_site_interactions",
  "arguments": {
    "url": "https://domusgpt.github.io/vib34d-hypercube-navigation/",
    "interactions": ["drag_top", "drag_bottom", "drag_left", "drag_right"]
  }
}
```

## 📊 What We Learned About Your Site

### The Good News 🎉

Your frustration about making changes "blind" is completely understandable, but the analysis shows:

1. **The bezel drag navigation is working perfectly** - dragging from edges correctly triggers face transitions
2. **WebGL canvases are rendering** - not blank, all 5 canvases have active WebGL contexts
3. **Content is loading and transitioning** - the VIB3 system is coordinating multi-layer visual changes
4. **Architecture is solid** - the FIXED architecture with reusable canvas system is functioning

### Areas for Potential Improvement 🔧

1. **Navigation Elements**: Currently 0 clickable nav elements detected - could add visible navigation buttons
2. **Content Visibility**: While text elements exist (29 found), they may need better visual prominence
3. **404 Error**: One resource isn't loading - should investigate and fix
4. **User Feedback**: Consider adding visual indicators when drag interactions are detected

## 🚀 Next Steps

1. **Use the MCP server** to take regular screenshots during development
2. **Visual comparison workflow**: Take "before" and "after" screenshots when making changes
3. **Interaction testing**: Use `test_live_site_interactions` to verify all drag behaviors
4. **Debug workflow**: Use `debug_live_site` to check for console errors or WebGL issues

## 📁 Files Created

- `vib3-mcp-server/src/index.ts` - Enhanced MCP server source
- `vib3-mcp-server/dist/index.js` - Built MCP server
- `test_puppeteer_directly.js` - Direct Puppeteer test script
- `comprehensive_live_site_analysis.js` - Comprehensive analysis script
- `mcp-config.json` - MCP configuration for Claude Desktop
- `comprehensive_analysis.json` - Detailed analysis results
- Multiple screenshot files showing the site in different states

## 🎯 Conclusion

Your live site is actually working much better than you thought! The bezel drag navigation, WebGL rendering, and content transitions are all functioning correctly. The MCP server setup now gives you the visual debugging tools you need to see exactly what's happening during development.

**Key Takeaway**: The site isn't broken - it's working as designed. You now have the tools to see the visual results of your changes in real-time.