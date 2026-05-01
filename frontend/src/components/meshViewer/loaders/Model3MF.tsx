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

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new ThreeMFLoader();

        const handleObject = (obj: any) => {
            // --- RESET ROTATION ---
            obj.rotation.set(0, 0, 0);
            obj.scale.set(1, 1, 1);
            obj.position.set(0, 0, 0);
            obj.updateMatrixWorld(true);

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

            const mesh = new THREE.Mesh(
                merged,
                new THREE.MeshStandardMaterial({ color: colorPrimary, opacity: 1 }),
            );
            mesh.position.set(0, 0, 0);

            const edges = new THREE.LineSegments(
                new THREE.EdgesGeometry(merged),
                new THREE.LineBasicMaterial({
                    color: "black",
                    linewidth: 5,
                    polygonOffset: true,
                    polygonOffsetFactor: -1,
                    polygonOffsetUnits: -1,
                })
            );
            mesh.add(edges);

            onLoad?.(mesh);
        };

        if (objectUrl.startsWith("http")) {
            (async () => {
                try {
                    const headers: Record<string, string> = {};
                    const token = localStorage.getItem("authToken");
                    if (token) headers["Authorization"] = `Bearer ${token}`;

                    const resp = await fetch(objectUrl, {
                        method: "GET",
                        credentials: "include",
                        headers,
                    });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
                    const buffer = await resp.arrayBuffer();
                    const obj = loader.parse(buffer);
                    handleObject(obj);
                } catch (err: any) {
                    console.error("Error loading 3MF via fetch:", err);
                }
            })();
        } else {
            loader.load(
                objectUrl,
                (obj: any) => handleObject(obj),
                undefined,
                (err: any) => console.error("Error loading 3MF:", err),
            );
        }

        return () => {
            if (objectUrl && objectUrl.startsWith("blob:")) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl, onLoad, colorPrimary]);

    return null; 
};

export default Model3MF;