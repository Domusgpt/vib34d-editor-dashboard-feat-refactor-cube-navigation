#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8091

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

print(f"VIB34D Server Starting on port {PORT}")
print(f"Directory: {os.getcwd()}")
print(f"Access at: http://localhost:{PORT}/index_VIB34D_PROFESSIONAL.html")

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print("Server running!")
    httpd.serve_forever()