#!/bin/bash

# VIB34D Professional Dashboard Production Launcher
# Automatically finds available port and launches the system

echo "🚀 VIB34D Professional Dashboard Production Launcher"
echo "=================================================="

# Function to check if port is available
check_port() {
    netstat -tuln 2>/dev/null | grep -q ":$1 " && return 1 || return 0
}

# Find available port
PORT=0
for p in 8080 8893 8000 3000 5000 8081 8082 8083; do
    if check_port $p; then
        PORT=$p
        break
    fi
done

# If no standard port available, find random one
if [ $PORT -eq 0 ]; then
    PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')
fi

echo "✅ Found available port: $PORT"

# Kill any existing Python servers
pkill -f "python3 -m http.server" 2>/dev/null

# Start HTTP server
echo "🌐 Starting HTTP server on port $PORT..."
python3 -m http.server $PORT > server_production.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully (PID: $SERVER_PID)"
    
    # Display access URLs
    echo ""
    echo "🎯 Access VIB34D Professional Dashboard at:"
    echo "   http://localhost:$PORT/index_VIB34D_PROFESSIONAL.html"
    echo ""
    echo "📊 Test Suites Available:"
    echo "   http://localhost:$PORT/test_vib34d_professional_mcp.js"
    echo "   http://localhost:$PORT/quick-test.html"
    echo ""
    echo "📁 Configuration Files:"
    echo "   http://localhost:$PORT/config/visuals.json"
    echo "   http://localhost:$PORT/config/behavior.json"
    echo "   http://localhost:$PORT/config/content.json"
    echo ""
    echo "🛑 To stop the server, run: kill $SERVER_PID"
    echo ""
    
    # Open in browser if available
    if command -v xdg-open > /dev/null; then
        xdg-open "http://localhost:$PORT/index_VIB34D_PROFESSIONAL.html" 2>/dev/null
    elif command -v open > /dev/null; then
        open "http://localhost:$PORT/index_VIB34D_PROFESSIONAL.html" 2>/dev/null
    elif command -v start > /dev/null; then
        start "http://localhost:$PORT/index_VIB34D_PROFESSIONAL.html" 2>/dev/null
    else
        echo "⚠️  Please open your browser manually"
    fi
    
else
    echo "❌ Failed to start server"
    exit 1
fi

# Keep script running
echo "Press Ctrl+C to stop the server..."
wait $SERVER_PID