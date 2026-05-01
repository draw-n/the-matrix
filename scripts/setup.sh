#!/bin/bash
set -e

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

echo "Setting up SuperSlicer..."

REPO_URL="https://github.com/supermerill/SuperSlicer.git"
TARGET_DIR="../backend/slicer-cli"
SRC_DIR="$TARGET_DIR/SuperSlicer"
BINARY_NAME="superslicer"

echo "[SuperSlicer Installer] Target directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Remove existing SuperSlicer binary if it exists
if [ -f "$TARGET_DIR/$BINARY_NAME" ]; then
	echo "[SuperSlicer Installer] Removing existing $BINARY_NAME binary..."
	rm -f "$TARGET_DIR/$BINARY_NAME"
fi

if [ -d "$SRC_DIR/.git" ]; then
	echo "[SuperSlicer Installer] Repo exists, pulling latest..."
	git -C "$SRC_DIR" pull
else
	echo "[SuperSlicer Installer] Cloning repo..."
	git clone "$REPO_URL" "$SRC_DIR"
fi

cd "$SRC_DIR"
echo "[SuperSlicer Installer] Building SuperSlicer..."
mkdir -p build
cd build
cmake .. -DSLIC3R_FHS=1 -DSLIC3R_GUI=0 -DSLIC3R_STATIC=1
make -j$(nproc)

# Find the built binary (may be in bin/ or .)
if [ -f "bin/$BINARY_NAME" ]; then
	cp "bin/$BINARY_NAME" "$TARGET_DIR/$BINARY_NAME"
elif [ -f "$BINARY_NAME" ]; then
	cp "$BINARY_NAME" "$TARGET_DIR/$BINARY_NAME"
else
	echo "[SuperSlicer Installer] Build failed: binary not found!"
	exit 1
fi

echo "[SuperSlicer Installer] Done. superslicer binary is in $TARGET_DIR/$BINARY_NAME."


echo "Setting up nginx configuration..."
export SERVER_IP=$1
export APP_ROOT=$2

envsubst '$SERVER_IP $APP_ROOT' < ../nginx/nginx.template.conf > /etc/nginx/sites-available/matrix.conf
sudo ln -sf /etc/nginx/sites-available/matrix.conf /etc/nginx/sites-enabled/matrix.conf
echo "Nginx configuration complete. Please reload nginx to apply changes."

cd ../backend
echo "Installing backend dependencies..."
npm ci

cd ../frontend
echo "Installing frontend dependencies..."
npm ci



cd ../scripts

echo "Creating systemd service..."

SERVICE_NAME="matrix-app"
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
