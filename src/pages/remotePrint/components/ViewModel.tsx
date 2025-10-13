import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
    STLLoader,
    ThreeMFLoader,
    STLExporter,
} from "three/examples/jsm/Addons.js";
import { useEffect, useMemo, useState, Suspense, useRef } from "react";
import { UploadFile } from "antd";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { AxesHelper } from "three";
import { geekblueDark } from "@ant-design/colors";

interface ViewModelProps {
    file: UploadFile;
}

function exportAsSTL(mesh: THREE.Mesh) {
    const exporter = new STLExporter();
    const bakedMesh = getExportableMesh(mesh);

    const stlString = exporter.parse(bakedMesh);
    const blob = new Blob([stlString], { type: "text/plain" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "exported_model.stl";
    a.click();

    URL.revokeObjectURL(a.href);
}

function getExportableMesh(mesh: THREE.Mesh): THREE.Mesh {
    const exportMesh = mesh.clone();

    // Force update of matrices
    exportMesh.updateMatrixWorld(true);

    // Bake all transforms into geometry
    const geom = exportMesh.geometry.clone();
    geom.applyMatrix4(exportMesh.matrixWorld);
    geom.computeVertexNormals();

    // Create new mesh with baked geometry
    const bakedMesh = new THREE.Mesh(
        geom,

        new THREE.MeshStandardMaterial({ color: geekblueDark[6] })
    );

    return bakedMesh;
}

const detectMajorFaces = (
    geometry: THREE.BufferGeometry,
    angleThreshold = 1
) => {
    const position = geometry.attributes.position;
    const faces: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
        indices: number[];
        area: number;
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
        // Calculate area of triangle
        const area = edge1.clone().cross(edge2).length() * 0.5;
        faces.push({
            normal: normal.clone(),
            centroid,
            indices: [i, i + 1, i + 2],
            area,
        });
    }

    // Compute bounding box
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const epsilon =
        0.01 *
        Math.max(
            bbox.max.x - bbox.min.x,
            bbox.max.y - bbox.min.y,
            bbox.max.z - bbox.min.z
        );

    const isVertexOnSurface = (v: THREE.Vector3) =>
        Math.abs(v.x - bbox.min.x) < epsilon ||
        Math.abs(v.x - bbox.max.x) < epsilon ||
        Math.abs(v.y - bbox.min.y) < epsilon ||
        Math.abs(v.y - bbox.max.y) < epsilon ||
        Math.abs(v.z - bbox.min.z) < epsilon ||
        Math.abs(v.z - bbox.max.z) < epsilon;

    const outerFaces = faces.filter((f) => {
        // Reconstruct the three vertices for this face
        const [iA, iB, iC] = f.indices;
        const vA = new THREE.Vector3().fromBufferAttribute(position, iA);
        const vB = new THREE.Vector3().fromBufferAttribute(position, iB);
        const vC = new THREE.Vector3().fromBufferAttribute(position, iC);
        // If all three vertices are on the surface, keep the face
        return (
            isVertexOnSurface(vA) &&
            isVertexOnSurface(vB) &&
            isVertexOnSurface(vC)
        );
    });

    // Group by similar normals
    const threshold = Math.cos(THREE.MathUtils.degToRad(angleThreshold));
    const clusters: { normal: THREE.Vector3; faces: typeof faces }[] = [];

    for (const f of outerFaces) {
        const found = clusters.find((c) => c.normal.dot(f.normal) > threshold);

        if (found) found.faces.push(f);
        else clusters.push({ normal: f.normal.clone(), faces: [f] });
    }

    // For each cluster, pick the face with the largest area
    return clusters.map((c) => {
        const maxFace = c.faces.reduce(
            (max, f) => (f.area > max.area ? f : max),
            c.faces[0]
        );
        return {
            normal: maxFace.normal,
            centroid: maxFace.centroid,
        };
    });
};

function SelectableFaces({
    faces,
    onSelect,
}: {
    faces: { normal: THREE.Vector3; centroid: THREE.Vector3 }[];
    onSelect: (face: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
    }) => void;
}) {
    return (
        <>
            {faces.map((f, i) => (
                <mesh
                    key={i}
                    position={f.centroid}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(f);
                    }}
                    castShadow
                >
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            ))}
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

    // Offset mesh so the selected face sits flush with the plane (z=0)
    mesh.position.z -= worldCentroid.z;
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
            const geom = mesh.geometry.clone();
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
    const scale = 0.1;
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
                const offsetZ = -minZ * scale; // flush with ground
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
            castShadow
            receiveShadow
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

const ViewModel: React.FC<ViewModelProps> = ({ file }) => {
    const isSTL = file?.name?.toLowerCase().endsWith(".stl");
    const is3MF = file?.name?.toLowerCase().endsWith(".3mf");

    const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
    const [detectedFaces, setDetectedFaces] = useState<
        { normal: THREE.Vector3; centroid: THREE.Vector3 }[]
    >([]);

    // Detect faces whenever mesh geometry changes
    useEffect(() => {
        if (mesh?.geometry) {
            mesh.geometry.computeVertexNormals();
            const faces = detectMajorFaces(mesh.geometry);

            // Apply scale to centroids (if scaled)
            const scaledFaces = faces.map((f) => ({
                normal: f.normal,
                centroid: f.centroid.clone(),
            }));
            console.log("Detected faces:", scaledFaces);

            setDetectedFaces(scaledFaces);
        }
    }, [mesh]);

    const handleFaceSelect = (face: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
    }) => {
        if (mesh) {
            alignModelToFace(mesh, face.normal, face.centroid);
        }
    };

    return (
        <div style={{ width: "100%", height: "500px" }}>
            {mesh && (
                <button onClick={() => exportAsSTL(mesh)}>Export as STL</button>
            )}
            <Canvas
                camera={{ position: [0, 10, 0], up: [0, 0, 1], fov: 50 }}
                onCreated={({ scene }) => {
                    scene.up.set(0, 0, 1);
                }}
                shadows
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
                                {detectedFaces.length > 0 && (
                                    <SelectableFaces
                                        faces={detectedFaces}
                                        onSelect={handleFaceSelect}
                                    />
                                )}
                            </primitive>
                        </>
                    )}

                    {/* Ground plane (slightly below z=0 to avoid z-fighting) */}
                    <mesh
                        receiveShadow
                        rotation={[0, 0, 0]}
                        position={[0, 0, -0.05]}
                    >
                        <planeGeometry args={[200, 200]} />
                        <meshStandardMaterial
                            color="#bbbbbb"
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </Suspense>

                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[5, 5, 10]}
                    castShadow
                    intensity={0.5}
                />
                <directionalLight position={[-5, -5, 10]} intensity={0.5} />
                <hemisphereLight groundColor={"#444444"} intensity={0.6} />

                <OrbitControls maxPolarAngle={Math.PI / 2 - 0.25} />
            </Canvas>
        </div>
    );
};

export default ViewModel;
