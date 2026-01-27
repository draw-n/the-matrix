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
import {  WithEquipment } from "../../types/equipment";
import IssueTable from "../../components/tables/IssueTable";

import ConfirmAction from "../../components/ConfirmAction";

import { useNavigate } from "react-router-dom";

import HeaderCard from "./HeaderCard";
import StatusCard from "./StatusCard";
import { useAllCategories } from "../../hooks/category";
import { useAllIssues } from "../../hooks/issue";
import { useAllEquipment } from "../../hooks/equipment";

const { Paragraph, Title } = Typography;
type EquipmentProfileProps = WithEquipment;

const { TextArea } = Input;

const EquipmentProfile: React.FC<EquipmentProfileProps> = ({
    equipment,
}: EquipmentProfileProps) => {
    const {refetch: equipmentRefresh} = useAllEquipment();
    const [editMode, setEditMode] = useState<boolean>(false);
    const { data: categories, isLoading } = useAllCategories();
    const [name, setName] = useState(equipment?.name);
    const [type, setType] = useState(equipment?.categoryId);
    const [headline, setHeadline] = useState(equipment?.headline);
    const [properties, setProperties] = useState(equipment?.properties);
    const [description, setDescription] = useState(equipment?.description);
    const { data: issues, refetch } = useAllIssues(
        equipment ? ["open", "in-progress", "completed"] : undefined,
        equipment ? equipment.uuid : undefined
    );
    const navigate = useNavigate();
    /**
     * Toggles edit mode and saves changes if exiting edit mode.
     */
    const handleClick = () => {
        if (editMode) {
            saveEquipmentChanges();
        }
        setEditMode((prev) => !prev);
    };
    /**
     * Saves the equipment changes made in edit mode.
     */
    const saveEquipmentChanges = async () => {
        try {
            const editedEquipment = {
                uuid: equipment?.uuid,
                name,
                category: type,
                headline,
                properties,
                description,
                status: equipment?.status,
                routePath: equipment?.routePath,
            };
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/equipment/${
                    equipment?.uuid
                }`,
                editedEquipment
            );
            equipmentRefresh();
        } catch (error) {
            console.error("Issue updating equipment", error);
        }
    };
    /**
     * Deletes the equipment and navigates back to the makerspace page.
     */
    const deleteEquipment = async () => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/equipment/${
                    equipment?.uuid
                }`
            );
            equipmentRefresh();
            navigate("/makerspace");
        } catch (error) {
            console.error("Issue deleting equipment", error);
        }
    };

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={18}>
                        <HeaderCard
                            equipment={equipment}
                            category={categories?.find(
                                (item) => item.uuid === type
                            )}
                            editMode={editMode}
                            handleClick={handleClick}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <StatusCard equipment={equipment} />
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card>
                            {isLoading ? (
                                <Skeleton active paragraph={{ rows: 4 }} />
                            ) : (
                                <Flex vertical>
                                    <Title level={2}>DESCRIPTION</Title>
                                    {editMode ? (
                                        <TextArea
                                            size="small"
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
                                </Flex>
                            )}
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
                    {editMode && (
                        <Col span={24}>
                            <Card>
                                <h3>Admin Actions</h3>
                                <ConfirmAction
                                    target={
                                        <Button
                                            danger
                                            style={{ width: "100%" }}
                                        >
                                            {`Delete ${equipment?.name}`} and
                                            its associated data
                                        </Button>
                                    }
                                    actionSuccess={deleteEquipment}
                                    title={`Delete the ${equipment?.name} Equipment`}
                                    headlineText="Deleting this equipment will also delete its associated issues."
                                    confirmText={`Are you sure you wish to delete the ${equipment?.name} equipment?`}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>
            </Space>
        </>
    );
};

export default EquipmentProfile;
