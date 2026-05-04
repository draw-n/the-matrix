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

# BUILD_ARGS="-DSLIC3R_GUI=0" setup/superslicer.sh
sudo setup/nginx.sh $(hostname -I | awk '{print $1}')

cd ../backend
echo "Installing backend dependencies..."
npm ci

cd ../frontend
echo "Installing frontend dependencies..."
npm ci


cd ../scripts

echo "Creating systemd service..."

SERVICE_NAME="matrix"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
WORKING_DIR="$(realpath ../backend)"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=Matrix App Service
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$WORKING_DIR
ExecStart=$APP_ROOT/run.sh
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "Enabling service to start on boot..."
sudo systemctl enable ${SERVICE_NAME}.service

echo "Starting service now..."
sudo systemctl start ${SERVICE_NAME}.service

echo "Service setup complete: ${SERVICE_NAME}"

echo "Setup complete."
echo "Don't forget to put the .env files in the frontend and backend directories with the necessary environment variables."
