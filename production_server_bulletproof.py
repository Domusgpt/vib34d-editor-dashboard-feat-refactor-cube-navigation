#!/usr/bin/env python3
"""
VIB34D Professional Dashboard - Bulletproof Production Server
Creates a reliable HTTP server with proper MIME types and CORS headers
Designed specifically for serving the VIB34D dashboard with all dependencies
"""

import http.server
import socketserver
import os
import sys
import json
import mimetypes
from pathlib import Path
import threading
import time
import urllib.parse

class VIB34DServer(http.server.SimpleHTTPRequestHandler):
    """Enhanced HTTP handler for VIB34D Dashboard with proper MIME types and CORS"""
    
    def __init__(self, *args, **kwargs):
        # Add custom MIME types for modern web development
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('application/json', '.json')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('application/wasm', '.wasm')
        mimetypes.add_type('application/octet-stream', '.map')
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        """Add CORS headers and security headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Enhanced GET handler with proper routing"""
        parsed_path = urllib.parse.urlparse(self.path)
        clean_path = parsed_path.path
        
        # Route root to main dashboard
        if clean_path == '/' or clean_path == '':
            self.path = '/index_VIB34D_PROFESSIONAL.html'
        
        # Log requests for debugging
        print(f"[SERVER] Request: {clean_path} -> {self.path}")
        
        # Call parent handler
        try:
            super().do_GET()
        except Exception as e:
            print(f"[SERVER] Error serving {self.path}: {e}")
            self.send_error(500, f"Internal server error: {e}")
    
    def log_message(self, format, *args):
        """Custom logging format"""
        print(f"[{time.strftime('%H:%M:%S')}] {format % args}")

class VIB34DProductionServer:
    """Complete production server manager for VIB34D Dashboard"""
    
    def __init__(self, port=8080, directory=None):
        self.port = port
        self.directory = directory or os.getcwd()
        self.server = None
        self.server_thread = None
        self.is_running = False
        
    def verify_directory_structure(self):
        """Verify all required files exist"""
        required_files = [
            'index_VIB34D_PROFESSIONAL.html',
            'core/VIB3HomeMaster.js',
            'core/UnifiedReactivityBridge.js',
            'core/ReactiveHyperAVCore.js',
            'core/ShaderManager.js',
            'core/HypercubeCore.js',
            'core/GeometryManager.js',
            'core/ProjectionManager.js',
            'core/DragScrollHandler.js',
            'VIB3_JSON_CONFIG_SYSTEM.js'
        ]
        
        optional_files = [
            'config/visuals.json',
            'config/behavior.json', 
            'config/content.json',
            'presets/editor-dashboard-config.json',
            'site-content.json'
        ]
        
        print("🔍 Verifying VIB34D Dashboard file structure...")
        
        missing_required = []
        missing_optional = []
        
        for file_path in required_files:
            full_path = os.path.join(self.directory, file_path)
            if os.path.exists(full_path):
                size = os.path.getsize(full_path)
                print(f"  ✅ {file_path} ({size} bytes)")
            else:
                missing_required.append(file_path)
                print(f"  ❌ {file_path} (MISSING - REQUIRED)")
        
        for file_path in optional_files:
            full_path = os.path.join(self.directory, file_path)
            if os.path.exists(full_path):
                size = os.path.getsize(full_path)
                print(f"  ✅ {file_path} ({size} bytes)")
            else:
                missing_optional.append(file_path)
                print(f"  ⚠️  {file_path} (missing - optional)")
        
        if missing_required:
            print(f"\n❌ CRITICAL: {len(missing_required)} required files missing!")
            print("The VIB34D Dashboard cannot function without these files.")
            return False
        
        print(f"\n✅ All required files present!")
        if missing_optional:
            print(f"⚠️  {len(missing_optional)} optional config files missing (will use defaults)")
        
        return True
    
    def start_server(self):
        """Start the production server"""
        if self.is_running:
            print("Server is already running!")
            return False
        
        # Verify directory structure first
        if not self.verify_directory_structure():
            print("❌ Cannot start server - missing required files")
            return False
        
        # Change to the target directory
        original_dir = os.getcwd()
        os.chdir(self.directory)
        
        try:
            # Create server
            self.server = socketserver.TCPServer(("", self.port), VIB34DServer)
            self.server.allow_reuse_address = True
            
            # Start server in a thread
            self.server_thread = threading.Thread(target=self.server.serve_forever)
            self.server_thread.daemon = True
            self.server_thread.start()
            
            self.is_running = True
            
            print(f"🚀 VIB34D Production Server started successfully!")
            print(f"📁 Serving directory: {self.directory}")
            print(f"🌐 Access the dashboard at: http://localhost:{self.port}/")
            print(f"🎯 Direct link: http://localhost:{self.port}/index_VIB34D_PROFESSIONAL.html")
            print(f"⚡ Server running on port {self.port}")
            print(f"🔄 Press Ctrl+C to stop the server")
            
            return True
            
        except OSError as e:
            if e.errno == 48:  # Address already in use
                print(f"❌ Port {self.port} is already in use!")
                print(f"🔄 Try a different port or stop the existing server")
            else:
                print(f"❌ Failed to start server: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error starting server: {e}")
            return False
        finally:
            os.chdir(original_dir)
    
    def stop_server(self):
        """Stop the production server"""
        if not self.is_running:
            print("Server is not running!")
            return
        
        if self.server:
            print("🛑 Stopping VIB34D Production Server...")
            self.server.shutdown()
            self.server.server_close()
            self.server = None
            
        if self.server_thread:
            self.server_thread.join(timeout=1)
            self.server_thread = None
        
        self.is_running = False
        print("✅ Server stopped successfully!")
    
    def get_server_info(self):
        """Get current server information"""
        return {
            'running': self.is_running,
            'port': self.port,
            'directory': self.directory,
            'url': f'http://localhost:{self.port}/' if self.is_running else None,
            'dashboard_url': f'http://localhost:{self.port}/index_VIB34D_PROFESSIONAL.html' if self.is_running else None
        }

def main():
    """Main server entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='VIB34D Professional Dashboard Production Server')
    parser.add_argument('--port', '-p', type=int, default=8080, help='Port to serve on (default: 8080)')
    parser.add_argument('--directory', '-d', type=str, default='.', help='Directory to serve (default: current)')
    parser.add_argument('--verify-only', action='store_true', help='Only verify files, do not start server')
    
    args = parser.parse_args()
    
    # Convert directory to absolute path
    directory = os.path.abspath(args.directory)
    
    if not os.path.exists(directory):
        print(f"❌ Directory does not exist: {directory}")
        sys.exit(1)
    
    # Create server instance
    server = VIB34DProductionServer(port=args.port, directory=directory)
    
    if args.verify_only:
        print("🔍 File verification mode - not starting server")
        success = server.verify_directory_structure()
        sys.exit(0 if success else 1)
    
    # Start server
    try:
        success = server.start_server()
        if not success:
            sys.exit(1)
        
        # Keep server running
        try:
            while server.is_running:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
        
    finally:
        server.stop_server()

if __name__ == "__main__":
    main()