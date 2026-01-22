import { useMemo } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/Addons.js";
import { UploadFile, theme } from "antd";
import { useEffect, useState, useRef } from "react";
const ModelSTL = ({
    file,
    onLoad,
}: {
    file: UploadFile;
    onLoad?: (mesh: THREE.Mesh) => void;
}) => {
    const objectUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file.originFileObj as Blob);
    }, [file]);

    const colorPrimary = theme.useToken().token.colorPrimary;

    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
    const [position, setPosition] = useState<[number, number, number]>([
        0, 0, 0,
    ]);
    // Preserve original model units — do not rescale STLs for display or export
    const scale = 1;
    const meshRef = useRef<THREE.Mesh>(null); // <-- always at the top

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
                setPosition([-center.x, -center.y, -minZ]);
                setGeometry(geo);
            },
            undefined,
            (err: any) => {
                console.error("Error loading STL:", err);
                setGeometry(null);
            }
        );

        return () => {
            URL.revokeObjectURL(objectUrl);
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
            position={position}
        >
            <meshStandardMaterial color={colorPrimary} />
        </mesh>
    );
};

export default ModelSTL;