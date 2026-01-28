import { useMemo, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/Addons.js";
import { UploadFile, theme } from "antd";

const ModelSTL = ({
    file,
    onLoad,
}: {
    file: UploadFile;
    onLoad?: (mesh: THREE.Mesh) => void;
}) => {
    // FIX: Handle both Remote (URL) and Local (Blob) files
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
    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
    
    // Preserve original model units
    const scale = 1;
    const meshRef = useRef<THREE.Mesh>(null); 

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new STLLoader();
        loader.load(
            objectUrl,
            (geo: any) => {
                geo.computeBoundingBox();
                const bbox = geo.boundingBox!;
                // Center X/Y, flush Z to ground
                const center = bbox.getCenter(new THREE.Vector3());
                const minZ = bbox.min.z;

                // Move vertices to center
                geo.translate(-center.x, -center.y, -minZ);
                
                setGeometry(geo);
            },
            undefined,
            (err: any) => {
                console.error("Error loading STL:", err);
                setGeometry(null);
            }
        );

        // Clean up ONLY if we created a Blob URL
        return () => {
            if (objectUrl && objectUrl.startsWith("blob:")) {
                URL.revokeObjectURL(objectUrl);
            }
            if (geometry) geometry.dispose();
        };
    }, [objectUrl]);

    useEffect(() => {
        if (meshRef.current) {
            onLoad?.(meshRef.current);
        }
    }, [geometry, onLoad]);

    if (!geometry) return null;

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            scale={scale}
        >
            <meshStandardMaterial color={colorPrimary} />
        </mesh>
    );
};

export default ModelSTL;