// Description: MeshViewer component for rendering and manipulating 3D models in STL and 3MF formats.

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLExporter } from "three/examples/jsm/Addons.js";
import { useEffect, useState, Suspense, useRef } from "react";
import { Card, UploadFile, message } from "antd";
import axios from "axios";
import * as THREE from "three";
import getExportableMesh from "./utils/getExportableMesh";
import alignModelToFace from "./faces/alignModelToFace";
import HandleContextLoss from "./webgl/HandleContextLoss";
import ModelSTL from "./loaders/ModelSTL";
import Model3MF from "./loaders/Model3MF";
import FocusCameraOnLoad from "./camera/FocusCameraOnLoad";
import SelectableFaces from "./faces/SelectableFaces";

interface MeshViewerProps {
    allowFaceSelection?: boolean;
    file: UploadFile;
    setFile?: (files: UploadFile[]) => void;
    // Registration callback so parents can receive an exported API without needing a ref
    onRegister?: (api: { exportAndReplace: () => Promise<any> } | null) => void;
}

const MeshViewer = (props: MeshViewerProps) => {
    const { file, setFile, onRegister, allowFaceSelection } = props;
    const isSTL = file?.name?.toLowerCase().endsWith(".stl");
    const is3MF = file?.name?.toLowerCase().endsWith(".3mf");

    // Refs to track API call deduplication
    const analysisRequestId = useRef<string | null>(null);

    const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
    const [detectedFaces, setDetectedFaces] = useState<
        {
            normal: THREE.Vector3;
            centroid: THREE.Vector3;
            ellipseAxis?: THREE.Vector3;
            ellipseCenter: THREE.Vector3; // Visual center for the ellipse
            bottomVertex: THREE.Vector3;
            overlapArea?: number;
            ellipseRadii?: [number, number];
            ellipseRotation?: number;
        }[]
    >([]);

    // State for suppressing the selected bottom face overlay when aligned
    const [suppressUntilMatrix, setSuppressUntilMatrix] =
        useState<THREE.Matrix4 | null>(null);
    const [suppressedFace, setSuppressedFace] = useState<{
        centroid: THREE.Vector3;
        normal: THREE.Vector3;
    } | null>(null);

    const matricesEqual = (
        m1: THREE.Matrix4 | null,
        m2: THREE.Matrix4 | null,
    ) => {
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
        b: { centroid: THREE.Vector3; normal: THREE.Vector3 } | null,
    ) => {
        if (!a || !b) return false;
        const dist = a.centroid.distanceTo(b.centroid);
        if (dist > 1e-3) return false; // centroid tolerance
        const cos = a.normal
            .clone()
            .normalize()
            .dot(b.normal.clone().normalize());
        return cos > Math.cos(THREE.MathUtils.degToRad(5)); // within 5 degrees
    };

    // Helper to parse face data from backend
    const parseFaceData = (f: any) => ({
        normal: new THREE.Vector3(f.normal.x, f.normal.y, f.normal.z),
        centroid: new THREE.Vector3(f.centroid.x, f.centroid.y, f.centroid.z),
        ellipseAxis: f.ellipseAxis
            ? new THREE.Vector3(
                  f.ellipseAxis.x,
                  f.ellipseAxis.y,
                  f.ellipseAxis.z,
              )
            : undefined,
        // Use ellipseCenter if provided by backend (Visual Center), otherwise fallback to Centroid
        ellipseCenter: f.ellipseCenter
            ? new THREE.Vector3(
                  f.ellipseCenter.x,
                  f.ellipseCenter.y,
                  f.ellipseCenter.z,
              )
            : new THREE.Vector3(f.centroid.x, f.centroid.y, f.centroid.z),
        bottomVertex: new THREE.Vector3(
            f.bottomVertex.x,
            f.bottomVertex.y,
            f.bottomVertex.z,
        ),
        overlapArea: f.area, // Map backend 'area' to local 'overlapArea'
        ellipseRadii: f.ellipseRadii,
        ellipseRotation: f.ellipseRotation,
    });

    // --- EFFECT: RESET STATE ON NEW FILE ---
    useEffect(() => {
        setMesh(null);
        setDetectedFaces([]);
        setSuppressUntilMatrix(null);
        setSuppressedFace(null);
        // Do NOT reset analysisRequestId here; we handle it in the specific effect checks
        // or by letting the new file UID trigger the new request naturally.
    }, [file]);



    // --- EFFECT: FETCH FACES (3MF ONLY) ---
    // Depends on 'mesh' because 3MF needs to be loaded/baked first
  useEffect(() => {
        if (!file || !allowFaceSelection || !mesh) return;

        // Deduplication for 3MF
        if (analysisRequestId.current === file.uid) return;
        analysisRequestId.current = file.uid;

        const fetchFaces = async () => {
            try {
                const form = new FormData();
                // FIX: Send the original 3MF file directly
                form.append("file", file.originFileObj as File);
                
                const resp = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`,
                    form,
                    { headers: { "Content-Type": "multipart/form-data" } },
                );

                const faces = resp.data.faces;
                const detected = faces.map(parseFaceData);
                setDetectedFaces(detected);
            } catch (err) {
                console.error("Face detection failed:", err);
                setDetectedFaces([]);
                message.error("Failed to analyze mesh faces.");
            }
        };
        fetchFaces();
    }, [file, allowFaceSelection, mesh]);

    // --- EFFECT: AUTO-ALIGNMENT ---
    // Runs when faces are loaded AND mesh is ready.
    useEffect(() => {
        if (mesh && detectedFaces.length > 0) {
            // Check if we are already suppressed (aligned), to prevent loops
            // If suppressUntilMatrix is null, it means we haven't aligned yet.
            if (!suppressUntilMatrix) {
                const largest = detectedFaces.reduce((a: any, b: any) =>
                    a.overlapArea > b.overlapArea ? a : b,
                );

                // Align using PHYSICAL centroid
                alignModelToFace(mesh, largest.normal, largest.centroid);
                mesh.updateMatrixWorld(true);

                setSuppressUntilMatrix(mesh.matrixWorld.clone());
                setSuppressedFace({
                    centroid: largest.centroid.clone(),
                    normal: largest.normal.clone(),
                });
            }
        }
    }, [mesh, detectedFaces]);

    // Provide an API via onRegister so parents don't need a ref
    const exportAndReplace = async () => {
        if (!mesh) {
            message.error("No mesh loaded to export");
            throw new Error("No mesh loaded");
        }

        try {
            const exporter = new STLExporter();
            const baked = getExportableMesh(mesh as THREE.Mesh);
            const stlBuffer = exporter.parse(baked, { binary: true });
            const blob = new Blob([stlBuffer], { type: "model/stl" });

            const base = (file && file.name) || "exported_model";
            const exportName = base.toLowerCase().endsWith(".stl")
                ? base
                : `${base}.stl`;
            const fileObj = new File([blob], exportName, { type: "model/stl" });

            const form = new FormData();
            form.append("file", fileObj);

            const action = `${
                import.meta.env.VITE_BACKEND_URL
            }/jobs/pre-process`;
            const resp = await axios.post(action, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const url =
                resp.data?.url ||
                resp.data?.fileUrl ||
                resp.data?.location ||
                "";

            const uploadFile: UploadFile = {
                uid: `${Date.now()}`,
                name: fileObj.name,
                status: "done",
                url,
                originFileObj: fileObj as any,
            };

            if (setFile) setFile([uploadFile]);
            message.success("Mesh pre-processed and uploaded successfully.");
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
    // aligned matrix (so overlays reappear after the user rotates/moves the model).
    useEffect(() => {
        if (!mesh) return;
        if (
            suppressUntilMatrix &&
            !matricesEqual(suppressUntilMatrix, mesh.matrixWorld)
        ) {
            setSuppressUntilMatrix(null);
            setSuppressedFace(null);
        }
    }, [mesh?.matrixWorld]);

    const handleFaceSelect = (face: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
    }) => {
        if (mesh) {
            // Align using PHYSICAL centroid
            alignModelToFace(mesh, face.normal, face.centroid);
            mesh.updateMatrixWorld(true);
            setSuppressUntilMatrix(mesh.matrixWorld.clone());
            setSuppressedFace({
                centroid: face.centroid.clone(),
                normal: face.normal.clone(),
            });
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
        <Card style={{ width: "100%", height: "500px" }}>
            <Canvas
                camera={{ position: [0, 10, 0], up: [0, 0, 1], fov: 50 }}
                onCreated={({ scene }) => {
                    scene.up.set(0, 0, 1);
                }}
            >
                <Suspense fallback={null}>
                    <HandleContextLoss />

                    {/* Load model */}
                    {file && isSTL && (
                        <ModelSTL
                            file={file}
                            onLoad={(mesh) => {
                                setMesh(mesh);
                            }}
                        />
                    )}
                    {file && is3MF && (
                        <Model3MF
                            file={file}
                            onLoad={(mesh) => {
                                setMesh(mesh);
                            }}
                        />
                    )}
                    {mesh && (
                        <>
                            <FocusCameraOnLoad mesh={mesh} />
                            <primitive object={mesh}>
                                {detectedFaces.length > 0 &&
                                    (() => {
                                        // Filter out the "suppressed" face if aligned
                                        if (
                                            suppressUntilMatrix &&
                                            suppressedFace &&
                                            matricesEqual(
                                                suppressUntilMatrix,
                                                mesh.matrixWorld,
                                            )
                                        ) {
                                            const visible =
                                                detectedFaces.filter(
                                                    (df) =>
                                                        !faceMatches(
                                                            df,
                                                            suppressedFace,
                                                        ),
                                                );
                                            return (
                                                allowFaceSelection && (
                                                    <SelectableFaces
                                                        faces={visible}
                                                        onSelect={
                                                            handleFaceSelect
                                                        }
                                                        markerSize={
                                                            markerSizeForRender
                                                        }
                                                    />
                                                )
                                            );
                                        }
                                        // Show all faces if not aligned or rotated away
                                        return (
                                            allowFaceSelection && (
                                                <SelectableFaces
                                                    faces={detectedFaces}
                                                    onSelect={handleFaceSelect}
                                                    markerSize={
                                                        markerSizeForRender
                                                    }
                                                />
                                            )
                                        );
                                    })()}
                            </primitive>
                        </>
                    )}

                    {/* Ground plane */}
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
        </Card>
    );
};

export default MeshViewer;