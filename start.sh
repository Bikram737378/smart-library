#!/bin/bash

# Start backend
cd server
npm install
npm run start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
cd ../client
npm install
npm run preview &
FRONTEND_PID=$!

# Keep the process running
wait $BACKEND_PID $FRONTEND_PID