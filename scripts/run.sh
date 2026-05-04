#!/bin/bash
set -e

echo "Stopping backend..."
pm2 stop backend || true

git pull origin main

echo "Updating backend..."
cd backend
npm ci

source .venv/bin/activate
pip install -r ./geometry/requirements.txt
pm2 restart backend || pm2 start index.js -n backend

echo "Updating frontend..."
cd ../frontend
npm ci
npm run build

echo "Reloading nginx..."
sudo nginx -t
sudo systemctl reload nginx

cd ../scripts
echo "Setup complete."