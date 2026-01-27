import * as THREE from "three";
import { geekblueDark } from "@ant-design/colors";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
const getExportableMesh = (mesh: THREE.Mesh, skipTransformBake = false): THREE.Mesh => {
    const clone = mesh.clone(true);

    if (!skipTransformBake) {
        // Bake world transform into geometry
        clone.updateMatrixWorld(true);
        clone.geometry = clone.geometry.clone();
        clone.geometry.applyMatrix4(clone.matrixWorld);

        // Reset transform so STL is in world space
        clone.position.set(0, 0, 0);
        clone.rotation.set(0, 0, 0);
        clone.scale.set(1, 1, 1);
        clone.updateMatrixWorld(true);
    }

    // Ensure BufferGeometry
    let geom = clone.geometry as THREE.BufferGeometry;

    // Ensure non-indexed (STL prefers this)
    if (geom.index) {
        geom = geom.toNonIndexed();
    }

    geom.computeVertexNormals();

    clone.geometry = geom;
    return clone;
};

export default getExportableMesh;
