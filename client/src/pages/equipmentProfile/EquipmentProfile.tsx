import { Button, Card, Col, Flex, Input, Row, Space, Typography } from "antd";
import { Equipment } from "../../types/Equipment";
import IssueTable from "../../components/tables/IssueTable";
import { useState } from "react";
import axios from "axios";

const { Paragraph } = Typography;

interface EquipmentProfileProps {
    equipment: Equipment;
    setRefreshEquipment: () => void;
}

const { TextArea } = Input;

const EquipmentProfile: React.FC<EquipmentProfileProps> = ({
    equipment,
    setRefreshEquipment,
}: EquipmentProfileProps) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    const [name, setName] = useState(equipment.name);
    const [type, setType] = useState(equipment.type);
    const [properties, setProperties] = useState(equipment.properties);
    const [description, setDescription] = useState(equipment.description);

    const handleClick = () => {
        if (editMode) {
            saveEquipmentChanges();
        }
        setEditMode((prev) => !prev);
    };

    const saveEquipmentChanges = async () => {
        try {
            const editedEquipment = {
                _id: equipment._id,
                name: name,
                type: type,
                properties: properties,
                description: description,
                status: equipment.status,
                routePath: equipment.routePath,
            };
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/equipment/${
                    equipment._id
                }`,
                editedEquipment
            );
            setRefreshEquipment();
        } catch (error) {
            console.error("Issue updating equipment", error);
        }
    };

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Flex justify="space-between" gap="10px">
                    {editMode ? (
                        <h1>
                            <Input
                                style={{
                                    textTransform: "uppercase",
                                    font: "inherit",
                                    fontFamily: "inherit",
                                    fontSize: "inherit",
                                }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </h1>
                    ) : (
                        <h1 style={{ textTransform: "uppercase" }}>
                            {equipment.name}
                        </h1>
                    )}

                    <Button onClick={handleClick}>
                        {editMode ? "Save" : "Edit"}
                    </Button>
                </Flex>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card>
                            <h3>Description</h3>
                            {editMode ? (
                                <TextArea
                                    autoSize
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            ) : (
                                <Paragraph>
                                    <p>{description}</p>
                                </Paragraph>
                            )}
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card>
                            <h3>{`${equipment.name}'s Current Issues`}</h3>
                            <IssueTable equipmentFilter={equipment._id} />
                        </Card>
                    </Col>
                </Row>

                <p>Type: {equipment.type}</p>
                <p>Status: {equipment.status}</p>
            </Space>
        </>
    );
};

export default EquipmentProfile;
