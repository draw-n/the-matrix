import * as THREE from "three";

const SelectableFaces = ({
    faces,
    onSelect,
    markerSize = 0.5,
}: {
    faces: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
        ellipseCenter?: THREE.Vector3;
        ellipseAxis?: THREE.Vector3; // <--- NEW PROP
        bottomVertex: THREE.Vector3;
        overlapArea?: number;
        ellipseRadii?: [number, number];
    }[];
    onSelect: (face: any) => void;
    markerSize?: number;
}) => {
    return (
        <>
            {faces.map((f, i) => {
                // 1. Setup Basis Vectors
                const normal = f.normal.clone().normalize(); // Z-axis of the face
                
                // X-axis: The major axis of the ellipse (lengthwise)
                // Fallback to a random perp vector if missing
                let majorAxis = f.ellipseAxis 
                    ? f.ellipseAxis.clone().normalize()
                    : new THREE.Vector3(1, 0, 0).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), normal));

                // Y-axis: Cross product of Z and X
                const minorAxis = new THREE.Vector3().crossVectors(normal, majorAxis).normalize();
                
                // Re-orthogonalize X to ensure perfect 90 degrees
                majorAxis.crossVectors(minorAxis, normal).normalize();

                // 2. Create Rotation Matrix
                const rotationMatrix = new THREE.Matrix4().makeBasis(majorAxis, minorAxis, normal);
                const quat = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

                // 3. Sizing
                const area = f.overlapArea ?? 1;
                const planeSize = Math.max(markerSize, Math.sqrt(area));
                const radii = (f as any).ellipseRadii as | [number, number] | undefined;
                
                const useRx = radii && radii[0] > 1e-9 ? Math.max(radii[0], markerSize) : planeSize;
                const useRy = radii && radii[1] > 1e-9 ? Math.max(radii[1], markerSize) : planeSize;

                const geom = new THREE.CircleGeometry(1, 64);
                
                // 4. Positioning
                const offset = normal.clone().multiplyScalar(Math.max(0.2, markerSize * 0.01));
                const centerPos = f.ellipseCenter || f.centroid;
                const overlayPos = centerPos.clone().add(offset);

                return (
                    <mesh
                        key={i}
                        geometry={geom}
                        quaternion={quat}
                        position={overlayPos}
                        scale={[useRx, useRy, 1]}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            ((e.object as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set("orange");
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            ((e.object as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set("white");
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(f);
                        }}
                    >
                        <meshStandardMaterial
                            color="white"
                            transparent
                            opacity={0.5}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                );
            })}
        </>
    );
}

export default SelectableFaces;