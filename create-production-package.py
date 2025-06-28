#!/usr/bin/env python3
"""
VIB34D Professional Dashboard Production Package Creator
Creates optimized deployment packages with all necessary files
"""

import os
import shutil
import json
import time
import zipfile
import hashlib
from pathlib import Path

class VIB34DProductionPackager:
    """Creates production-ready deployment packages"""
    
    def __init__(self, source_dir='.', output_dir='production-package'):
        self.source_dir = Path(source_dir)
        self.output_dir = Path(output_dir)
        self.package_info = {
            'name': 'VIB34D Professional Dashboard',
            'version': '1.0.0',
            'created': time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime()),
            'description': 'Professional hypercube navigation dashboard with WebGL visualizers',
            'features': [
                '8-cell hypercube navigation',
                '33+ WebGL visualizers',
                'JSON configuration system',
                'Real-time reactivity',
                'Production-ready server'
            ]
        }
    
    def create_directory_structure(self):
        """Create clean production directory structure"""
        print('📁 Creating production directory structure...')
        
        # Remove existing output directory
        if self.output_dir.exists():
            shutil.rmtree(self.output_dir)
        
        # Create main directories
        directories = [
            'assets',
            'config',
            'core',
            'documentation',
            'scripts',
            'styles',
            'tests'
        ]
        
        for directory in directories:
            (self.output_dir / directory).mkdir(parents=True, exist_ok=True)
        
        print('✅ Directory structure created')
    
    def copy_core_files(self):
        """Copy essential core files"""
        print('📋 Copying core files...')
        
        # Core JavaScript files
        core_files = [
            'core/DragScrollHandler.js',
            'core/VIB3HomeMaster.js',
            'core/UnifiedReactivityBridge.js',
            'core/ShaderManager.js',
            'core/HypercubeCore.js',
            'core/GeometryManager.js',
            'core/ProjectionManager.js',
            'core/ReactiveHyperAVCore.js',
            'core/SemanticReactivityEngine.js',
            'core/VIB3StyleSystem.js'
        ]
        
        for file_path in core_files:
            source = self.source_dir / file_path
            dest = self.output_dir / file_path
            if source.exists():
                shutil.copy2(source, dest)
                print(f'   ✅ {file_path}')
            else:
                print(f'   ⚠️ Missing: {file_path}')
        
        # Additional core files
        additional_files = [
            'VIB3_JSON_CONFIG_SYSTEM.js',
            'VIB3_COMPREHENSIVE_ENHANCEMENT_SYSTEM.js',
            'VIB3_UNIFIED_EFFECTS_SYSTEM.js'
        ]
        
        for file_name in additional_files:
            source = self.source_dir / file_name
            if source.exists():
                shutil.copy2(source, self.output_dir / 'core' / file_name)
                print(f'   ✅ {file_name}')
    
    def copy_dashboard_files(self):
        """Copy main dashboard HTML files"""
        print('🌐 Copying dashboard files...')
        
        dashboard_files = [
            'index_VIB34D_PROFESSIONAL.html',
            'index_COMPLETE_SYSTEM.html',
            'desktop-demo.html',
            'VIB34D_EDITOR_DASHBOARD.html'
        ]
        
        for file_name in dashboard_files:
            source = self.source_dir / file_name
            if source.exists():
                # Copy to root of package
                shutil.copy2(source, self.output_dir / file_name)
                print(f'   ✅ {file_name}')
                
                # Create symlink for main dashboard
                if file_name == 'index_VIB34D_PROFESSIONAL.html':
                    index_path = self.output_dir / 'index.html'
                    if index_path.exists():
                        index_path.unlink()
                    shutil.copy2(source, index_path)
                    print(f'   ✅ index.html (main entry point)')
    
    def copy_configuration_files(self):
        """Copy and optimize configuration files"""
        print('⚙️ Copying configuration files...')
        
        config_files = [
            'config/visuals.json',
            'config/behavior.json', 
            'config/content.json',
            'config/dashboard-config.json'
        ]
        
        for file_path in config_files:
            source = self.source_dir / file_path
            dest = self.output_dir / file_path
            
            if source.exists():
                # Copy and validate JSON
                try:
                    with open(source, 'r') as f:
                        config_data = json.load(f)
                    
                    # Write minimized JSON
                    with open(dest, 'w') as f:
                        json.dump(config_data, f, separators=(',', ':'))
                    
                    print(f'   ✅ {file_path} (validated and minimized)')
                except json.JSONDecodeError as e:
                    print(f'   ❌ {file_path} - Invalid JSON: {e}')
            else:
                print(f'   ⚠️ Missing: {file_path}')
    
    def copy_style_files(self):
        """Copy style and CSS files"""
        print('🎨 Copying style files...')
        
        style_files = [
            'VIB3_UNIFIED_EFFECTS.css'
        ]
        
        for file_name in style_files:
            source = self.source_dir / file_name
            if source.exists():
                shutil.copy2(source, self.output_dir / 'styles' / file_name)
                print(f'   ✅ {file_name}')
    
    def copy_server_files(self):
        """Copy production server files"""
        print('🚀 Copying server files...')
        
        server_files = [
            'production-server.py',
            'package.json'
        ]
        
        for file_name in server_files:
            source = self.source_dir / file_name
            if source.exists():
                shutil.copy2(source, self.output_dir / file_name)
                print(f'   ✅ {file_name}')
    
    def copy_test_files(self):
        """Copy testing files"""
        print('🧪 Copying test files...')
        
        test_files = [
            'test-production-system.js'
        ]
        
        for file_name in test_files:
            source = self.source_dir / file_name
            if source.exists():
                shutil.copy2(source, self.output_dir / 'tests' / file_name)
                print(f'   ✅ {file_name}')
    
    def create_launcher_scripts(self):
        """Create cross-platform launcher scripts"""
        print('🚀 Creating launcher scripts...')
        
        # Windows batch file
        windows_script = self.output_dir / 'launch-dashboard.bat'
        with open(windows_script, 'w') as f:
            f.write('''@echo off
echo Starting VIB34D Professional Dashboard...
echo =========================================

python production-server.py
pause
''')
        print('   ✅ launch-dashboard.bat')
        
        # Unix shell script
        unix_script = self.output_dir / 'launch-dashboard.sh'
        with open(unix_script, 'w') as f:
            f.write('''#!/bin/bash
echo "Starting VIB34D Professional Dashboard..."
echo "========================================="

python3 production-server.py
''')
        os.chmod(unix_script, 0o755)
        print('   ✅ launch-dashboard.sh')
        
        # Quick test script
        test_script = self.output_dir / 'run-tests.sh'
        with open(test_script, 'w') as f:
            f.write('''#!/bin/bash
echo "Running VIB34D Production Tests..."
echo "=================================="

cd tests
node test-production-system.js
''')
        os.chmod(test_script, 0o755)
        print('   ✅ run-tests.sh')
    
    def create_single_file_version(self):
        """Create a single-file HTML version for easy deployment"""
        print('📄 Creating single-file version...')
        
        try:
            # Read main HTML file
            main_html_path = self.output_dir / 'index_VIB34D_PROFESSIONAL.html'
            if not main_html_path.exists():
                print('   ⚠️ Main HTML file not found, skipping single-file version')
                return
            
            with open(main_html_path, 'r') as f:
                html_content = f.read()
            
            # Read core JavaScript files
            core_scripts = []
            script_files = [
                'core/DragScrollHandler.js',
                'core/VIB3HomeMaster.js',
                'core/UnifiedReactivityBridge.js',
                'core/ShaderManager.js',
                'core/HypercubeCore.js',
                'core/GeometryManager.js',
                'core/ProjectionManager.js',
                'core/ReactiveHyperAVCore.js'
            ]
            
            for script_file in script_files:
                script_path = self.output_dir / script_file
                if script_path.exists():
                    with open(script_path, 'r') as f:
                        core_scripts.append(f'// {script_file}\n{f.read()}\n')
            
            # Read CSS files
            css_content = ''
            css_files = ['styles/VIB3_UNIFIED_EFFECTS.css']
            for css_file in css_files:
                css_path = self.output_dir / css_file
                if css_path.exists():
                    with open(css_path, 'r') as f:
                        css_content += f.read()
            
            # Read configuration files
            config_scripts = []
            config_files = ['config/visuals.json', 'config/behavior.json', 'config/content.json']
            for config_file in config_files:
                config_path = self.output_dir / config_file
                if config_path.exists():
                    with open(config_path, 'r') as f:
                        config_data = f.read()
                        config_name = Path(config_file).stem
                        config_scripts.append(f'window.{config_name}Config = {config_data};')
            
            # Create embedded version
            single_file_content = html_content.replace(
                '</head>',
                f'''
    <!-- Embedded CSS -->
    <style>
    {css_content}
    </style>
    
    <!-- Embedded Configuration -->
    <script>
    {chr(10).join(config_scripts)}
    </script>
</head>'''
            )
            
            # Replace script imports with embedded scripts
            script_imports = [
                '<script src="./core/DragScrollHandler.js"></script>',
                '<script src="./core/VIB3HomeMaster.js" type="module"></script>',
                '<script src="./core/UnifiedReactivityBridge.js" type="module"></script>',
                '<script src="./core/ShaderManager.js" type="module"></script>',
                '<script src="./core/HypercubeCore.js" type="module"></script>',
                '<script src="./core/GeometryManager.js" type="module"></script>',
                '<script src="./core/ProjectionManager.js" type="module"></script>',
                '<script src="VIB3_JSON_CONFIG_SYSTEM.js"></script>'
            ]
            
            embedded_scripts = f'''
    <!-- Embedded Core Scripts -->
    <script>
    {chr(10).join(core_scripts)}
    </script>'''
            
            for script_import in script_imports:
                single_file_content = single_file_content.replace(script_import, '')
            
            single_file_content = single_file_content.replace(
                '<!-- Load Core Systems (copied from backup architecture) -->',
                embedded_scripts
            )
            
            # Save single file version
            single_file_path = self.output_dir / 'vib34d-dashboard-standalone.html'
            with open(single_file_path, 'w') as f:
                f.write(single_file_content)
            
            print(f'   ✅ vib34d-dashboard-standalone.html ({len(single_file_content):,} bytes)')
            
        except Exception as e:
            print(f'   ❌ Error creating single-file version: {e}')
    
    def create_documentation(self):
        """Create comprehensive documentation"""
        print('📚 Creating documentation...')
        
        # README.md
        readme_content = f'''# VIB34D Professional Dashboard

A sophisticated hypercube navigation interface with WebGL visualizers and real-time reactivity.

## Features

- **8-Cell Hypercube Navigation**: Navigate through 8 different content faces
- **33+ WebGL Visualizers**: Advanced shader-based visual effects
- **JSON Configuration**: Fully configurable content, behavior, and visuals
- **Real-time Reactivity**: Unified parameter system with live updates
- **Production Ready**: Optimized server and deployment tools

## Quick Start

### Option 1: Server-based (Recommended)
```bash
# Windows
launch-dashboard.bat

# macOS/Linux
./launch-dashboard.sh
```

### Option 2: Single File
Open `vib34d-dashboard-standalone.html` in a modern browser with WebGL support.

## Navigation

- **Edge Bezels**: Click or drag the edge bezels to navigate between faces
- **Faces**: Each face contains unique content and layout
- **Cards**: Hover over cards for interactive visual effects

## System Requirements

- Modern web browser with WebGL support
- Hardware acceleration enabled
- Python 3.6+ (for server mode)
- Node.js (for testing)

## Configuration

Edit JSON files in the `config/` directory:

- `visuals.json` - Visual effects and styling
- `behavior.json` - Interaction behaviors and timing
- `content.json` - Content data and structure
- `dashboard-config.json` - Dashboard-specific settings

## Testing

Run the production test suite:
```bash
./run-tests.sh
```

## Package Contents

- `index.html` - Main dashboard entry point
- `core/` - Core JavaScript modules
- `config/` - Configuration files
- `production-server.py` - Production HTTP server
- `vib34d-dashboard-standalone.html` - Single-file version
- `tests/` - Test suite
- `documentation/` - Additional documentation

## Technical Details

### Architecture
- **VIB3HomeMaster**: Central parameter authority
- **UnifiedReactivityBridge**: Multi-layer synchronization
- **ReactiveHyperAVCore**: WebGL visualization engine
- **HypercubeCore**: 4D navigation system

### Performance
- 60+ FPS with hardware acceleration
- Optimized shader compilation
- Lazy loading of visualizers
- Memory efficient WebGL contexts

## Support

For issues or questions, please check the documentation in the `documentation/` folder.

---

**Created**: {self.package_info['created']}  
**Version**: {self.package_info['version']}
'''
        
        with open(self.output_dir / 'README.md', 'w') as f:
            f.write(readme_content)
        print('   ✅ README.md')
        
        # Installation guide
        install_guide = '''# Installation Guide

## Prerequisites

1. **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
2. **WebGL Support**: Ensure hardware acceleration is enabled
3. **Python 3.6+**: For running the production server
4. **Node.js**: For running tests (optional)

## Installation Steps

### 1. Download and Extract
Extract the VIB34D dashboard package to your desired location.

### 2. Verify WebGL Support
Open your browser and visit: `chrome://gpu/` (Chrome) or `about:support` (Firefox)
Confirm that WebGL is enabled and hardware acceleration is available.

### 3. Choose Deployment Method

#### Method A: Server Mode (Recommended)
```bash
# Navigate to the package directory
cd vib34d-professional-dashboard

# Start the server
python3 production-server.py
```

#### Method B: Single File
Double-click `vib34d-dashboard-standalone.html` or open it in your browser.

### 4. Verify Installation
- Dashboard should load with animated background
- Navigation bezels should be visible on edges
- WebGL visualizers should render smoothly
- All 8 hypercube faces should be accessible

## Troubleshooting

### WebGL Not Working
1. Enable hardware acceleration in browser settings
2. Update graphics drivers
3. Try a different browser
4. Check browser console for error messages

### Performance Issues
1. Close other browser tabs/applications
2. Reduce browser window size
3. Disable browser extensions
4. Check system resources (CPU/GPU usage)

### Navigation Issues
1. Refresh the page
2. Clear browser cache
3. Check browser console for JavaScript errors
4. Verify all files were extracted properly

## Configuration

### Basic Configuration
Edit files in the `config/` directory to customize:
- Content and layout
- Visual effects and colors
- Interaction behaviors
- Performance settings

### Advanced Configuration
Modify core JavaScript files for deeper customization:
- `core/VIB3HomeMaster.js` - Parameter management
- `core/ReactiveHyperAVCore.js` - Visual effects
- `core/HypercubeCore.js` - Navigation system

## Performance Optimization

### Browser Settings
1. Enable hardware acceleration
2. Disable unnecessary extensions
3. Close other tabs/applications
4. Use dedicated graphics card if available

### System Settings
1. Ensure adequate RAM (4GB+ recommended)
2. Update graphics drivers
3. Close resource-intensive applications
4. Use wired internet connection for best performance
'''
        
        with open(self.output_dir / 'documentation' / 'INSTALLATION.md', 'w') as f:
            f.write(install_guide)
        print('   ✅ documentation/INSTALLATION.md')
    
    def create_package_manifest(self):
        """Create package manifest and checksums"""
        print('📦 Creating package manifest...')
        
        manifest = {
            **self.package_info,
            'files': {},
            'checksums': {},
            'size_bytes': 0
        }
        
        # Calculate file checksums and sizes
        for root, dirs, files in os.walk(self.output_dir):
            for file in files:
                file_path = Path(root) / file
                relative_path = file_path.relative_to(self.output_dir)
                
                # Calculate MD5 checksum
                with open(file_path, 'rb') as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()
                
                file_size = file_path.stat().st_size
                
                manifest['files'][str(relative_path)] = {
                    'size': file_size,
                    'checksum': file_hash
                }
                manifest['size_bytes'] += file_size
        
        manifest['total_files'] = len(manifest['files'])
        manifest['size_mb'] = round(manifest['size_bytes'] / 1024 / 1024, 2)
        
        # Save manifest
        with open(self.output_dir / 'package-manifest.json', 'w') as f:
            json.dump(manifest, f, indent=2)
        
        print(f'   ✅ Package manifest: {manifest["total_files"]} files, {manifest["size_mb"]} MB')
        
        return manifest
    
    def create_zip_package(self):
        """Create compressed ZIP package"""
        print('🗜️ Creating ZIP package...')
        
        zip_path = f'vib34d-dashboard-production-{int(time.time())}.zip'
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(self.output_dir):
                for file in files:
                    file_path = Path(root) / file
                    arc_path = file_path.relative_to(self.output_dir)
                    zipf.write(file_path, arc_path)
        
        zip_size = Path(zip_path).stat().st_size
        print(f'   ✅ ZIP package: {zip_path} ({zip_size / 1024 / 1024:.1f} MB)')
        
        return zip_path
    
    def create_production_package(self):
        """Create complete production package"""
        print('🚀 Creating VIB34D Professional Dashboard Production Package')
        print('============================================================\n')
        
        start_time = time.time()
        
        try:
            # Create directory structure
            self.create_directory_structure()
            
            # Copy all necessary files
            self.copy_core_files()
            self.copy_dashboard_files()
            self.copy_configuration_files()
            self.copy_style_files()
            self.copy_server_files()
            self.copy_test_files()
            
            # Create additional files
            self.create_launcher_scripts()
            self.create_single_file_version()
            self.create_documentation()
            
            # Create manifest and package
            manifest = self.create_package_manifest()
            zip_path = self.create_zip_package()
            
            end_time = time.time()
            duration = end_time - start_time
            
            print(f'\n🌟 Production package created successfully!')
            print(f'📁 Package directory: {self.output_dir}')
            print(f'📦 ZIP package: {zip_path}')
            print(f'⏱️ Build time: {duration:.1f} seconds')
            print(f'📊 Package size: {manifest["size_mb"]} MB')
            print(f'📄 Total files: {manifest["total_files"]}')
            
            return {
                'directory': str(self.output_dir),
                'zip_file': zip_path,
                'manifest': manifest,
                'build_time': duration
            }
            
        except Exception as e:
            print(f'❌ Package creation failed: {e}')
            raise

def main():
    """Main entry point"""
    packager = VIB34DProductionPackager()
    result = packager.create_production_package()
    
    print('\n✅ Production package ready for deployment!')
    print('\n🚀 Quick Start:')
    print(f'   cd {result["directory"]}')
    print('   python3 production-server.py')

if __name__ == '__main__':
    main()