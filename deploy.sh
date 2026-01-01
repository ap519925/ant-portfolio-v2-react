#!/bin/bash

# Deployment Script
echo "Starting Deployment..."

# 1. Pull latest
echo "Pulling changes..."
git pull origin main

# 2. Install Dependencies (Quietly)
echo "Installing dependencies..."
npm install --silent

# 3. Build
echo "Building..."
npm run build

# 4. Check/Create Directory
TARGET="/var/www/mtanthony.com"
if [ ! -d "$TARGET" ]; then
  echo "Creating directory $TARGET..."
  mkdir -p "$TARGET"
fi

# 5. Deploy
echo "Deploying to $TARGET..."
cp -r dist/* "$TARGET"/

echo "Deployment Complete!"
