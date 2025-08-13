#!/bin/bash

# 🚀 Listly Todo App - Quick Deployment Script
echo "🚀 Listly Todo App - Deployment Script"
echo "======================================"

# Check if build works
echo "🔨 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Ready to deploy!"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Deploy: vercel --prod"
    echo "3. Set environment variables in Vercel dashboard"
else
    echo "❌ Build failed! Please fix the errors before deploying."
    exit 1
fi
