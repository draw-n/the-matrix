// Description: MeshViewer component for rendering and manipulating 3D models in STL and 3MF formats.

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState, Suspense, useRef } from "react";
import { Card, UploadFile, message, Spin } from "antd";
import axios from "axios";
import * as THREE from "three";
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
    // We keep the function signature compatible with the parent
    onRegister?: (api: { exportAndReplace: () => Promise<any> } | null) => void;
}

const MeshViewer = (props: MeshViewerProps) => {
    const { file, setFile, onRegister, allowFaceSelection } = props;
    const isSTL = file?.name?.toLowerCase().endsWith(".stl");
    const is3MF = file?.name?.toLowerCase().endsWith(".3mf");

    // Refs to track deduplication
    const analysisRequestId = useRef<string | null>(null);

    const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
    
    // Default to true so we don't flash the canvas before validation starts
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    
    const [detectedFaces, setDetectedFaces] = useState<any[]>([]);
    
    // Tracks the VISUAL alignment state
    const [suppressUntilMatrix, setSuppressUntilMatrix] = useState<THREE.Matrix4 | null>(null);
    
    // This is the key state: it holds the data of the face currently chosen as "Bottom"
    const [suppressedFace, setSuppressedFace] = useState<{
        centroid: THREE.Vector3;
        normal: THREE.Vector3;
    } | null>(null);

    // --- HELPER FUNCTIONS ---
    const matricesEqual = (m1: THREE.Matrix4 | null, m2: THREE.Matrix4 | null) => {
        if (!m1 || !m2) return false;
        const a = m1.elements;
        const b = m2.elements;
        for (let i = 0; i < 16; i++) {
            if (Math.abs(a[i] - b[i]) > 1e-9) return false;
        }
        return true;
    };

    const faceMatches = (a: any, b: any) => {
        if (!a || !b) return false;
        const dist = a.centroid.distanceTo(b.centroid);
        if (dist > 1e-3) return false; 
        const cos = a.normal.clone().normalize().dot(b.normal.clone().normalize());
        return cos > Math.cos(THREE.MathUtils.degToRad(5)); 
    };

    const parseFaceData = (f: any) => ({
        normal: new THREE.Vector3(f.normal.x, f.normal.y, f.normal.z),
        centroid: new THREE.Vector3(f.centroid.x, f.centroid.y, f.centroid.z),
        ellipseAxis: f.ellipseAxis
            ? new THREE.Vector3(f.ellipseAxis.x, f.ellipseAxis.y, f.ellipseAxis.z)
            : undefined,
        ellipseCenter: f.ellipseCenter
            ? new THREE.Vector3(f.ellipseCenter.x, f.ellipseCenter.y, f.ellipseCenter.z)
            : new THREE.Vector3(f.centroid.x, f.centroid.y, f.centroid.z),
        bottomVertex: new THREE.Vector3(f.bottomVertex.x, f.bottomVertex.y, f.bottomVertex.z),
        overlapArea: f.area,
        ellipseRadii: f.ellipseRadii,
        ellipseRotation: f.ellipseRotation,
    });

    // --- EFFECT: INITIALIZE ANALYSIS ---
    useEffect(() => {
        if (!file) return;

        // Reset state
        setMesh(null);
        setDetectedFaces([]);
        setSuppressUntilMatrix(null);
        setSuppressedFace(null);
        if (!file.originFileObj) {
            setIsAnalyzing(false);
            return;
        }
        setIsAnalyzing(true);
        
        const runValidation = async () => {
             // Deduplication
            if (analysisRequestId.current === file.uid) return;
            analysisRequestId.current = file.uid;

            try {
                const form = new FormData();
                form.append("file", file.originFileObj as File);

                const resp = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`,
                    form,
                    { headers: { "Content-Type": "multipart/form-data" } },
                );

                const faces = resp.data.faces;
                const detected = faces.map(parseFaceData);
                setDetectedFaces(detected);
                
                setIsAnalyzing(false);

            } catch (err: any) {
                setDetectedFaces([]);

                let errorMsg = "Failed to analyze mesh.";
                if (err.response && err.response.data) {
                    const { message: msg, details } = err.response.data;
                    errorMsg = details ? `${msg}: ${details}` : msg;
                } else if (err.message) {
                    errorMsg = `Request Error: ${err.message}`;
                }
                
                message.error(errorMsg);

                if (setFile) {
                    setFile([]);
                } else {
                    setIsAnalyzing(false); 
                }
            }
        };

        runValidation();
    }, [file]);

    // --- EFFECT: AUTO ALIGNMENT ---
    useEffect(() => {
        if (mesh && detectedFaces.length > 0) {
            if (!suppressUntilMatrix) {
                const largest = detectedFaces.reduce((a: any, b: any) =>
                    a.overlapArea > b.overlapArea ? a : b,
                );
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

    useEffect(() => {
        if (!mesh) return;
        if (suppressUntilMatrix && !matricesEqual(suppressUntilMatrix, mesh.matrixWorld)) {
            setSuppressUntilMatrix(null);
            setSuppressedFace(null);
        }
    }, [mesh?.matrixWorld]);

    // --- NEW: SERVER-SIDE ROTATION ---
    // This replaces the old export logic.
    const exportAndReplace = async () => {
        if (!mesh) {
            message.error("No mesh loaded.");
            throw new Error("No mesh loaded");
        }

        // Case 1: No Face Selected / Manual Rotation
        // If the user rotated the model manually or didn't select a face,
        // suppressedFace will be null. In this pipeline, that means "keep original".
        if (!suppressedFace) {
            // We just return success because the original file is already on the server
            // and we are choosing not to modify it.
            return { message: "Using original orientation" };
        }

        // Case 2: Face Selected
        // We instruct the backend to apply the rotation permanently.
        try {
            message.loading({ content: "Aligning mesh on server...", key: "aligning" });
            
            const payload = {
                fileName: file.name,
                normal: { 
                    x: suppressedFace.normal.x, 
                    y: suppressedFace.normal.y, 
                    z: suppressedFace.normal.z 
                },
                centroid: {
                    x: suppressedFace.centroid.x,
                    y: suppressedFace.centroid.y,
                    z: suppressedFace.centroid.z
                }
            };

            const resp = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/jobs/place-on-face`,
                payload
            );

            message.success({ content: "Mesh aligned successfully!", key: "aligning" });
            
            // Note: We do NOT need to update 'file' or 'setFile' here because
            // the filename hasn't changed, only the content on the server.
            // The next step in your wizard will simply use the file that is already there.
            return resp.data;

        } catch (err: any) {
            console.error("Error aligning mesh:", err);
            message.error({ content: "Failed to align mesh on server", key: "aligning" });
            throw err;
        }
    };

    // Register API with parent
    useEffect(() => {
        onRegister?.({ exportAndReplace });
        return () => onRegister?.(null);
    }, [onRegister, mesh, suppressedFace, file]); // Added suppressedFace dependency so closure is fresh

    const handleFaceSelect = (face: { normal: THREE.Vector3; centroid: THREE.Vector3 }) => {
        if (mesh) {
            alignModelToFace(mesh, face.normal, face.centroid);
            mesh.updateMatrixWorld(true);
            setSuppressUntilMatrix(mesh.matrixWorld.clone());
            setSuppressedFace({
                centroid: face.centroid.clone(),
                normal: face.normal.clone(),
            });
        }
    };

    const markerSizeForRender = (() => {
        if (!mesh) return 0.5;
        const bbox = new THREE.Box3().setFromObject(mesh);
        const size = bbox.getSize(new THREE.Vector3());
        return Math.max(0.005, Math.min(size.x, size.y, size.z) * 0.03);
    })();

    return (
        <Card 
            style={{ width: "100%", height: "500px" }}
            bodyStyle={{ padding: 0, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
            {isAnalyzing ? (
                <Spin tip="Validating Geometry & Detecting Faces..." size="large" />
            ) : (
                <Canvas
                    camera={{ position: [0, 10, 0], up: [0, 0, 1], fov: 50 }}
                    onCreated={({ scene }) => { scene.up.set(0, 0, 1); }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Suspense fallback={null}>
                        <HandleContextLoss />
                        {file && isSTL && <ModelSTL file={file} onLoad={setMesh} />}
                        {file && is3MF && <Model3MF file={file} onLoad={setMesh} />}
                        
                        {mesh && (
                            <>
                                <FocusCameraOnLoad mesh={mesh} />
                                <primitive object={mesh}>
                                    {detectedFaces.length > 0 && (() => {
                                        if (
                                            suppressUntilMatrix &&
                                            suppressedFace &&
                                            matricesEqual(suppressUntilMatrix, mesh.matrixWorld)
                                        ) {
                                            const visible = detectedFaces.filter(
                                                (df) => !faceMatches(df, suppressedFace),
                                            );
                                            return allowFaceSelection && (
                                                <SelectableFaces
                                                    faces={visible}
                                                    onSelect={handleFaceSelect}
                                                    markerSize={markerSizeForRender}
                                                />
                                            );
                                        }
                                        return allowFaceSelection && (
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

                        <mesh rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
                            <planeGeometry args={[300, 300]} />
                            <meshStandardMaterial color="#bbbbbb" side={THREE.DoubleSide} />
                        </mesh>
                    </Suspense>

                    <ambientLight intensity={0.3} />
                    <directionalLight position={[5, 5, 10]} intensity={0.5} />
                    <directionalLight position={[-5, -5, 10]} intensity={0.5} />
                    <hemisphereLight groundColor={"#444444"} intensity={0.6} />
                    <OrbitControls maxPolarAngle={Math.PI / 2 - 0.25} />
                </Canvas>
            )}
        </Card>
    );
};

export default MeshViewer;