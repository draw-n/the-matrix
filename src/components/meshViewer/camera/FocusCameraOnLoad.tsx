// Description: A React component that focuses the camera on a given mesh when it loads in a Three.js scene using react-three-fiber.

import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const FocusCameraOnLoad = ({ mesh }: { mesh: THREE.Object3D }) => {
    const { camera } = useThree() as any;

    useEffect(() => {
        if (!mesh) return;

        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fitDistance = Math.sqrt(300 * 300 + 300 * 300 + 240 * 240) * 0.5; // Adjust the multiplier as needed

        camera.position.set(center.x, center.y + fitDistance, center.z + 100);
        camera.up.set(0, 0, 1);
        camera.lookAt(center);
        camera.updateProjectionMatrix();
    }, [mesh]);

    return null;
};

export default FocusCameraOnLoad;
