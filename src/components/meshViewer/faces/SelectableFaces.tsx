// Description: A React component that renders selectable faces in a 3D mesh viewer using Three.js.

import * as THREE from "three";

const SelectableFaces = ({
    faces,
    onSelect,
    markerSize = 0.5,
}: {
    faces: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
        bottomVertex: THREE.Vector3;
        overlapArea?: number;
        ellipseRadii?: [number, number];
        ellipseRotation?: number;
    }[];
    onSelect: (face: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
        bottomVertex: THREE.Vector3;
        overlapArea?: number;
    }) => void;
    markerSize?: number;
}) => {
    return (
        <>
            {faces.map((f, i) => {
                const normal = f.normal.clone().normalize();
                const baseQuat = new THREE.Quaternion().setFromUnitVectors(
                    new THREE.Vector3(0, 0, 1),
                    normal
                );

                // apply in-plane rotation if provided so ellipse aligns to hull face
                const rot = (f as any).ellipseRotation as number | undefined;
                const quat = rot
                    ? new THREE.Quaternion()
                          .setFromAxisAngle(normal, rot)
                          .multiply(baseQuat)
                    : baseQuat;

                const area = f.overlapArea ?? 1;
                const planeSize = Math.max(markerSize, Math.sqrt(area));

                // If radii are provided, render an ellipse by scaling a unit circle.
                const radii = (f as any).ellipseRadii as
                    | [number, number]
                    | undefined;
                const useRx =
                    radii && radii[0] > 1e-9
                        ? Math.max(radii[0], markerSize)
                        : planeSize;
                const useRy =
                    radii && radii[1] > 1e-9
                        ? Math.max(radii[1], markerSize)
                        : planeSize;

                const geom = new THREE.CircleGeometry(1, 64);

                return (
                    <mesh
                        key={i}
                        geometry={geom}
                        quaternion={quat}
                        position={f.bottomVertex} // <-- use actual mesh surface point
                        scale={[useRx, useRy, 1]}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            (
                                (e.object as THREE.Mesh)
                                    .material as THREE.MeshStandardMaterial
                            ).color.set("orange");
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            (
                                (e.object as THREE.Mesh)
                                    .material as THREE.MeshStandardMaterial
                            ).color.set("white");
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