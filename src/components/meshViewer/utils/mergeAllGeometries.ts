// Description: A utility function that merges all BufferGeometries from a Three.js Object3D and its children into a single BufferGeometry, applying world transformations to each geometry.

import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

function mergeAllGeometries(root: THREE.Object3D): THREE.BufferGeometry | null {
    const geometries: THREE.BufferGeometry[] = [];
    root.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const geom = (mesh.geometry as THREE.BufferGeometry).clone();
            geom.applyMatrix4(mesh.matrixWorld); // bake transform
            geometries.push(geom);
        }
    });
    if (geometries.length === 0) return null;
    return BufferGeometryUtils.mergeGeometries(geometries, false);
}

export default mergeAllGeometries;