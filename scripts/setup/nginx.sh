#!/bin/bash

echo "Setting up nginx configuration..."
export SERVER_IP=$1
export APP_ROOT="$(pwd)/../../frontend/dist"

envsubst '$SERVER_IP $APP_ROOT' < ../config/nginx.template.conf > /etc/nginx/sites-available/matrix.conf
sudo ln -sf /etc/nginx/sites-available/matrix.conf /etc/nginx/sites-enabled/matrix.conf
echo "Nginx configuration complete. Reloading nginx..."
sudo systemctl reload nginx
