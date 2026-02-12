// Description: EquipmentProfile component for displaying and editing equipment details.

import { Card, Col, Row, Space, Typography } from "antd";
import { Equipment, WithEquipment } from "../../types/equipment";
import IssueTable from "../../components/tables/IssueTable";

import HeaderCard from "./HeaderCard";
import StatusCard from "./StatusCard";
import { useAllIssues } from "../../hooks/issue";
import { useAllEquipment, useEditEquipmentById } from "../../hooks/equipment";
import QueueSystem from "../../components/queueSystem/QueueSystem";
import AdminCard from "./AdminCard";
import DescriptionCard from "./DescriptionCard";
import CameraCard from "./CameraCard";
import HasAccess from "../../components/rbac/HasAccess";

const { Title } = Typography;
type EquipmentProfileProps = WithEquipment;

const EquipmentProfile: React.FC<EquipmentProfileProps> = ({
    equipment,
}: EquipmentProfileProps) => {
    const { refetch: equipmentRefresh } = useAllEquipment();
    const { data: issues, refetch } = useAllIssues(
        equipment ? ["open", "in-progress", "completed"] : undefined,
        equipment ? equipment.uuid : undefined,
    );

    const { mutateAsync: editEquipmentById } = useEditEquipmentById();

    /**
     * Toggles edit mode and saves changes if exiting edit mode.
     */
    const handleEditClick = async (
        editMode: boolean,
        setEditMode: (editMode: boolean) => void,
        values: Partial<Equipment> | undefined,
    ) => {
        if (equipment && editMode) {
            const editedEquipment: Equipment = {
                ...equipment,
                ...values,
            };
            await editEquipmentById({
                equipmentId: equipment.uuid,
                editedEquipment,
            });
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
                        <Col span={equipment?.remotePrintAvailable ? 14 : 24}>
                            <CameraCard
                                equipment={equipment}
                                handleClick={handleEditClick}
                            />
                        </Col>
                    )}
                    {equipment?.remotePrintAvailable && (
                        <Col span={equipment?.cameraUrl ? 10 : 24}>
                            <Card style={{ height: "100%" }}>
                                <Title
                                    level={2}
                                >{`QUEUE TO PRINT ON ${equipment?.name.toUpperCase()}`}</Title>
                                <QueueSystem equipmentId={equipment?.uuid} />
                            </Card>
                        </Col>
                    )}

                    <Col span={24}>
                        <Card>
                            <Title
                                level={2}
                            >{`${equipment?.name.toUpperCase()}'S ONGOING ISSUES`}</Title>
                            <IssueTable issues={issues} />
                        </Card>
                    </Col>
                    {
                        <HasAccess roles={["admin", "moderator"]}>
                            <Col span={24}>
                                <AdminCard
                                    equipment={equipment}
                                    handleClick={handleEditClick}
                                />
                            </Col>
                        </HasAccess>
                    }
                </Row>
            </Space>
        </>
    );
};

export default EquipmentProfile;
