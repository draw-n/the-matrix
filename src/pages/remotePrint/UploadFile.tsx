// Description: UploadFile component for uploading and previewing 3D model files before proceeding to material selection.

import axios from "axios";
import { useRef, useState } from "react";

import {
    CaretLeftOutlined,
    CaretRightOutlined,
    DeleteOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import { Button, Flex, message, Upload, UploadProps } from "antd";
import type { UploadFile } from "antd";

import MeshViewer from "../../components/meshViewer/MeshViewer";
const { Dragger } = Upload;

interface UploadFileProps {
    next: () => void;
    prev: () => void;
    uploadedFile: UploadFile[];
    setUploadedFile: (item: UploadFile[]) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({
    next,
    prev,
    uploadedFile,
    setUploadedFile,
}: UploadFileProps) => {
    // Loading state for the network request
    const [isProcessing, setIsProcessing] = useState(false);

    // Store the API object registered by MeshViewer
    const viewModelApiRef = useRef<{
        exportAndReplace?: () => Promise<any>;
    } | null>(null);

    const handleSubmit = async () => {
        if (uploadedFile.length === 0) {
            message.error("You must upload a file!");
            return;
        }

        setIsProcessing(true);

        try {
            if (viewModelApiRef.current?.exportAndReplace) {
                const resp = await viewModelApiRef.current.exportAndReplace();

                if (resp) {
                    // --- FIX: Update the file state to point to the backend ---
                    // This ensures the Review step downloads the NEW rotated file
                    // instead of showing the OLD local blob.

                    // Construct the URL to your file on the backend
                    // You might need an endpoint to serve meshes, e.g., /meshes/filename.stl
                    const serverFileUrl = `${import.meta.env.VITE_BACKEND_URL}/meshes/${uploadedFile[0].name}`;

                    const updatedFile = {
                        ...uploadedFile[0],
                        url: serverFileUrl, // React components prefer 'url'
                        originFileObj: undefined, // Clear the local blob so viewers are forced to fetch URL
                    };

                    setUploadedFile([updatedFile]);

                    next();
                }
            } else {
                next();
            }
        } catch (error) {
            console.error("Error processing model: ", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const props: UploadProps = {
        beforeUpload: (file) => {
            // 1. Validate File Extension
            const isValidExtension =
                file.name.toLowerCase().endsWith(".stl") ||
                file.name.toLowerCase().endsWith(".3mf");

            if (!isValidExtension) {
                message.error("Only STL and 3MF files are supported.");
                return Upload.LIST_IGNORE;
            }

            // 2. Validate File Size (50MB)
            const isLt50M = file.size / 1024 / 1024 < 50;

            if (!isLt50M) {
                message.error("File must be smaller than 50MB.");
                return Upload.LIST_IGNORE;
            }

            // 3. Update State
            setUploadedFile([
                {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    originFileObj: file,
                },
            ]);

            return false; // Prevent auto upload
        },
        showUploadList: false,
    };

    return (
        <>
            <Flex vertical style={{ width: "100%" }} gap="large">
                <h2>UPLOAD FILE</h2>
                <p>
                    Note: You can only upload files with the .stl or .3mf
                    extensions. We do not support other file types for remote
                    printing at this time. If you wish to use a different mesh
                    file type, please visit the Digital Fabrication lab
                    in-person to print.
                </p>
                <Dragger
                    disabled={uploadedFile.length > 0}
                    {...props}
                    fileList={[]}
                    style={{ width: "100%" }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                </Dragger>
                {uploadedFile.length > 0 && (
                    <div style={{ width: "100%", marginTop: 4 }}>
                        <ul
                            style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                            {uploadedFile.map((f) => (
                                <li
                                    key={f.uid}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        borderBottom: "1px solid #eee",
                                    }}
                                >
                                    <span>{f.name}</span>
                                    <div>
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            type="link"
                                            onClick={() => {
                                                setUploadedFile([]);
                                                if (viewModelApiRef.current) {
                                                    viewModelApiRef.current =
                                                        null;
                                                }
                                            }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* MeshViewer Component */}
                {uploadedFile.length > 0 && (
                    <MeshViewer
                        allowFaceSelection
                        onRegister={(api) => (viewModelApiRef.current = api)}
                        file={uploadedFile[0]}
                        setFile={setUploadedFile}
                    />
                )}

                <Flex gap="middle" justify="center" style={{ width: "100%" }}>
                    <Button
                        icon={<CaretLeftOutlined />}
                        iconPosition="start"
                        onClick={prev}
                    >
                        Introduction
                    </Button>
                    <Button
                        type="primary"
                        icon={<CaretRightOutlined />}
                        iconPosition="end"
                        onClick={handleSubmit}
                        loading={isProcessing} // <--- Shows loading state during backend rotation
                    >
                        Select Material
                    </Button>
                </Flex>
            </Flex>
        </>
    );
};

export default UploadFile;
