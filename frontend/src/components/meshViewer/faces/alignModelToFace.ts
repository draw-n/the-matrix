// Description: Aligns a 3D model so that a selected face is parallel to the build plate
// and positions it just above the plate.

import * as THREE from "three";

const alignModelToFace = (
    mesh: THREE.Object3D,
    normal: THREE.Vector3,
    centroid: THREE.Vector3
) => {
    // Always reset mesh transform before aligning
    mesh.rotation.set(0, 0, 0);
    mesh.position.set(0, 0, 0);
    mesh.updateMatrixWorld(true);

    const down = new THREE.Vector3(0, 0, -1);

    // Compute rotation to align face normal → down
    const q = new THREE.Quaternion().setFromUnitVectors(
        normal.clone().normalize(),
        down
    );
    mesh.setRotationFromQuaternion(q);
    mesh.updateMatrixWorld(true);

    // Compute new world centroid of the selected face
    const worldCentroid = centroid.clone().applyMatrix4(mesh.matrixWorld);
    // Translate mesh so the selected face centroid (which will sit on the
    // build plate) lines up with the ground center in X and Y, then adjust
    // Z so the face sits slightly above the plate.
    // Shift X/Y so the face centroid moves to world (0,0)
    mesh.position.x -= worldCentroid.x;
    mesh.position.y -= worldCentroid.y;

    // Compute a small offset proportional to model size to keep the selectable
    // plane slightly above the surface (avoid clipping when reorienting).
    const box = new THREE.Box3().setFromObject(mesh);
    const diag = box.getSize(new THREE.Vector3()).length();
    const offsetDistance = Math.max(1e-6, diag * 1e-4);

    // Move mesh so that the selected face world Z becomes `offsetDistance`
    // (after X/Y translation above)
    mesh.position.z -= worldCentroid.z - offsetDistance;
    mesh.updateMatrixWorld(true);
}

export default alignModelToFace;