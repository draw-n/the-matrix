#!/bin/bash
set -e

SCRIPT_DIR="$(pwd)"

echo "Checking for Python3..."
if ! command -v python3 &> /dev/null
then
    echo "Python3 is not installed. Please install it first."
    exit 1
fi

echo "Creating virtual environment..."
python3 -m venv ../backend/geometry/.venv

echo "Activating virtual environment..."
source ../backend/geometry/.venv/bin/activate

echo "Upgrading pip..."
pip install --upgrade pip

if [ -f "../backend/geometry/requirements.txt" ]; then
    echo "Installing dependencies from requirements.txt..."
    pip install -r ../backend/geometry/requirements.txt
else
    echo "No requirements.txt found, skipping dependency install."
fi

chmod +x setup/nginx.sh
chmod +x setup/superslicer.sh
chmod +x setup/systemd.sh
chmod +x stop.sh
chmod +x run.sh
# BUILD_ARGS="-DSLIC3R_GUI=0" setup/superslicer.sh
sudo setup/nginx.sh $(hostname -I | awk '{print $1}')
sudo setup/systemd.sh

cd ../backend
echo "Installing backend dependencies..."
npm ci

cd ../frontend
echo "Installing frontend dependencies..."
npm ci

cd ../scripts

echo "Setup complete."
echo "Don't forget to put the .env files in the frontend and backend directories with the necessary environment variables."
