#!/bin/bash

# BookReader Pro - Quick Setup Script

echo "🚀 Setting up BookReader Pro..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.9+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ Python $(python3 --version) detected"
echo ""

# Backend setup
echo "${BLUE}📦 Setting up Backend...${NC}"
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your MongoDB connection string"
fi

cd ..

# Frontend setup
echo ""
echo "${BLUE}📱 Setting up Frontend...${NC}"
cd frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

cd ..

echo ""
echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Make sure MongoDB is running"
echo "  2. Update backend/.env with your MongoDB URL"
echo "  3. Start backend: cd backend && source venv/bin/activate && python server.py"
echo "  4. Start frontend: cd frontend && npx expo start"
echo ""
echo "Happy reading! 📚"
