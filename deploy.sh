#!/bin/bash

echo "🚀 Deploying Smart Personnel Allocation System..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker."
  exit 1
fi

echo "📦 Building and starting containers..."
docker-compose up --build -d

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000/docs"
