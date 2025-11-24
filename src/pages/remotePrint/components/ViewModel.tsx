// Description: ViewModel component for rendering and manipulating 3D models in STL and 3MF formats.

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
    STLLoader,
    ThreeMFLoader,
    STLExporter,
} from "three/examples/jsm/Addons.js";
import { useEffect, useMemo, useState, Suspense, useRef } from "react";
import { UploadFile, message } from "antd";
import axios from "axios";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { geekblueDark } from "@ant-design/colors";

interface ViewModelProps {
    file: UploadFile;
    setFile?: (files: UploadFile[]) => void;
    // Registration callback so parents can receive an exported API without needing a ref
    onRegister?: (api: { exportAndReplace: () => Promise<any> } | null) => void;
}

function exportAsSTL(mesh: THREE.Mesh, originalName?: string) {
    const exporter = new STLExporter();
    const bakedMesh = getExportableMesh(mesh);

    const stlString = exporter.parse(bakedMesh);
    const blob = new Blob([stlString], { type: "text/plain" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const base = originalName || "exported_model";
    const filename = base.toLowerCase().endsWith(".stl") ? base : `${base}.stl`;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
}

function getExportableMesh(mesh: THREE.Mesh): THREE.Mesh {
    const exportMesh = mesh.clone();

    // Force update of matrices
    exportMesh.updateMatrixWorld(true);

    // Bake all transforms into geometry
    const geom = (exportMesh.geometry as THREE.BufferGeometry).clone();
    geom.applyMatrix4(exportMesh.matrixWorld);
    geom.computeVertexNormals();

    // Create new mesh with baked geometry
    const bakedMesh = new THREE.Mesh(
        geom,
        new THREE.MeshStandardMaterial({ color: geekblueDark[6] })
    );

    return bakedMesh;
}

/**
 * Helper: point-in-triangle using barycentric coordinates.
 * p, a, b, c are Vector3 in same plane.
 */
function pointInTriangle(
    p: THREE.Vector3,
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3
) {
    // Using barycentric technique
    const v0 = c.clone().sub(a);
    const v1 = b.clone().sub(a);
    const v2 = p.clone().sub(a);

    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);

    const denom = dot00 * dot11 - dot01 * dot01;
    if (Math.abs(denom) < 1e-12) return false;

    const u = (dot11 * dot02 - dot01 * dot12) / denom;
    const v = (dot00 * dot12 - dot01 * dot02) / denom;

    return u >= -1e-8 && v >= -1e-8 && u + v <= 1 + 1e-8;
}

/**
 * detectMajorFaces using convex-hull intersection heuristic:
 * - Build convex hull geometry from mesh vertices (ConvexGeometry)
 * - For each hull triangle, compute plane and test mesh triangle centroids:
 *   if mesh centroid is within plane tolerance and its projection lies inside hull triangle,
 *   add that mesh triangle area to the hull triangle's overlap area.
 * - Cluster hull triangles by similar normals (so planar facets are merged).
 * - Return clusters with averaged normal & centroid (in mesh-local coords) and overlap area.
 */
const detectMajorFaces = (
    geometry: THREE.BufferGeometry,
    options?: {
        planeDistanceTolFactor?: number; // tolerance relative to bbox diag
        normalAngleThreshDeg?: number; // clustering hull triangles into facets
        minOverlapArea?: number; // filter tiny overlaps
    }
) => {
    const opts = {
        planeDistanceTolFactor: 1e-3,
        normalAngleThreshDeg: 3,
        minOverlapArea: 1e-6,
        ...(options || {}),
    };

    const pos = geometry.attributes.position;
    if (!pos) return [];

    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < pos.count; i++) {
        pts.push(new THREE.Vector3().fromBufferAttribute(pos, i));
    }
    if (!pts.length) return [];

    const hullGeom = new ConvexGeometry(pts);

    // Precompute mesh triangle centroids & areas
    const meshFaces: {
        centroid: THREE.Vector3;
        area: number;
        verts: THREE.Vector3[];
    }[] = [];
    const a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        c = new THREE.Vector3();
    const e1 = new THREE.Vector3(),
        e2 = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
        a.fromBufferAttribute(pos, i);
        b.fromBufferAttribute(pos, i + 1);
        c.fromBufferAttribute(pos, i + 2);
        e1.subVectors(b, a);
        e2.subVectors(c, a);
        const area = e1.clone().cross(e2).length() * 0.5;
        const centroid = new THREE.Vector3()
            .addVectors(a, b)
            .add(c)
            .divideScalar(3);
        meshFaces.push({
            centroid,
            area,
            verts: [a.clone(), b.clone(), c.clone()],
        });
    }

    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const diag = bbox.getSize(new THREE.Vector3()).length();
    const planeTol = Math.max(1e-9, diag * opts.planeDistanceTolFactor);

    const hullPos = hullGeom.attributes.position;
    const hullFaces: {
        a: THREE.Vector3;
        b: THREE.Vector3;
        c: THREE.Vector3;
        centroid: THREE.Vector3;
        normal: THREE.Vector3;
        overlapArea: number;
        contributors: number[]; // indices of meshFaces that contributed to this hull triangle
    }[] = [];

    const ha = new THREE.Vector3(),
        hb = new THREE.Vector3(),
        hc = new THREE.Vector3();
    const he1 = new THREE.Vector3(),
        he2 = new THREE.Vector3(),
        hnormal = new THREE.Vector3();

    for (let i = 0; i < hullPos.count; i += 3) {
        ha.fromBufferAttribute(hullPos, i);
        hb.fromBufferAttribute(hullPos, i + 1);
        hc.fromBufferAttribute(hullPos, i + 2);

        he1.subVectors(hb, ha);
        he2.subVectors(hc, ha);
        hnormal.crossVectors(he1, he2).normalize();

        const hCentroid = new THREE.Vector3()
            .addVectors(ha, hb)
            .add(hc)
            .divideScalar(3);

        let overlap = 0;
        const contributors: number[] = [];
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            hnormal,
            ha
        );
        const proj = new THREE.Vector3();

        for (let j = 0; j < meshFaces.length; j++) {
            const mf = meshFaces[j];
            const dist = plane.distanceToPoint(mf.centroid);
            if (Math.abs(dist) > planeTol) continue;
            plane.projectPoint(mf.centroid, proj);
            if (pointInTriangle(proj, ha, hb, hc)) {
                overlap += mf.area;
                contributors.push(j);
            }
        }

        hullFaces.push({
            a: ha.clone(),
            b: hb.clone(),
            c: hc.clone(),
            centroid: hCentroid.clone(),
            normal: hnormal.clone(),
            overlapArea: overlap,
            contributors,
        });
    }

    // cluster hull triangles by normal
    const clusters: { faces: typeof hullFaces; normal: THREE.Vector3 }[] = [];
    const cosThresh = Math.cos(
        THREE.MathUtils.degToRad(opts.normalAngleThreshDeg)
    );
    for (const hf of hullFaces) {
        let found = false;
        for (const c of clusters) {
            if (c.normal.dot(hf.normal) > cosThresh) {
                c.faces.push(hf);
                const accum = new THREE.Vector3(0, 0, 0);
                let totalArea = 0;
                for (const f of c.faces) {
                    const e1 = f.b.clone().sub(f.a);
                    const e2 = f.c.clone().sub(f.a);
                    const area = e1.cross(e2).length() * 0.5;
                    accum.addScaledVector(f.normal, area);
                    totalArea += area;
                }
                if (totalArea > 0) accum.normalize();
                else accum.copy(c.normal);
                c.normal.copy(accum);
                found = true;
                break;
            }
        }
        if (!found) clusters.push({ faces: [hf], normal: hf.normal.clone() });
    }

    const candidates: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
        overlapArea: number;
        bottomVertex: THREE.Vector3;
        ellipseRadii?: [number, number];
    }[] = [];

    for (const c of clusters) {
        let totalOverlap = 0;
        const allVerts: THREE.Vector3[] = [];
        const contributorSet = new Set<number>();

        for (const f of c.faces) {
            const triE1 = f.b.clone().sub(f.a);
            const triE2 = f.c.clone().sub(f.a);
            const triArea = triE1.clone().cross(triE2).length() * 0.5;
            totalOverlap += f.overlapArea;

            allVerts.push(f.a.clone(), f.b.clone(), f.c.clone());

            // collect contributor indices (if any)
            if (
                (f as any).contributors &&
                Array.isArray((f as any).contributors)
            ) {
                for (const idx of (f as any).contributors)
                    contributorSet.add(idx);
            }
        }

        if (totalOverlap < opts.minOverlapArea) continue;

        // Compute a surface centroid from contributor mesh triangle centroids (area-weighted)
        let surfaceCentroid = new THREE.Vector3();
        let surfaceAreaSum = 0;
        if (contributorSet.size > 0) {
            for (const idx of Array.from(contributorSet)) {
                const mf = meshFaces[idx];
                surfaceCentroid.addScaledVector(mf.centroid, mf.area);
                surfaceAreaSum += mf.area;
            }
            if (surfaceAreaSum > 0)
                surfaceCentroid.divideScalar(surfaceAreaSum);
        }

        // fallback: average hull verts projected onto plane
        if (surfaceAreaSum === 0) {
            const avgCentroid = new THREE.Vector3();
            allVerts.forEach((v) => avgCentroid.add(v));
            avgCentroid.divideScalar(allVerts.length || 1);

            const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
                c.normal,
                avgCentroid
            );
            surfaceCentroid = plane.projectPoint(
                avgCentroid,
                new THREE.Vector3()
            );
        }
        // Project all hull vertices onto the plane and compute a 2D bounding box
        // in the plane basis to derive ellipse radii that fit the convex-hull
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            c.normal,
            surfaceCentroid
        );
        const projected = allVerts.map((v) =>
            plane.projectPoint(v.clone(), new THREE.Vector3())
        );

        // Build orthonormal basis (u,v) in the plane
        const arbitrary =
            Math.abs(c.normal.dot(new THREE.Vector3(1, 0, 0))) < 0.9
                ? new THREE.Vector3(1, 0, 0)
                : new THREE.Vector3(0, 1, 0);
        const u = new THREE.Vector3()
            .crossVectors(arbitrary, c.normal)
            .normalize();
        const v2 = new THREE.Vector3().crossVectors(c.normal, u).normalize();

        // compute an in-plane rotation so the ellipse X-axis aligns with u
        const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            c.normal.clone().normalize()
        );
        const qX = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
        const qX_proj = qX
            .clone()
            .sub(c.normal.clone().multiplyScalar(qX.dot(c.normal)));
        if (qX_proj.length() > 1e-12) qX_proj.normalize();
        const uNorm = u.clone().normalize();
        const sinTheta = new THREE.Vector3()
            .crossVectors(qX_proj, uNorm)
            .dot(c.normal);
        const cosTheta = qX_proj.dot(uNorm);
        const ellipseRotation = Math.atan2(sinTheta, cosTheta);

        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;
        for (const p of projected) {
            const rel = p.clone().sub(surfaceCentroid);
            const x = rel.dot(u);
            const y = rel.dot(v2);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        const width = maxX - minX || 0;
        const height = maxY - minY || 0;

        // radii for ellipse
        const rx = width * 0.5;
        const ry = height * 0.5;

        // offset markers by a small fixed padding so they don't clip into the mesh.
        // Keep this very small and model-unit agnostic (e.g., mm).
        const FIXED_PADDING = 0.1; // small constant padding (units: model units, default 0.1)
        const offsetDistance = FIXED_PADDING;
        const bottomVertex = surfaceCentroid
            .clone()
            .add(c.normal.clone().normalize().multiplyScalar(offsetDistance));

        candidates.push({
            normal: c.normal.clone().normalize(),
            centroid: surfaceCentroid.clone(),
            overlapArea: totalOverlap,
            bottomVertex,
            ellipseRadii: [rx, ry],
            ellipseRotation,
        } as any);
    }

    candidates.sort((a, b) => b.overlapArea - a.overlapArea);

    return candidates;
};

function SelectableFaces({
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
}) {
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

function alignModelToFace(
    mesh: THREE.Object3D,
    normal: THREE.Vector3,
    centroid: THREE.Vector3
) {
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

function FocusCameraOnLoad({ mesh }: { mesh: THREE.Object3D }) {
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

function Model3MF({
    file,
    onLoad,
}: ViewModelProps & { onLoad?: (mesh: THREE.Mesh) => void }) {
    const objectUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file.originFileObj as Blob);
    }, [file]);

    const [object, setObject] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new ThreeMFLoader();
        loader.load(
            objectUrl,
            (obj: any) => {
                const merged = mergeAllGeometries(obj);
                if (!merged) {
                    console.warn("No geometries found in 3MF");
                    return;
                }
                merged.computeBoundingBox();

                const bbox = merged.boundingBox!;
                const offsetZ = -bbox.min.z; // flush with ground

                const mesh = new THREE.Mesh(
                    merged,
                    new THREE.MeshStandardMaterial({ color: geekblueDark[6] })
                );
                mesh.position.set(0, 0, offsetZ);

                setObject(mesh);
                onLoad?.(mesh);
            },
            undefined,
            (err: any) => console.error("Error loading 3MF:", err)
        );

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl, onLoad]);

    if (!object) return null;
    return <primitive object={object} />;
}

function ModelSTL({
    file,
    onLoad,
}: ViewModelProps & { onLoad?: (mesh: THREE.Mesh) => void }) {
    const objectUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file.originFileObj as Blob);
    }, [file]);

    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
    const [position, setPosition] = useState<[number, number, number]>([
        0, 0, 0,
    ]);
    // Preserve original model units — do not rescale STLs for display or export
    const scale = 1;
    const meshRef = useRef<THREE.Mesh>(null); // <-- always at the top

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new STLLoader();
        loader.load(
            objectUrl,
            (geo: any) => {
                geo.computeBoundingBox();
                const bbox = geo.boundingBox!;
                const minZ = bbox.min.z;
                // Keep original units — offset to ground without changing scale
                const offsetZ = -minZ; // flush with ground
                setPosition([0, 0, offsetZ]);
                setGeometry(geo);
            },
            undefined,
            (err: any) => {
                console.error("Error loading STL:", err);
                setGeometry(null);
            }
        );

        return () => {
            URL.revokeObjectURL(objectUrl);
            if (geometry) geometry.dispose();
        };
    }, [objectUrl]);

    useEffect(() => {
        if (meshRef.current) {
            onLoad?.(meshRef.current);
        }
    }, [geometry, onLoad]);

    if (!geometry) return null;

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            scale={scale}
            position={position}
        >
            <meshStandardMaterial color={geekblueDark[6]} />
        </mesh>
    );
}

function HandleContextLoss() {
    const { gl } = useThree();

    useEffect(() => {
        const handleContextLost = (e: any) => {
            e.preventDefault();
            console.warn("WebGL context lost");
        };

        const handleContextRestored = () => {
            console.info("WebGL context restored");
        };

        gl.domElement.addEventListener("webglcontextlost", handleContextLost);
        gl.domElement.addEventListener(
            "webglcontextrestored",
            handleContextRestored
        );

        return () => {
            gl.domElement.removeEventListener(
                "webglcontextlost",
                handleContextLost
            );
            gl.domElement.removeEventListener(
                "webglcontextrestored",
                handleContextRestored
            );
        };
    }, [gl]);

    return null;
}

function ViewModel(props: ViewModelProps) {
    const { file, setFile, onRegister } = props;
    const isSTL = file?.name?.toLowerCase().endsWith(".stl");
    const is3MF = file?.name?.toLowerCase().endsWith(".3mf");

    const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
    const [detectedFaces, setDetectedFaces] = useState<
        {
            normal: THREE.Vector3;
            centroid: THREE.Vector3;
            bottomVertex: THREE.Vector3;
            overlapArea?: number;
            ellipseRadii?: [number, number];
            ellipseRotation?: number;
        }[]
    >([]);
    // When we align the model to a face we suppress rendering the overlay for
    // that specific face so the selected bottom face 'disappears'. We store
    // the suppressed face (centroid+normal in mesh-local) and the mesh
    // matrix at the time of suppression so we only hide that face while the
    // mesh remains in that aligned transform.
    const [suppressUntilMatrix, setSuppressUntilMatrix] = useState<
        THREE.Matrix4 | null
    >(null);
    const [suppressedFace, setSuppressedFace] = useState<
        { centroid: THREE.Vector3; normal: THREE.Vector3 } | null
    >(null);

    const matricesEqual = (m1: THREE.Matrix4 | null, m2: THREE.Matrix4 | null) => {
        if (!m1 || !m2) return false;
        const a = m1.elements;
        const b = m2.elements;
        for (let i = 0; i < 16; i++) {
            if (Math.abs(a[i] - b[i]) > 1e-9) return false;
        }
        return true;
    };

    const faceMatches = (
        a: { centroid: THREE.Vector3; normal: THREE.Vector3 } | undefined,
        b: { centroid: THREE.Vector3; normal: THREE.Vector3 } | null
    ) => {
        if (!a || !b) return false;
        const dist = a.centroid.distanceTo(b.centroid);
        if (dist > 1e-3) return false; // centroid tolerance
        const cos = a.normal.clone().normalize().dot(b.normal.clone().normalize());
        return cos > Math.cos(THREE.MathUtils.degToRad(5)); // within 5 degrees
    };

    // Detect faces whenever mesh geometry changes
    useEffect(() => {
        if (mesh?.geometry) {
            mesh.geometry.computeVertexNormals();
            const rawCandidates = detectMajorFaces(
                mesh.geometry as THREE.BufferGeometry,
                {
                    planeDistanceTolFactor: 1e-3,
                    normalAngleThreshDeg: 3,
                    minOverlapArea: 1e-6,
                }
            );

            // Keep centroids/normals in mesh-local coordinates so child markers
            // placed under the mesh (inside <primitive object={mesh}>) are
            // positioned correctly. alignModelToFace expects local coords too.
            const transformed = rawCandidates.map((c) => ({
                normal: c.normal.clone().normalize(),
                centroid: c.centroid.clone(),
                bottomVertex: c.bottomVertex.clone(),
                overlapArea: c.overlapArea,
                ellipseRadii: (c as any).ellipseRadii as
                    | [number, number]
                    | undefined,
                ellipseRotation: (c as any).ellipseRotation as
                    | number
                    | undefined,
            }));

            console.log("Detected convex-hull candidates:", transformed);
            setDetectedFaces(transformed);
        }
    }, [mesh?.geometry, mesh?.matrixWorld]);

    // Provide an API via onRegister so parents don't need a ref
    const exportAndReplace = async () => {
        if (!mesh) {
            message.error("No mesh loaded to export");
            throw new Error("No mesh loaded");
        }

        try {
            const exporter = new STLExporter();
            const baked = getExportableMesh(mesh as THREE.Mesh);
            const stlString = exporter.parse(baked);
            const blob = new Blob([stlString], { type: "model/stl" });
            const base = (file && file.name) || "exported_model";
            const exportName = base.toLowerCase().endsWith(".stl") ? base : `${base}.stl`;
            const fileObj = new File([blob], exportName, { type: "model/stl" });

            const form = new FormData();
            form.append("file", fileObj);

            const action = `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`;
            const resp = await axios.post(action, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const url = resp.data?.url || resp.data?.fileUrl || resp.data?.location || "";

            const uploadFile: UploadFile = {
                uid: `${Date.now()}`,
                name: fileObj.name,
                status: "done",
                url,
                originFileObj: fileObj as any,
            };

            if (setFile) setFile([uploadFile]);
            message.success("Exported STL uploaded and replaced successfully");
            return resp;
        } catch (err: any) {
            console.error("Error exporting/uploading STL:", err);
            message.error("Failed to upload exported STL");
            throw err;
        }
    };

    // Register API with parent on mount and unregister on unmount
    useEffect(() => {
        onRegister?.({ exportAndReplace });
        return () => onRegister?.(null);
    }, [onRegister, mesh]);

    // Clear suppression when the mesh's matrixWorld changes away from the
    // aligned matrix (so overlays reappear after the user rotates/moves the
    // model). Also clear the suppressedFace record.
    useEffect(() => {
        if (!mesh) return;
        if (suppressUntilMatrix && !matricesEqual(suppressUntilMatrix, mesh.matrixWorld)) {
            setSuppressUntilMatrix(null);
            setSuppressedFace(null);
        }
    }, [mesh?.matrixWorld]);

    const handleFaceSelect = (face: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
    }) => {
        if (mesh) {
            alignModelToFace(mesh, face.normal, face.centroid);
            // After aligning, suppress overlays while the mesh remains in this
            // aligned transform so the selected bottom face disappears.
            mesh.updateMatrixWorld(true);
            setSuppressUntilMatrix(mesh.matrixWorld.clone());
            setSuppressedFace({ centroid: face.centroid.clone(), normal: face.normal.clone() });
        }
    };

    // compute marker size for SelectableFaces render
    const markerSizeForRender = (() => {
        if (!mesh) return 0.5;
        const bbox = new THREE.Box3().setFromObject(mesh);
        const size = bbox.getSize(new THREE.Vector3());
        return Math.max(0.005, Math.min(size.x, size.y, size.z) * 0.03);
    })();

    return (
        <div style={{ width: "100%", height: "500px" }}>
            {mesh && (
                <button onClick={() => exportAsSTL(mesh, file?.name)}>
                    Export as STL
                </button>
            )}
            <Canvas
                camera={{ position: [0, 10, 0], up: [0, 0, 1], fov: 50 }}
                onCreated={({ scene }) => {
                    scene.up.set(0, 0, 1);
                }}
            >
                <Suspense fallback={null}>
                    <HandleContextLoss />

                    {/* Load model */}
                    {file && isSTL && <ModelSTL file={file} onLoad={setMesh} />}
                    {file && is3MF && <Model3MF file={file} onLoad={setMesh} />}
                    {mesh && (
                        <>
                            <FocusCameraOnLoad mesh={mesh} />
                            <primitive object={mesh}>
                                {detectedFaces.length > 0 && (() => {
                                    // If we have a suppressed face and the mesh is in the
                                    // same matrix as when we suppressed, filter that
                                    // single face out; otherwise show all faces.
                                    if (suppressUntilMatrix && suppressedFace && matricesEqual(suppressUntilMatrix, mesh.matrixWorld)) {
                                        const visible = detectedFaces.filter((df) => !faceMatches(df, suppressedFace));
                                        return (
                                            <SelectableFaces
                                                faces={visible}
                                                onSelect={handleFaceSelect}
                                                markerSize={markerSizeForRender}
                                            />
                                        );
                                    }
                                    return (
                                        <SelectableFaces
                                            faces={detectedFaces}
                                            onSelect={handleFaceSelect}
                                            markerSize={markerSizeForRender}
                                        />
                                    );
                                })()}
                            </primitive>
                        </>
                    )}

                    {/* Ground plane (slightly below z=0 to avoid z-fighting) */}
                    <mesh rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
                        <planeGeometry args={[200, 200]} />
                        <meshStandardMaterial
                            color="#bbbbbb"
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </Suspense>

                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 10]} intensity={0.5} />
                <directionalLight position={[-5, -5, 10]} intensity={0.5} />
                <hemisphereLight groundColor={"#444444"} intensity={0.6} />

                <OrbitControls maxPolarAngle={Math.PI / 2 - 0.25} />
            </Canvas>
        </div>
    );
};

export default ViewModel;
