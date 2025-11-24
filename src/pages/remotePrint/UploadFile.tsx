// Description: UploadFile component for uploading and previewing 3D model files before proceeding to material selection.

import axios from "axios";
import { useRef } from "react";

import {
    CaretRightOutlined,
    DeleteOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import { Button, Flex, message, Upload, UploadProps } from "antd";
import type { UploadFile } from "antd";

import ViewModel from "./components/ViewModel";
const { Dragger } = Upload;

interface UploadFileProps {
    next: () => void;
    uploadedFile: UploadFile[];
    setUploadedFile: (item: UploadFile[]) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({
    next,
    uploadedFile,
    setUploadedFile,
}: UploadFileProps) => {
    // store the small API object registered by ViewModel (avoids forwarded refs)
    const viewModelApiRef = useRef<{
        exportAndReplace?: () => Promise<any>;
    } | null>(null);

    const handleSubmit = async () => {
        if (uploadedFile.length === 0) {
            message.error("You must upload a file!");
        } else {
            try {
                if (viewModelApiRef.current?.exportAndReplace) {
                    const resp =
                        await viewModelApiRef.current.exportAndReplace();
                    if (resp) {
                        next();
                    }
                }
            } catch (error) {
                console.error("Error exporting and replacing model: ", error);
                message.error(
                    "There was an error processing your model. Please try again."
                );
            }
        }
    };

    const props: UploadProps = {
        action: `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`,
        name: "file",
        headers: {
            authorization: "authorization-text",
        },

        onChange: (info) => {
            let newFileList = [...info.fileList];

            // Limit the number of uploaded files
            newFileList = newFileList.slice(-1);
            newFileList = newFileList.map((file) => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.url;
                }
                return file;
            });
            setUploadedFile(newFileList);
        },

        customRequest: async (options: any) => {
            const data = new FormData();
            data.append("file", options.file);
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            await axios
                .post(options.action, data, config)
                .then((response: any) => {
                    message.success(response.data.message);
                    options.onSuccess(response.data, options.file);
                })
                .catch((err: Error) => {
                    console.error(err);
                    message.error("Upload failed.");
                    options.onError(err);
                });
        },
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
                {uploadedFile.length > 0 && (
                    <ViewModel
                        onRegister={(api) => (viewModelApiRef.current = api)}
                        file={uploadedFile[0]}
                        setFile={setUploadedFile}
                    />
                )}
                <Flex justify="center" style={{ width: "100%" }}>
                    <Button
                        type="primary"
                        icon={<CaretRightOutlined />}
                        iconPosition="end"
                        onClick={handleSubmit}
                    >
                        Select Material
                    </Button>
                </Flex>
            </Flex>
        </>
    );
};

export default UploadFile;
