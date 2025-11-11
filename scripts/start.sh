#!/bin/bash

# workforceX402 - Startup Script
# Easy deployment script for production platform

echo "🚀 workforceX402 Platform - Starting up..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if server file exists
if [ ! -f "workforce-server.js" ]; then
    echo "❌ workforce-server.js not found. Please ensure you're in the correct directory."
    exit 1
fi

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found. Please ensure you're in the correct directory."
    exit 1
fi

# Set default port
PORT=${1:-3003}
echo "🔧 Using port: $PORT"

# Check if port is already in use
if lsof -i :$PORT &> /dev/null; then
    echo "⚠️  Port $PORT is already in use."
    read -p "Do you want to kill the existing process? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 Killing existing process on port $PORT..."
        lsof -ti :$PORT | xargs kill -9
        sleep 2
    else
        echo "❌ Aborting. Please use a different port: ./start.sh $((PORT + 1))"
        exit 1
    fi
fi

# Start the server
echo "🚀 Starting workforceX402 server on port $PORT..."
export PORT=$PORT

# Check if we should run in background
if [ "$2" = "background" ]; then
    echo "🔄 Running in background mode..."
    nohup node workforce-server.js > server.log 2>&1 &
    SERVER_PID=$!
    echo "✅ Server started with PID: $SERVER_PID"
    echo "📄 Logs will be written to: server.log"
    echo "🛑 To stop server: kill $SERVER_PID"
else
    echo "🌐 Starting in foreground mode..."
    echo "🌍 Access the platform at: http://localhost:$PORT"
    echo "💡 Press Ctrl+C to stop the server"
    echo ""
    node workforce-server.js
fi