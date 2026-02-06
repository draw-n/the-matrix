import React, { useState } from "react";
import {
    Card,
    Typography,
    Button,
    Result,
    Spin,
    Flex,
    Form,
    Switch,
    Input,
} from "antd";
import { Equipment, WithEquipment } from "../../types/equipment";
import { EditableComponentProps } from "../../types/common";
import HasAccess from "../../components/rbac/HasAccess";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

type CameraCardProps = EditableComponentProps<Equipment> & WithEquipment;

const CameraCard: React.FC<CameraCardProps> = ({ equipment, handleClick }) => {
    const [form] = Form.useForm();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    // uStreamer endpoint
    const streamUrl = `http://${equipment?.cameraUrl}/stream`;

    const handleRetry = () => {
        setLoading(true);
        setError(false);
    };

    return (
        <Card style={{ width: "100%", overflow: "hidden" }}>
            <Form
                onFinish={(values) =>
                    handleClick && handleClick(editMode, setEditMode, values)
                }
                colon={false}
                form={form}
                initialValues={{
                    ipUrl: equipment?.ipUrl,
                    cameraUrl: equipment?.cameraUrl,
                    remotePrintAvailable: equipment?.remotePrintAvailable,
                }}
                layout="horizontal"
            >
                <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginBottom: "16px" }}
                >
                    <Title level={2}>LIVE PRINTER FEED</Title>
                    <HasAccess roles={["admin", "moderator"]}>
                        <Button
                            shape="circle"
                            variant="outlined"
                            type="primary"
                            htmlType="submit"
                            icon={
                                editMode ? <SaveOutlined /> : <EditOutlined />
                            }
                        />
                    </HasAccess>
                </Flex>
                <Form.Item
                    hidden={!editMode}
                    label="Camera URL"
                    name="cameraUrl"
                >
                    <Input />
                </Form.Item>
                <Form.Item hidden={!editMode} label="IP URL" name="ipUrl">
                    <Input />
                </Form.Item>
                <Form.Item
                    hidden={!editMode}
                    name="remotePrintAvailable"
                    label="Will it be available for remote printing?"
                    layout="horizontal"
                >
                    <Switch />
                </Form.Item>
            </Form>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#000",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Loading Overlay */}
                {loading && !error && (
                    <div style={{ position: "absolute", zIndex: 2 }}>
                        <Spin tip="Connecting to Pi..." />
                    </div>
                )}

                {/* Error State */}
                {error ? (
                    <Result
                        status="warning"
                        title="Feed Offline"
                        subTitle="Ensure the Raspberry Pi is powered on."
                        extra={
                            <Button type="primary" onClick={handleRetry}>
                                Reconnect
                            </Button>
                        }
                    />
                ) : (
                    <img
                        src={error ? "" : `${streamUrl}?t=${Date.now()}`} // Timestamp prevents cache issues on retry
                        alt="Printer Feed"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: loading ? "none" : "block",
                        }}
                        // Use anonymous to avoid CORS issues when doing face detection
                        crossOrigin="anonymous"
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setError(true);
                            setLoading(false);
                        }}
                    />
                )}
            </div>
        </Card>
    );
};

export default CameraCard;
