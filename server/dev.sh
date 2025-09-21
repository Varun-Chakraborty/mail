#!/bin/bash
set -e  # Exit on any error
# Function to clean up on exit
cleanup() {
  echo "Stopping Docker Compose containers..."
  docker compose -f ./docker-compose.dev.yml stop
}
# Trap SIGINT (Ctrl+C) to run cleanup function
trap cleanup SIGINT
# Start the Docker containers
echo "Starting Docker Compose containers..."
docker compose -f ./docker-compose.dev.yml up -d
if [ $? -ne 0 ]; then
  echo "Failed to start Docker containers"
  exit 1
fi
echo "Containers started successfully"
# Run the app with development environment
echo "Starting the app..."
cross-env NODE_ENV=development nodemon src/index.ts
