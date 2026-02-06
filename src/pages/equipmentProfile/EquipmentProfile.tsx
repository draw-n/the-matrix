// Description: EquipmentProfile component for displaying and editing equipment details.

import { useState } from "react";
import axios from "axios";

import {
    Button,
    Card,
    Col,
    Flex,
    Input,
    Row,
    Skeleton,
    Space,
    Typography,
} from "antd";
import { Equipment, WithEquipment } from "../../types/equipment";
import IssueTable from "../../components/tables/IssueTable";

import ConfirmAction from "../../components/ConfirmAction";

import { useNavigate } from "react-router-dom";

import HeaderCard from "./HeaderCard";
import StatusCard from "./StatusCard";
import { useAllCategories } from "../../hooks/category";
import { useAllIssues } from "../../hooks/issue";
import { useAllEquipment } from "../../hooks/equipment";
import QueueSystem from "../../components/queueSystem/QueueSystem";
import { editEquipment } from "../../api/equipment";
import AdminCard from "./AdminCard";
import DescriptionCard from "./DescriptionCard";
import CameraCard from "./CameraCard";
import HasAccess from "../../components/rbac/HasAccess";

const { Paragraph, Title } = Typography;
type EquipmentProfileProps = WithEquipment;

const { TextArea } = Input;

const EquipmentProfile: React.FC<EquipmentProfileProps> = ({
    equipment,
}: EquipmentProfileProps) => {
    const { refetch: equipmentRefresh } = useAllEquipment();
    const [type, setType] = useState(equipment?.categoryId);
    const [properties, setProperties] = useState(equipment?.properties);
    const { data: issues, refetch } = useAllIssues(
        equipment ? ["open", "in-progress", "completed"] : undefined,
        equipment ? equipment.uuid : undefined,
    );
    const navigate = useNavigate();
    /**
     * Toggles edit mode and saves changes if exiting edit mode.
     */
    const handleEditClick = (
        editMode: boolean,
        setEditMode: (editMode: boolean) => void,
        values: Partial<Equipment> | undefined,
    ) => {
        if (equipment && editMode) {
            const editedEquipment: Equipment = {
                ...equipment,
                ...values,
            };
            editEquipment(editedEquipment);
            equipmentRefresh();
        }
        setEditMode(!editMode);
    };

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={18}>
                        <HeaderCard
                            equipment={equipment}
                            handleClick={handleEditClick}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <StatusCard equipment={equipment} />
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <DescriptionCard
                            equipment={equipment}
                            handleClick={handleEditClick}
                        />
                    </Col>
                    {equipment?.cameraUrl && (
                        <Col span={14}>
                            <CameraCard equipment={equipment} handleClick={handleEditClick} />
                        </Col>
                    )}
                    <Col span={equipment?.cameraUrl ? 10 : 24}>
                        <Card style={{ height: "100%" }}>
                            <Title
                                level={2}
                            >{`QUEUE TO PRINT ON ${equipment?.name.toUpperCase()}`}</Title>
                            <QueueSystem equipmentId={equipment?.uuid} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card>
                            <Title
                                level={2}
                            >{`${equipment?.name.toUpperCase()}'S ONGOING ISSUES`}</Title>
                            <IssueTable issues={issues} refresh={refetch} />
                        </Card>
                    </Col>
                    {
                        <HasAccess roles={["admin", "moderator"]}>
                            <Col span={24}>
                                <AdminCard equipment={equipment} />
                            </Col>
                        </HasAccess>
                    }
                </Row>
            </Space>
        </>
    );
};

export default EquipmentProfile;
