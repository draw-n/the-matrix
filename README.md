# THE MATRIX

## Environment Setup
```
cd scripts
chmod +x setup.sh
./setup.sh <SERVER IP> <DIRECTORY OF the-matrix REPOSITORY>
```
This will create a .venv virtual environment in the backend/geometry folder and copy over the nginx configuration to the device's /etc/nginx folder.

## Deployment Run
```
cd scripts
chmod +x run.sh
./run.sh
```
