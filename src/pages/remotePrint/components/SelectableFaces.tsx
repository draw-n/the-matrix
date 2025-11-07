import * as THREE from "three";
import { useMemo, useState } from "react";

interface Face {
    normal: THREE.Vector3;
    centroid: THREE.Vector3;
    vertices: THREE.Vector3[]; // convex-hull facet vertices
}

// Use a permissive props type for mesh-related passthrough props to avoid
// coupling to @react-three/fiber typings in this file.
type Props = {
    faces: Face[];
    onSelect?: (face: Face) => void;
} & Record<string, any>;

export default function SelectableFaces({ faces, onSelect }: Props) {
    return (
        <>
            {faces.map((face: Face, i: number) => (
                <SelectableFace
                    key={i}
                    face={face}
                    onSelect={() => onSelect?.(face)}
                />
            ))}
        </>
    );
}

function SelectableFace({
    face,
    onSelect,
}: {
    face: Face;
    onSelect?: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    // Compute the plane geometry that matches the convex-hull facet
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        if (face.vertices.length === 0) return s;
        s.moveTo(face.vertices[0].x, face.vertices[0].z);
        for (let i = 1; i < face.vertices.length; i++) {
            s.lineTo(face.vertices[i].x, face.vertices[i].z);
        }
        s.closePath();
        return s;
    }, [face.vertices]);

    const geom = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);

    // Orient plane to match face.normal
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(
        up,
        face.normal.clone().normalize()
    );

    // r3f accepts arrays for position/quaternion too; convert to arrays to avoid
    // potential runtime/typing issues when passing raw three.js objects.
    const positionArr = [face.centroid.x, face.centroid.y, face.centroid.z] as [
        number,
        number,
        number
    ];
    const quatArr = [quat.x, quat.y, quat.z, quat.w] as [
        number,
        number,
        number,
        number
    ];

    return (
        <mesh
            geometry={geom as unknown as THREE.BufferGeometry}
            quaternion={quatArr as any}
            position={positionArr}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
            }}
        >
            <meshStandardMaterial
                color={hovered ? "orange" : "yellow"}
                side={THREE.DoubleSide}
                transparent
                opacity={hovered ? 0.9 : 0.4}
            />
        </mesh>
    );
}
