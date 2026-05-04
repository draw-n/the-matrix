#!/bin/bash
set -e

echo "Updating repo..."
git pull origin main

echo "Updating backend..."
cd backend
npm ci
./.venv/bin/pip install -r ./geometry/requirements.txt

echo "Restarting backend..."
systemctl restart matrix

echo "Updating frontend..."
cd ../frontend
npm ci
npm run build

echo "Reloading nginx..."
nginx -t
systemctl reload nginx

echo "Deploy complete."