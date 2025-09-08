import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader, ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { useEffect, useMemo, useState, Suspense } from "react";
import { UploadFile } from "antd";
import * as THREE from "three";

interface ViewModelProps {
    file: UploadFile;
}
function Model3MF({ file }: ViewModelProps) {
    const objectUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file.originFileObj as Blob);
    }, [file]);

    const [object, setObject] = useState<THREE.Object3D | null>(null);
    const [position, setPosition] = useState<[number, number, number]>([
        0, 0, 0,
    ]);

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new ThreeMFLoader();
        loader.load(
            objectUrl,
            (obj) => {
                // Compute bounding box of full object
                const bbox = new THREE.Box3().setFromObject(obj);
                const minY = bbox.min.y;

                // Position it so it rests on the plane (y = 0)
                setPosition([0, -minY, 0]);

                setObject(obj);
            },
            undefined,
            (err) => {
                console.error("Error loading 3MF:", err);
                setObject(null);
            }
        );

        return () => {
            URL.revokeObjectURL(objectUrl);
            if (object) {
                object.traverse((child) => {
                    if ((child as THREE.Mesh).geometry) {
                        (child as THREE.Mesh).geometry.dispose();
                    }
                    if ((child as THREE.Mesh).material) {
                        const mat = (child as THREE.Mesh).material;
                        if (Array.isArray(mat)) {
                            mat.forEach((m) => m.dispose());
                        } else {
                            mat.dispose();
                        }
                    }
                });
            }
        };
    }, [objectUrl]);

    if (!object) return null;

    return <primitive object={object} position={position} />;
}

function ModelSTL({ file }: ViewModelProps) {
    const objectUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file.originFileObj as Blob);
    }, [file]);

    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
    const [position, setPosition] = useState<[number, number, number]>([
        0, 0, 0,
    ]);
    const scale = 0.1;

    useEffect(() => {
        if (!objectUrl) return;

        const loader = new STLLoader();
        loader.load(
            objectUrl,
            (geo) => {
                geo.computeBoundingBox();
                const bbox = geo.boundingBox!;
                const minY = bbox.min.y;

                // Scale-aware position offset
                const offsetY = -minY * scale;

                setPosition([0, offsetY, 0]);
                setGeometry(geo);
            },
            undefined,
            (err) => {
                console.error("Error loading STL:", err);
                setGeometry(null);
            }
        );

        return () => {
            URL.revokeObjectURL(objectUrl);
            if (geometry) geometry.dispose();
        };
    }, [objectUrl]);

    if (!geometry) return null;

    return (
        <mesh geometry={geometry} scale={scale} position={position}>
            <meshStandardMaterial color="orange" />
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

const ViewModel: React.FC<ViewModelProps> = ({ file }: ViewModelProps) => {
    const isSTL = file?.name?.toLowerCase().endsWith(".stl");
    const is3MF = file?.name?.toLowerCase().endsWith(".3mf");

    return (
        <div style={{ width: "100%", height: "500px" }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <Suspense fallback={null}>
                    <HandleContextLoss />
                    {file && isSTL && <ModelSTL file={file} />}
                    {file && is3MF && <Model3MF file={file} />}
                    <mesh>
                        <planeGeometry args={[1000, 1000]} />
                        <meshStandardMaterial
                            color="#bbbbbb"
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </Suspense>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 0, 5]} intensity={1} />
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default ViewModel;
