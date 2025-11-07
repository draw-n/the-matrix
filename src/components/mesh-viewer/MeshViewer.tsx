import * as THREE from "three";

const detectMajorFaces = (
    geometry: THREE.BufferGeometry,
    angleThreshold = 30
) => {
    const nonIndexed = geometry.toNonIndexed();
    const position = nonIndexed.attributes.position;
    const faces: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
        indices: number[];
    }[] = [];
    const vA = new THREE.Vector3(),
        vB = new THREE.Vector3(),
        vC = new THREE.Vector3();
    const edge1 = new THREE.Vector3(),
        edge2 = new THREE.Vector3(),
        normal = new THREE.Vector3();

    for (let i = 0; i < position.count; i += 3) {
        vA.fromBufferAttribute(position, i);
        vB.fromBufferAttribute(position, i + 1);
        vC.fromBufferAttribute(position, i + 2);

        edge1.subVectors(vB, vA);
        edge2.subVectors(vC, vA);
        normal.crossVectors(edge1, edge2).normalize();

        const centroid = new THREE.Vector3()
            .addVectors(vA, vB)
            .add(vC)
            .divideScalar(3);
        faces.push({ normal, centroid, indices: [i, i + 1, i + 2] });
    }

    // Group by similar normals
    const threshold = Math.cos(THREE.MathUtils.degToRad(angleThreshold));
    const clusters: { normal: THREE.Vector3; faces: typeof faces }[] = [];

    for (const f of faces) {
        const found = clusters.find((c) => c.normal.dot(f.normal) > threshold);
        if (found) found.faces.push(f);
        else clusters.push({ normal: f.normal.clone(), faces: [f] });
    }

    // Compute average centroid for each cluster
    return clusters.map((c) => ({
        normal: c.normal,
        centroid: c.faces
            .reduce((acc, f) => acc.add(f.centroid), new THREE.Vector3())
            .divideScalar(c.faces.length),
    }));
};

function SelectableFaces({ faces, onSelect }: { faces: { normal: THREE.Vector3; centroid: THREE.Vector3 }[], onSelect: (face: any) => void }) {
  return faces.map((f, i) => (
    <mesh
      key={i}
      position={f.centroid}
      onClick={() => onSelect(f)}
    >
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  ));
}

function alignModelToFace(mesh: THREE.Object3D, normal: THREE.Vector3, centroid: THREE.Vector3) {
  const target = new THREE.Vector3(0, 1, 0); // Up vector of plane
  const q = new THREE.Quaternion().setFromUnitVectors(normal.clone().normalize(), target);

  mesh.setRotationFromQuaternion(q);

  // Move centroid to y = 0
  const worldCentroid = centroid.clone().applyMatrix4(mesh.matrixWorld);
  mesh.position.sub(new THREE.Vector3(0, worldCentroid.y, 0));
}