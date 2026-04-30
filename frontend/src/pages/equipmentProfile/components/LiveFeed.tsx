import React, { useState } from "react";
import { Card, Typography, Button, Result, Spin, Col, Row } from "antd";
import { Equipment, WithEquipment } from "../../../types/equipment";
import { EditableComponentProps } from "../../../types/common";
import CameraCard from "./CameraCard";
import PrinterActions from "./PrinterActions";
import { useAuth } from "../../../contexts/AuthContext";
import { checkAccess } from "../../../components/routing/HasAccess";

type LiveFeedProps = EditableComponentProps<Equipment> & WithEquipment;

const LiveFeed: React.FC<LiveFeedProps> = ({ equipment, handleClick }) => {
    return (
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            <Col span={checkAccess(["admin", "moderator"]) ? 16 : 24}>
                <CameraCard equipment={equipment} handleClick={handleClick} />
            </Col>
            {checkAccess(["admin", "moderator"]) && (
                <Col span={8}>
                    <PrinterActions equipmentId={equipment?.uuid || ""} />
                </Col>
            )}
        </Row>
    );
};

export default LiveFeed;
