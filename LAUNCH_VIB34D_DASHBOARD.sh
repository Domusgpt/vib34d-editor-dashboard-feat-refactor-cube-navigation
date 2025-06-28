#!/bin/bash
# VIB34D Professional Dashboard - Simple Launch Script
# Run this script to start the dashboard with verified deployment

echo "🚀 Launching VIB34D Professional Dashboard..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Start the server
echo "🌐 Starting server on port 8091..."
echo "📍 Dashboard will be available at: http://localhost:8091/"
echo ""
echo "🎯 Features available:"
echo "   • 8 hypercube faces with smooth navigation"
echo "   • 33+ adaptive blog cards with WebGL visualizers"
echo "   • JSON-configurable content and behavior"
echo "   • Professional-grade UI/UX with shader effects"
echo ""
echo "🧭 Navigation Guide:"
echo "   • Click edge bezels to navigate between faces"
echo "   • Hover cards for interactive effects"
echo "   • All visualizers are WebGL-powered"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Create and run the server
cat > vib34d_server.py << 'EOF'
import http.server
import socketserver
import mimetypes
import sys
import webbrowser
import time
import threading

class VIB34DServer(http.server.SimpleHTTPRequestHandler):
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

    def log_message(self, format, *args):
        # Simplified logging
        pass

port = 8091
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/json', '.json')

print(f"✅ Server starting on http://localhost:{port}/")

def open_browser():
    time.sleep(2)
    webbrowser.open(f'http://localhost:{port}/')
    print("🌐 Dashboard opened in browser")

# Open browser automatically
threading.Thread(target=open_browser, daemon=True).start()

try:
    with socketserver.TCPServer(("", port), VIB34DServer) as httpd:
        print(f"🎉 VIB34D Dashboard is now running!")
        print(f"📱 If browser didn't open, visit: http://localhost:{port}/")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Dashboard stopped. Thanks for using VIB34D!")
except OSError as e:
    if "Address already in use" in str(e):
        print(f"❌ Port {port} is already in use.")
        print("Please stop other servers or use a different port.")
    else:
        print(f"❌ Server error: {e}")
EOF

python3 vib34d_server.py