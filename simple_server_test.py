#!/usr/bin/env python3
"""Simple server for VIB34D testing with proper CORS headers"""

import http.server
import socketserver
import os
import sys
import mimetypes
import time
import threading

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/' or self.path == '':
            self.path = '/index_VIB34D_PROFESSIONAL.html'
        return super().do_GET()

def start_server(port=8090):
    """Start a simple HTTP server with CORS support"""
    try:
        handler = CORSHTTPRequestHandler
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 Simple server starting on port {port}")
            print(f"🌐 Access dashboard at: http://localhost:{port}/")
            print(f"🛑 Press Ctrl+C to stop")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except OSError as e:
        print(f"❌ Port {port} in use, trying {port+1}")
        start_server(port+1)

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
    start_server(port)