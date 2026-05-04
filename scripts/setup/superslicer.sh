#!/bin/bash
echo "Setting up SuperSlicer..."

# run this script from scripts folder
# note: this script is untested, you may have to fix some issues

CURRENT_DIR="$(pwd)"
REPO_URL="https://github.com/supermerill/SuperSlicer.git"
TARGET_DIR="$CURRENT_DIR/../backend/slicer-cli"
SRC_DIR="$TARGET_DIR/SuperSlicer"
BINARY_NAME="superslicer"

sudo apt-get install -y \
git \
build-essential \
autoconf \
cmake \
libglu1-mesa-dev \
libgtk-3-dev \
libdbus-1-dev \

echo "[SuperSlicer Installer] Target directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

sudo apt-get update

# Remove existing SuperSlicer binary if it exists
if [ -f "$TARGET_DIR/$BINARY_NAME" ]; then
	echo "[SuperSlicer Installer] Removing existing $BINARY_NAME binary..."
	rm -f "$TARGET_DIR/$BINARY_NAME"
fi


if [ -f "$SRC_DIR" ]; then
	rm -rf "$SRC_DIR"
fi

echo "[SuperSlicer Installer] Cloning repo..."
git clone "$REPO_URL" "$SRC_DIR"

cd "$SRC_DIR"
if [ -f "BuildLinux.sh" ]; then
    echo "[SuperSlicer Installer] Running BuildLinux.sh..."
    chmod +x BuildLinux.sh
else
    echo "[SuperSlicer Installer] BuildLinux.sh not found, you have to build it manually."
    exit 1
fi

sudo ./BuildLinux.sh -u 
sed -i 's/BUILD_ARGS=""/BUILD_ARGS="${BUILD_ARGS:-}"/' BuildLinux.sh
sed -i 's/BUILD_ARGS="-DSLIC3R_GTK=3"/BUILD_ARGS="${BUILD_ARGS:-} -DSLIC3R_GTK=3"/' BuildLinux.sh

sudo BUILD_ARGS="-DSLIC3R_GUI=0" ./BuildLinux.sh -dsi

# Find the built binary (may be in bin/ or .)
if [ -f "build/bin/$BINARY_NAME" ]; then
	cp "build/bin/$BINARY_NAME" "$TARGET_DIR/$BINARY_NAME"
elif [ -f "$BINARY_NAME" ]; then
	cp "$BINARY_NAME" "$TARGET_DIR/$BINARY_NAME"
else
	echo "[SuperSlicer Installer] Build failed: binary not found!"
	exit 1
fi

echo "[SuperSlicer Installer] Done. superslicer binary is in $TARGET_DIR/$BINARY_NAME."
cd "$CURRENT_DIR"