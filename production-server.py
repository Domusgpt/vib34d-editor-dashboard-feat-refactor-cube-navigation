#!/usr/bin/env python3
"""
VIB34D Professional Dashboard Production Server
Advanced HTTP server with WebGL support, CORS handling, and development features
"""

import http.server
import socketserver
import threading
import time
import json
import os
import sys
import webbrowser
from urllib.parse import urlparse, parse_qs
import mimetypes

class VIB34DProductionHandler(http.server.SimpleHTTPRequestHandler):
    """Enhanced HTTP handler for VIB34D with WebGL optimization"""
    
    def __init__(self, *args, **kwargs):
        # Set proper MIME types for WebGL and modern web
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('application/json', '.json')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('application/wasm', '.wasm')
        mimetypes.add_type('image/webp', '.webp')
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        """Add security and performance headers"""
        # CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # WebGL and Canvas security
        self.send_header('Cross-Origin-Embedder-Policy', 'credentialless')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        
        # Performance headers
        self.send_header('Cache-Control', 'public, max-age=3600')
        
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Enhanced GET handler with dashboard routes"""
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Dashboard API endpoints
        if path.startswith('/api/'):
            self.handle_api_request(path, parsed_url.query)
            return
        
        # Default to index for root
        if path == '/':
            self.path = '/index_VIB34D_PROFESSIONAL.html'
        
        # Handle dashboard variants
        elif path == '/professional':
            self.path = '/index_VIB34D_PROFESSIONAL.html'
        elif path == '/complete':
            self.path = '/index_COMPLETE_SYSTEM.html'
        elif path == '/demo':
            self.path = '/desktop-demo.html'
        
        super().do_GET()
    
    def handle_api_request(self, path, query):
        """Handle API requests for dashboard configuration"""
        try:
            if path == '/api/status':
                self.send_json_response({
                    'status': 'running',
                    'server': 'VIB34D Production Server',
                    'version': '1.0.0',
                    'webgl_supported': True,
                    'features': [
                        'Hypercube Navigation',
                        'WebGL Visualizers',
                        'JSON Configuration',
                        'Real-time Reactivity'
                    ]
                })
            
            elif path == '/api/config':
                config_data = self.load_dashboard_config()
                self.send_json_response(config_data)
            
            elif path == '/api/visualizers':
                visualizer_info = self.get_visualizer_info()
                self.send_json_response(visualizer_info)
            
            else:
                self.send_error(404, 'API endpoint not found')
        
        except Exception as e:
            self.send_error(500, f'API error: {str(e)}')
    
    def send_json_response(self, data):
        """Send JSON response with proper headers"""
        json_data = json.dumps(data, indent=2)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json_data.encode('utf-8'))
    
    def load_dashboard_config(self):
        """Load dashboard configuration files"""
        config = {}
        config_files = ['visuals.json', 'behavior.json', 'content.json']
        
        for filename in config_files:
            filepath = os.path.join('config', filename)
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'r') as f:
                        config[filename.replace('.json', '')] = json.load(f)
                except Exception as e:
                    config[filename.replace('.json', '')] = {'error': str(e)}
        
        return config
    
    def get_visualizer_info(self):
        """Get information about available visualizers"""
        return {
            'total_canvases': 33,
            'faces': 8,
            'cards_per_face': 6,
            'board_visualizers': 8,
            'bezel_visualizers': 4,
            'geometry_types': [
                'hypercube',
                'tetrahedron', 
                'sphere',
                'torus',
                'kleinbottle',
                'fractal',
                'wave',
                'crystal'
            ],
            'roles': [
                'board',
                'background',
                'content',
                'highlight',
                'accent',
                'bezel'
            ]
        }
    
    def log_message(self, format, *args):
        """Custom logging with timestamps"""
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        message = format % args
        print(f"[{timestamp}] {message}")

class VIB34DProductionServer:
    """Production server manager for VIB34D Dashboard"""
    
    def __init__(self, port=8080, host='localhost'):
        self.port = port
        self.host = host
        self.server = None
        self.thread = None
        
    def find_available_port(self):
        """Find an available port starting from the preferred port"""
        import socket
        
        ports_to_try = [8080, 8893, 3000, 4000, 5000, 8000, 8888, 9000]
        
        for port in ports_to_try:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind((self.host, port))
                    self.port = port
                    print(f"✅ Found available port: {port}")
                    return port
            except OSError:
                continue
        
        raise RuntimeError("No available ports found")
    
    def start(self, open_browser=True):
        """Start the production server"""
        try:
            # Find available port
            self.find_available_port()
            
            # Create server
            self.server = socketserver.TCPServer(
                (self.host, self.port), 
                VIB34DProductionHandler
            )
            
            # Start server in thread
            self.thread = threading.Thread(target=self.server.serve_forever)
            self.thread.daemon = True
            self.thread.start()
            
            url = f"http://{self.host}:{self.port}"
            
            print(f"""
🚀 VIB34D Professional Dashboard Production Server Started!

📍 Server URL: {url}
🌐 Dashboard: {url}/professional
📊 Status API: {url}/api/status
⚙️ Config API: {url}/api/config
🎨 Visualizers: {url}/api/visualizers

🎯 Features:
   • Full WebGL support with proper CORS headers
   • 8 hypercube faces with navigation
   • 33+ WebGL visualizers
   • JSON configuration system
   • Real-time performance monitoring
   • Cross-origin resource sharing enabled

🔧 Available Routes:
   • / or /professional - Main dashboard
   • /demo - Desktop demo version
   • /complete - Complete system version
   • /api/* - API endpoints

Press Ctrl+C to stop the server
""")
            
            if open_browser:
                print("🌐 Opening browser...")
                webbrowser.open(f"{url}/professional")
            
            return url
            
        except Exception as e:
            print(f"❌ Failed to start server: {e}")
            raise
    
    def stop(self):
        """Stop the production server"""
        if self.server:
            print("🛑 Stopping VIB34D Production Server...")
            self.server.shutdown()
            self.server.server_close()
            if self.thread:
                self.thread.join()
            print("✅ Server stopped successfully")
    
    def get_status(self):
        """Get server status"""
        return {
            'running': self.server is not None,
            'host': self.host,
            'port': self.port,
            'url': f"http://{self.host}:{self.port}" if self.server else None
        }

def main():
    """Main entry point"""
    print("🔮 VIB34D Professional Dashboard Production Server")
    print("=" * 60)
    
    server = VIB34DProductionServer()
    
    try:
        url = server.start()
        
        # Keep server running
        while True:
            try:
                time.sleep(1)
            except KeyboardInterrupt:
                break
    
    except Exception as e:
        print(f"❌ Server error: {e}")
    
    finally:
        server.stop()

if __name__ == "__main__":
    main()