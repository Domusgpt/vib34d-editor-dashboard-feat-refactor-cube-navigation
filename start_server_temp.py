import http.server
import socketserver
import sys
import mimetypes
import urllib.parse

class VIB34DHandler(http.server.SimpleHTTPRequestHandler):
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

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8091
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/json', '.json')

with socketserver.TCPServer(("", port), VIB34DHandler) as httpd:
    print(f"Server running on http://localhost:{port}/")
    httpd.serve_forever()
