import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import mergeAllGeometries from "../utils/mergeAllGeometries";
import { useEffect, useState } from "react";
import { UploadFile, theme } from "antd";
import { useMemo } from "react";

const Model3MF = ({ file, onLoad }: { file: UploadFile; onLoad?: (mesh: THREE.Mesh) => void }) => {
    const objectUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file.originFileObj as Blob);
    }, [file]);
    const colorPrimary = theme.useToken().token.colorPrimary;
    const [object, setObject] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new ThreeMFLoader();
        loader.load(
            objectUrl,
            (obj: any) => {
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
                merged.applyMatrix4(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -minZ));
                // Use Ant Design's colorPrimary token for 3MF meshes (matches STL)
                const mesh = new THREE.Mesh(
                    merged,
                    new THREE.MeshStandardMaterial({ color: colorPrimary })
                );
                mesh.position.set(0, 0, 0); // Reset position
                setObject(mesh);
                onLoad?.(mesh);
            },
            undefined,
            (err: any) => console.error("Error loading 3MF:", err)
        );

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl, onLoad]);

    // Only set mesh, do not render anything here
    return null;
};

export default Model3MF;
