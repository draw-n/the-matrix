// Description: MeshViewer component for rendering and manipulating 3D models in STL and 3MF formats.

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLExporter } from "three/examples/jsm/Addons.js";
import { useEffect, useState, Suspense } from "react";
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

    // Fetch detected faces from backend for STL/3MF
    // For STL: fetch faces immediately. For 3MF: wait for mesh to be loaded, then convert and fetch faces.
    useEffect(() => {
        if (!file || !allowFaceSelection) {
            setDetectedFaces([]);
            return;
        }

        // STL: fetch faces immediately
        if (isSTL) {
            const fetchFaces = async () => {
                try {
                    const form = new FormData();
                    form.append("file", file.originFileObj as File);
                    const resp = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`,
                        form,
                        { headers: { "Content-Type": "multipart/form-data" } },
                    );
                    const faces = resp.data.faces;
                    const detected = faces.map((f: any) => ({
                        normal: new THREE.Vector3(...f.normal).normalize(),
                        centroid: new THREE.Vector3(...f.centroid),
                        bottomVertex: new THREE.Vector3(...f.bottomVertex),
                        overlapArea: f.overlapArea,
                        ellipseRadii: f.ellipseRadii,
                        ellipseRotation: f.ellipseRotation,
                    }));
                    setDetectedFaces(detected);
                    // Automatically align to largest face
                    if (detected.length > 0 && mesh) {
                        const largest = detected.reduce((a: any, b: any) =>
                            a.overlapArea > b.overlapArea ? a : b,
                        );
                        alignModelToFace(
                            mesh,
                            largest.normal,
                            largest.centroid,
                        );
                        mesh.updateMatrixWorld(true);
                        setSuppressUntilMatrix(mesh.matrixWorld.clone());
                        setSuppressedFace({
                            centroid: largest.centroid.clone(),
                            normal: largest.normal.clone(),
                        });
                    }
                } catch (err) {
                    console.error("Face detection failed:", err);
                    setDetectedFaces([]);
                    message.error("Failed to analyze mesh faces.");
                }
            };
            fetchFaces();
        }
    }, [file, allowFaceSelection, mesh]);

    // For 3MF: fetch faces only after mesh is loaded
    useEffect(() => {
        if (!file || !allowFaceSelection || !is3MF || !mesh) return;
        const fetchFaces = async () => {
            try {
                const exporter = new STLExporter();
                const baked = getExportableMesh(mesh as THREE.Mesh);
                const stlBuffer = exporter.parse(baked, { binary: true });
                const uploadFileObj = new File(
                    [new Blob([stlBuffer], { type: "model/stl" })],
                    file.name.replace(/\.3mf$/i, ".stl"),
                    { type: "model/stl" },
                );

                const form = new FormData();
                form.append("file", uploadFileObj);
                const resp = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`,
                    form,
                    { headers: { "Content-Type": "multipart/form-data" } },
                );
                const faces = resp.data.faces;
                const detected = faces.map((f: any) => ({
                    normal: new THREE.Vector3(...f.normal).normalize(),
                    centroid: new THREE.Vector3(...f.centroid),
                    bottomVertex: new THREE.Vector3(...f.bottomVertex),
                    overlapArea: f.overlapArea,
                    ellipseRadii: f.ellipseRadii,
                    ellipseRotation: f.ellipseRotation,
                }));
                setDetectedFaces(detected);
                // Automatically align to largest face
                if (detected.length > 0 && mesh) {
                    const largest = detected.reduce((a: any, b: any) =>
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
            } catch (err) {
                console.error("Face detection failed:", err);
                setDetectedFaces([]);
                message.error("Failed to analyze mesh faces.");
            }
        };
        fetchFaces();
    }, [file, allowFaceSelection, is3MF, mesh]);

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
    // aligned matrix (so overlays reappear after the user rotates/moves the
    // model). Also clear the suppressedFace record.
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
            alignModelToFace(mesh, face.normal, face.centroid);
            // After aligning, suppress overlays while the mesh remains in this
            // aligned transform so the selected bottom face disappears.
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
        </Card>
    );
};

export default MeshViewer;
