import * as THREE from "three";
import { geekblueDark } from "@ant-design/colors";

const getExportableMesh = (mesh: THREE.Mesh): THREE.Mesh => {
    const exportMesh = mesh.clone();
    // Force update of matrices
    exportMesh.updateMatrixWorld(true);

    // Bake all transforms into geometry
    const geom = (exportMesh.geometry as THREE.BufferGeometry).clone();
    geom.applyMatrix4(exportMesh.matrixWorld);
    geom.computeVertexNormals();

    // Use a stable color (no hooks) for export preview material
    const bakedMesh = new THREE.Mesh(
        geom,
        new THREE.MeshStandardMaterial({ color: geekblueDark[6] })
    );

    return bakedMesh;
};

export default getExportableMesh;