#!/bin/bash

echo "🚀 Starting QR Menu Ordering System..."
echo ""

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start the development server
echo "Starting development server on port 3001..."
echo "Open your browser to: http://localhost:3001"
echo ""
echo "Admin Login:"
echo "Email: admin@burgerpalace.com"
echo "Password: admin123"
echo ""

npm run dev