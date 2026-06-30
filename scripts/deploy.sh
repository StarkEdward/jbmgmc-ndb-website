#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Deployment Process..."

# 1. Install Dependencies
echo "Installing dependencies..."
npm ci

# 2. Build the Next.js Application
echo "Building the application..."
npm run build

# 3. Copy Static Assets for Standalone Server
# Next.js standalone mode does not include public or static files automatically.
# We must copy them so the standalone server.js can serve them.
echo "Copying static assets to standalone directory..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# 4. Restart PM2
echo "Restarting PM2 application..."
pm2 reload pm2.config.js || pm2 start pm2.config.js

echo "Deployment Successful! ✅"
