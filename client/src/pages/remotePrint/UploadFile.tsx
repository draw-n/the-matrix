import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Space, Upload, UploadProps } from "antd";
import { useState } from "react";
const { Dragger } = Upload;


const UploadFile: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null | undefined>(null);

    const props: UploadProps = {
        name: "file",
        headers: {
            authorization: "authorization-text",
        },
        beforeUpload: (file: any) => {
            const isPNG = file.type === "model/3mf" || "model/stl";
            if (!isPNG) {
                message.error(`${file.name} is not a STL or 3MF file.`);
            }
            return isPNG || Upload.LIST_IGNORE;
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`);
                setUploadedFile(info.file.originFileObj); // Store file in state

            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };


    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>{" "}
                </Dragger>
            </Space>
        </>
    );
};

export default UploadFile;
