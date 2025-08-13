#!/bin/bash

# 🚀 Listly Todo App - Quick Deployment Script
# This script helps you deploy the MVP quickly

echo "🚀 Listly Todo App - Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

echo "📋 Pre-deployment checks..."

# Check if build works
echo "🔨 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please fix the errors before deploying."
    exit 1
fi

# Check if backend is running (optional)
echo "🔍 Checking backend connection..."
curl -s http://localhost:3001/api/health > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Backend is running locally"
else
    echo "⚠️  Backend not running locally (this is OK if deploying to production)"
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Deploy to Vercel (Recommended)"
echo "2. Deploy to Netlify"
echo "3. Manual deployment instructions"
echo ""

read -p "Choose deployment option (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        echo "Installing Vercel CLI..."
        npm install -g vercel
        
        echo "Deploying..."
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        echo "Please follow these steps:"
        echo "1. Go to https://netlify.com"
        echo "2. Drag and drop the 'dist' folder"
        echo "3. Set environment variables in Netlify dashboard"
        ;;
    3)
        echo "📖 Manual Deployment Instructions:"
        echo ""
        echo "Frontend (Vercel):"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Run: vercel --prod"
        echo "3. Set environment variables in Vercel dashboard"
        echo ""
        echo "Backend (Railway):"
        echo "1. Go to https://railway.app"
        echo "2. Connect your GitHub repository"
        echo "3. Set environment variables"
        echo "4. Deploy automatically"
        echo ""
        echo "Environment Variables:"
        echo "Frontend: VITE_API_URL=https://your-backend-url.com"
        echo "Backend: JWT_SECRET=your-secret, DATABASE_URL=your-db-url"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Next Steps:"
echo "1. Test the deployed application"
echo "2. Set up monitoring and analytics"
echo "3. Gather user feedback"
echo "4. Plan database migration (optional)"
echo ""
echo "📚 Documentation:"
echo "- Deployment Guide: DEPLOYMENT.md"
echo "- Project Rules: ../project-rules.md"
echo "- PRD: ../PRD.md" 