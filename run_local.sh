#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
    echo "Stopping services..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting Smart Personnel Allocation System (Local Mode)..."

# 1. Start Backend
echo "🐍 Starting Backend..."
# Ensure venv exists
if [ ! -d "backend/venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv backend/venv
    backend/venv/bin/pip install -r backend/requirements.txt
fi

# Run from root to support package imports
backend/venv/bin/python -m uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# 2. Start Frontend
echo "⚛️ Starting Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Services started!"
echo "   Backend: http://localhost:8000"
echo "   Frontend: http://localhost:5173"
echo "   (Press Ctrl+C to stop)"

wait
