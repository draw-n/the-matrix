// Description: MeshViewer component for rendering and manipulating 3D models in STL and 3MF formats.

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState, Suspense, useRef } from "react";
import { Card, UploadFile, message, Spin } from "antd";
import { Popover, Button } from "antd";
import axios from "axios";
import * as THREE from "three";
import alignModelToFace from "./faces/alignModelToFace";
import HandleContextLoss from "./webgl/HandleContextLoss";
import ModelSTL from "./loaders/ModelSTL";
import Model3MF from "./loaders/Model3MF";
import FocusCameraOnLoad from "./camera/FocusCameraOnLoad";
import SelectableFaces from "./faces/SelectableFaces";
import { GridHelper } from "three";
import { faceMatches, matricesEqual, parseFaceData } from "./utils/faceData";
import { exportAndReplace, runValidation } from "./utils/exportAndReplace";
import { MeshFace } from "../../types/job";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

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

    const [detectedFaces, setDetectedFaces] = useState<MeshFace[]>([]);

    // Tracks the VISUAL alignment state
    const [suppressUntilMatrix, setSuppressUntilMatrix] =
        useState<THREE.Matrix4 | null>(null);

    // This is the key state: it holds the data of the face currently chosen as "Bottom"
    const [suppressedFace, setSuppressedFace] = useState<MeshFace | null>(null);

    // --- EFFECT: INITIALIZE ANALYSIS ---
    // Only run validation/fetch & face-detection when face selection is enabled
    useEffect(() => {
        if (!file) return;

        // Reset state
        setMesh(null);
        setDetectedFaces([]);
        setSuppressUntilMatrix(null);
        setSuppressedFace(null);

        // Skip validation when face selection is disabled (Review mode).
        if (!allowFaceSelection) {
            setIsAnalyzing(false);
            return;
        }

        // If we have a local file object, run validation normally.
        if (file.originFileObj) {
            setIsAnalyzing(true);
            runValidation(
                analysisRequestId,
                file,
                setDetectedFaces,
                setIsAnalyzing,
                setFile,
            );
            return;
        }

        // If we don't have a local file but do have a URL (i.e. we previously
        // uploaded and replaced the file for server-side use), fetch the file
        // from the URL and run validation on the fetched blob so faces persist
        // when navigating back to this step.
        if (file.url) {
            setIsAnalyzing(true);
            const controller = new AbortController();

            (async () => {
                try {
                    const resp = await axios.get(file.url as string, {
                        responseType: "arraybuffer",
                        signal: controller.signal,
                    });

                    const blob = new Blob([resp.data]);
                    const fetchedFile = new File([blob], file.name || "model", {
                        type: "application/octet-stream",
                    });

                    // Pass a transient UploadFile-like object to runValidation
                    const transient = {
                        ...file,
                        originFileObj: fetchedFile,
                    } as any;

                    runValidation(
                        analysisRequestId,
                        transient,
                        setDetectedFaces,
                        setIsAnalyzing,
                        setFile,
                    );
                } catch (err) {
                    if (!axios.isCancel(err)) {
                        console.error(
                            "Failed to fetch model for validation:",
                            err,
                        );
                        setIsAnalyzing(false);
                    }
                }
            })();

            return () => controller.abort();
        }

        // No originFileObj and no url — nothing to validate.
        setIsAnalyzing(false);
    }, [file]);

    // --- EFFECT: AUTO ALIGNMENT ---
    useEffect(() => {
        // Only auto-align when face selection is enabled and we have detection results.
        if (!allowFaceSelection) return;
        if (mesh && detectedFaces.length > 0) {
            if (!suppressUntilMatrix) {
                alignModelToFace(
                    mesh,
                    detectedFaces[0].normal,
                    detectedFaces[0].centroid,
                );
                mesh.updateMatrixWorld(true);
                setSuppressUntilMatrix(mesh.matrixWorld.clone());
                setSuppressedFace({
                    centroid: detectedFaces[0].centroid.clone(),
                    normal: detectedFaces[0].normal.clone(),
                });
            }
        }
    }, [mesh, detectedFaces, allowFaceSelection]);

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

    // Register API with parent
    useEffect(() => {
        onRegister?.({
            exportAndReplace: () =>
                exportAndReplace(mesh, suppressedFace, file),
        });
        return () => onRegister?.(null);
    }, [onRegister, mesh, suppressedFace, file]); // Added suppressedFace dependency so closure is fresh

    const handleFaceSelect = (face: MeshFace) => {
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

    return (
        <Card
            style={{ width: "100%", height: "500px", position: "relative" }}
            bodyStyle={{
                padding: 0,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Top-right hoverable icon */}
            <div style={{ position: "absolute", top: 8, right: 8, zIndex: 20 }}>
                <Popover
                    content={
                        <div style={{ maxWidth: 260 }}>
                            Left click and drag to rotate and scroll to zoom.
                            Right click and drag to pan. Hover faces to preview
                            selections. Left click a face to align it to the
                            build plate. It's recommended to align the largest
                            flat face to the build plate.
                        </div>
                    }
                    trigger="hover"
                    placement="left"
                >
                    <Button
                        size="large"
                        shape="circle"
                        type="text"
                        icon={<QuestionCircleOutlined />}
                    />
                </Popover>
            </div>
            {isAnalyzing ? (
                <Spin
                    tip="Validating Geometry & Detecting Faces..."
                    size="large"
                />
            ) : (
                <Canvas
                    camera={{ position: [0, 10, 0], up: [0, 0, 1], fov: 50 }}
                    onCreated={({ scene }) => {
                        scene.up.set(0, 0, 1);
                    }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <Suspense fallback={null}>
                        <HandleContextLoss />
                        {file && isSTL && (
                            <ModelSTL file={file} onLoad={setMesh} />
                        )}
                        {file && is3MF && (
                            <Model3MF file={file} onLoad={setMesh} />
                        )}

                        {mesh && (
                            <>
                                <FocusCameraOnLoad mesh={mesh} />

                                <primitive object={mesh}>
                                    {detectedFaces.length > 0 &&
                                        (() => {
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
                                                        />
                                                    )
                                                );
                                            }
                                            return (
                                                allowFaceSelection && (
                                                    <SelectableFaces
                                                        faces={detectedFaces}
                                                        onSelect={
                                                            handleFaceSelect
                                                        }
                                                    />
                                                )
                                            );
                                        })()}
                                </primitive>
                            </>
                        )}
                        <mesh rotation={[0, 0, 0]} position={[0, 0, 120.1]}>
                            <lineSegments>
                                <edgesGeometry
                                    attach="geometry"
                                    args={[
                                        new THREE.BoxGeometry(300, 300, 240),
                                    ]}
                                />
                                <lineBasicMaterial
                                    attach="material"
                                    color="black"
                                    linewidth={2} // Increase line width for better visibility
                                    depthTest={false} // Ensure edges are always visible
                                />
                            </lineSegments>
                        </mesh>

                        <mesh rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
                            <planeGeometry args={[300, 300]} />
                            <meshBasicMaterial // Changed to meshBasicMaterial to ensure color is independent of lighting
                                color="#eef"
                                side={THREE.DoubleSide}
                            />
                        </mesh>

                        <mesh>
                            <gridHelper
                                args={[300, 10, "black"]}
                                rotation={[-Math.PI / 2, 0, 0]}
                            />
                            <axesHelper
                                position={[-149.95, -149.95, 0]}
                                args={[50]}
                            />
                        </mesh>
                    </Suspense>
                    <ambientLight intensity={1} />
                    <directionalLight
                        position={[0, 0, 240]}
                        intensity={1.5}
                        castShadow
                    />
                    <hemisphereLight groundColor={"#eef"} intensity={0.6} />
                    <OrbitControls
                        minDistance={20}
                        maxDistance={500}
                        maxPolarAngle={Math.PI / 2 - 0.25}
                    />
                </Canvas>
            )}
        </Card>
    );
};

export default MeshViewer;
