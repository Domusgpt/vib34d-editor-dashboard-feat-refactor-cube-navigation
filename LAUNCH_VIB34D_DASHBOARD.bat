@echo off
REM VIB34D Professional Dashboard - Windows Launch Script
echo 🚀 Launching VIB34D Professional Dashboard...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    echo Please install Python and try again.
    pause
    exit /b 1
)

echo 🌐 Starting server on port 8091...
echo 📍 Dashboard will be available at: http://localhost:8091/
echo.
echo 🎯 Features available:
echo    • 8 hypercube faces with smooth navigation
echo    • 33+ adaptive blog cards with WebGL visualizers
echo    • JSON-configurable content and behavior
echo    • Professional-grade UI/UX with shader effects
echo.
echo 🧭 Navigation Guide:
echo    • Click edge bezels to navigate between faces
echo    • Hover cards for interactive effects
echo    • All visualizers are WebGL-powered
echo.
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Create server script
(
echo import http.server
echo import socketserver
echo import mimetypes
echo import webbrowser
echo import time
echo import threading
echo.
echo class VIB34DServer^(http.server.SimpleHTTPRequestHandler^):
echo     def end_headers^(self^):
echo         self.send_header^('Access-Control-Allow-Origin', '*'^)
echo         self.send_header^('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'^)
echo         self.send_header^('Access-Control-Allow-Headers', 'Content-Type'^)
echo         self.send_header^('Cache-Control', 'no-cache'^)
echo         super^(^).end_headers^(^)
echo.
echo     def do_OPTIONS^(self^):
echo         self.send_response^(200^)
echo         self.end_headers^(^)
echo.
echo     def do_GET^(self^):
echo         if self.path == '/' or self.path == '':
echo             self.path = '/index_VIB34D_PROFESSIONAL.html'
echo         return super^(^).do_GET^(^)
echo.
echo     def log_message^(self, format, *args^):
echo         pass
echo.
echo port = 8091
echo mimetypes.add_type^('application/javascript', '.js'^)
echo mimetypes.add_type^('application/json', '.json'^)
echo.
echo print^(f"✅ Server starting on http://localhost:{port}/"^)
echo.
echo def open_browser^(^):
echo     time.sleep^(2^)
echo     webbrowser.open^(f'http://localhost:{port}'^)
echo     print^("🌐 Dashboard opened in browser"^)
echo.
echo threading.Thread^(target=open_browser, daemon=True^).start^(^)
echo.
echo try:
echo     with socketserver.TCPServer^(^("", port^), VIB34DServer^) as httpd:
echo         print^(f"🎉 VIB34D Dashboard is now running!"^)
echo         print^(f"📱 If browser didn't open, visit: http://localhost:{port}/"^)
echo         httpd.serve_forever^(^)
echo except KeyboardInterrupt:
echo     print^("\\n🛑 Dashboard stopped. Thanks for using VIB34D!"^)
echo except OSError as e:
echo     if "Address already in use" in str^(e^):
echo         print^(f"❌ Port {port} is already in use."^)
echo         print^("Please stop other servers or use a different port."^)
echo     else:
echo         print^(f"❌ Server error: {e}"^)
) > vib34d_server.py

python vib34d_server.py
pause