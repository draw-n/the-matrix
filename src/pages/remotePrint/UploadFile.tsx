import { red } from "@ant-design/colors";
import {
    CaretRightOutlined,
    InboxOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Button, Flex, Form, message, Space, Upload, UploadProps } from "antd";
import type { UploadFile } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";
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
    const handleSubmit = async () => {
        if (uploadedFile.length === 0) {
            message.error("You must upload a file!");
        } else {
            next();
        }
    };

    const props: UploadProps = {
        action: `${import.meta.env.VITE_BACKEND_URL}/jobs/pre-process`,
        name: "file",
        headers: {
            authorization: "authorization-text",
        },
        beforeUpload: (file: any) => {
            const isFile = file.type === "model/3mf" || "model/stl";
            if (!isFile) {
                message.error(`${file.name} is not a STL or 3MF file.`);
            }
            return isFile || Upload.LIST_IGNORE;
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
                    {...props}
                    fileList={uploadedFile}
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
                    <ViewModel file={uploadedFile[0]} />
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
