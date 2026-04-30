#!/bin/bash

echo "Stopping MongoDB..."
sudo systemctl stop mongod

echo "Deleting backend process from PM2..."
pm2 delete backend

echo "Stopping nginx..."
sudo systemctl stop nginx

echo "All processes stopped."