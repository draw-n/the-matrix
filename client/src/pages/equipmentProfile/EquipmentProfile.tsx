import { Button, Card, Col, Row, Space, Typography } from "antd";
import { Equipment } from "../../types/Equipment";
import IssueTable from "../editUpdates/IssueTable";

const { Paragraph } = Typography;

interface EquipmentProfileProps {
    equipment: Equipment;
}

const EquipmentProfile: React.FC<EquipmentProfileProps> = ({
    equipment,
}: EquipmentProfileProps) => {
    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <h1 style={{ textTransform: "uppercase" }}>{equipment.name}</h1>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card>
                            <h3>Description</h3>
                            <Paragraph>
                                <p>{equipment.description}</p>
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card>
                            <h3>
                                {`${equipment.name}'s Current Issues`}
                            </h3>
                            <IssueTable equipmentFilter={equipment._id} />
                        </Card>
                    </Col>
                </Row>

                <p>Type: {equipment.type}</p>
                <p>Status: {equipment.status}</p>
                <p>Issues: {equipment.issues}</p>
                <Button onClick={() => console.log(equipment)}>
                    show equipment
                </Button>
            </Space>
        </>
    );
};

export default EquipmentProfile;
