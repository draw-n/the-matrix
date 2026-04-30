// Description: A React component that renders selectable faces on a 3D mesh in a Three.js scene using react-three-fiber. Each face is represented by a circular marker that can be clicked to trigger a selection callback. The markers are oriented and sized based on the face's normal, centroid, and optional ellipse parameters.
import * as THREE from "three";
import { MeshFace } from "../../../types/job";

const SelectableFaces = ({
    faces,
    onSelect,
    markerSize = 0.25,
}: {
    faces: MeshFace[];
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
                    : new THREE.Vector3(1, 0, 0).applyQuaternion(
                          new THREE.Quaternion().setFromUnitVectors(
                              new THREE.Vector3(0, 0, 1),
                              normal,
                          ),
                      );

                // Y-axis: Cross product of Z and X
                const minorAxis = new THREE.Vector3()
                    .crossVectors(normal, majorAxis)
                    .normalize();

                // Re-orthogonalize X to ensure perfect 90 degrees
                majorAxis.crossVectors(minorAxis, normal).normalize();

                // 2. Create Rotation Matrix
                const rotationMatrix = new THREE.Matrix4().makeBasis(
                    majorAxis,
                    minorAxis,
                    normal,
                );
                const quat = new THREE.Quaternion().setFromRotationMatrix(
                    rotationMatrix,
                );

                // 3. Sizing
                const planeSize = Math.max(markerSize, 1);
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

                // 4. Positioning
                const offset = normal
                    .clone()
                    .multiplyScalar(Math.max(0.2, markerSize * 0.01));
                const centerPos = f.ellipseCenter || f.centroid;
                const overlayPos = centerPos.clone().add(offset);

                // Create edges for the face marker
                const edges = new THREE.LineSegments(
                    new THREE.EdgesGeometry(geom),
                    new THREE.LineBasicMaterial({
                        color: "black",
                        linewidth: 1, // Adjust line width for better visibility
                        polygonOffset: true, // Prevent z-fighting with the mesh
                        polygonOffsetFactor: -1,
                        polygonOffsetUnits: -1,
                    }),
                );

                // Offset edges slightly to avoid z-fighting
                edges.position.copy(f.centroid.clone().add(offset));

                return (
                    <group key={`face-${i}`}>
                        <mesh
                            geometry={geom}
                            quaternion={quat}
                            position={overlayPos}
                            scale={[useRx, useRy, 1]}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                (
                                    (e.object as THREE.Mesh)
                                        .material as THREE.MeshStandardMaterial
                                ).color.set("#68e");
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation();
                                (
                                    (e.object as THREE.Mesh)
                                        .material as THREE.MeshStandardMaterial
                                ).color.set("#acf");
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(f);
                            }}
                        >
                            <meshStandardMaterial
                                color="#acf"
                                transparent
                                opacity={0.6}
                                side={THREE.DoubleSide}
                            />
                        </mesh>

                        <lineSegments
                            position={overlayPos}
                            quaternion={quat}
                            scale={[useRx, useRy, 1]}
                        >
                            <edgesGeometry attach="geometry" args={[geom]} />
                            <lineBasicMaterial
                                attach="material"
                                color="white"
                                linewidth={5} // Adjust line width for better visibility
                                polygonOffset={true} // Prevent z-fighting with the mesh
                                polygonOffsetFactor={-1}
                                polygonOffsetUnits={-1}
                            />
                        </lineSegments>
                    </group>
                );
            })}
        </>
    );
};

export default SelectableFaces;
