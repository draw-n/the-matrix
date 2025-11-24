import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const FocusCameraOnLoad = ({ mesh }: { mesh: THREE.Object3D }) => {
    const { camera, controls } = useThree() as any;

    useEffect(() => {
        if (!mesh) return;

        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fitDistance = maxDim * 1.5;

        camera.position.set(center.x, center.y, center.z + fitDistance);
        camera.up.set(0, 0, 1);
        camera.lookAt(center);
        camera.updateProjectionMatrix();

        if (controls) {
            controls.target.copy(center);
            controls.update();
        }
    }, [mesh]);

    return null;
}

export default FocusCameraOnLoad;