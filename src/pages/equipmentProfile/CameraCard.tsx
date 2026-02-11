import React, { useState } from "react";
import {
    Card,
    Typography,
    Button,
    Result,
    Spin,
} from "antd";
import { Equipment, WithEquipment } from "../../types/equipment";
import { EditableComponentProps } from "../../types/common";

const { Title } = Typography;

type CameraCardProps = EditableComponentProps<Equipment> & WithEquipment;

const CameraCard: React.FC<CameraCardProps> = ({ equipment, handleClick }) => {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const streamUrl = `http://${equipment?.cameraUrl}/stream`;

    const handleRetry = () => {
        setIsLoading(true);
        setError(false);
    };

    return (
        <Card style={{ width: "100%", overflow: "hidden" }}>
           <Title level={2} style={{ marginBottom: "16px" }}>LIVE PRINTER FEED</Title>

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
                {isLoading && !error && (
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
                            display: isLoading ? "none" : "block",
                        }}
                        // Use anonymous to avoid CORS issues when doing face detection
                        crossOrigin="anonymous"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setError(true);
                            setIsLoading(false);
                        }}
                    />
                )}
            </div>
        </Card>
    );
};

export default CameraCard;
