// Description: A React component that loads and processes 3MF 3D model files using Three.js and react-three-fiber. It handles both local file uploads and remote URLs, applies necessary transformations to align the model with the scene's coordinate system, merges geometries, computes normals and bounding boxes, and creates a mesh with a standard material using a theme color.
import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import mergeAllGeometries from "../utils/mergeAllGeometries";
import { useEffect, useState, useMemo } from "react";
import { UploadFile, theme } from "antd";

const Model3MF = ({
    file,
    onLoad,
}: {
    file: UploadFile;
    onLoad?: (mesh: THREE.Mesh) => void;
}) => {
    const objectUrl = useMemo(() => {
        if (!file) return null;
        
        // 1. If it's a remote file from the server (Review Step), use the URL directly
        if (file.url) {
            return file.url;
        }

        // 2. If it's a local file upload (Upload Step), create a Blob URL
        if (file.originFileObj) {
            return URL.createObjectURL(file.originFileObj as Blob);
        }

        return null;
    }, [file]);

    const colorPrimary = theme.useToken().token.colorPrimary;
    const [object, setObject] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new ThreeMFLoader();
        loader.load(
            objectUrl,
            (obj: any) => {
                // --- RESET ROTATION ---
                // ThreeMFLoader automatically rotates 3MFs to Y-up (rotation.x = -PI/2).
                // We undo this to match our Z-up world.
                obj.rotation.set(0, 0, 0);
                obj.scale.set(1, 1, 1);
                obj.position.set(0, 0, 0);
                obj.updateMatrixWorld(true);
                // ---------------------------

                const merged = mergeAllGeometries(obj);
                if (!merged) {
                    console.warn("No geometries found in 3MF");
                    return;
                }
                merged.computeVertexNormals();
                merged.computeBoundingBox();
                const bbox = merged.boundingBox!;
                
                // Center X/Y, flush Z to ground
                const center = bbox.getCenter(new THREE.Vector3());
                const minZ = bbox.min.z;
                
                // Bake position into geometry
                merged.applyMatrix4(
                    new THREE.Matrix4().makeTranslation(
                        -center.x,
                        -center.y,
                        -minZ,
                    ),
                );
                
                // Use Ant Design's colorPrimary token for 3MF meshes (matches STL)
                const mesh = new THREE.Mesh(
                    merged,
                    new THREE.MeshStandardMaterial({ color: colorPrimary }),
                );
                mesh.position.set(0, 0, 0); // Reset position
                
                setObject(mesh);
                onLoad?.(mesh);
            },
            undefined,
            (err: any) => console.error("Error loading 3MF:", err),
        );

        return () => {
            // Only revoke if it was a blob URL we created
            if (objectUrl && objectUrl.startsWith("blob:")) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl, onLoad, colorPrimary]);

    return null; 
};

export default Model3MF;