import {
    Button,
    Card,
    Col,
    Flex,
    Input,
    message,
    Row,
    Select,
    Skeleton,
    Space,
    Tag,
    theme,
    Typography,
} from "antd";
import { Equipment } from "../../types/Equipment";
import IssueTable from "../../components/tables/IssueTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Category } from "../../types/Category";
import { useNavigate } from "react-router-dom";
import ConfirmAction from "../../components/ConfirmAction";
import HasAccess from "../../components/rbac/HasAccess";
import HeaderCard from "./HeaderCard";
import StatusCard from "./StatusCard";

const { Paragraph, Title } = Typography;

interface EquipmentProfileProps {
    equipment: Equipment;
    refreshEquipment: number;
    setRefreshEquipment: () => void;
}

const { TextArea } = Input;

const EquipmentProfile: React.FC<EquipmentProfileProps> = ({
    equipment,
    refreshEquipment,
    setRefreshEquipment,
}: EquipmentProfileProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>();
    const [name, setName] = useState(equipment.name);
    const [type, setType] = useState(equipment.category);
    const [headline, setHeadline] = useState(equipment.headline);
    const [properties, setProperties] = useState(equipment.properties);
    const [description, setDescription] = useState(equipment.description);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Category[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`
                );
                setCategories(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    });

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
                name,
                category: type,
                headline,
                properties,
                description,
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

    const deleteEquipment = async () => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/equipment/${equipment._id}`
            );
            setRefreshEquipment();
            navigate("/makerspace");
        } catch (error) {
            console.error("Issue deleting equipment", error);
        }
    };

    return (
        <>
         
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Row gutter={[16, 16]}>
                    <Col span={18}>
                        <HeaderCard
                            equipment={equipment}
                            category={
                                categories?.find((item) => item._id === type)
                                    ?.name
                            }
                            editMode={editMode}
                            handleClick={handleClick}
                        />
                    </Col>
                    <Col span={6}>
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
                            >{`${equipment.name.toUpperCase()}'S ONGOING ISSUES`}</Title>
                            <IssueTable
                                refresh={refreshEquipment}
                                setRefresh={setRefreshEquipment}
                                equipmentFilter={equipment._id}
                            />
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
                                            {`Delete ${equipment.name}`} and its
                                            associated data
                                        </Button>
                                    }
                                    actionSuccess={deleteEquipment}
                                    title={`Delete the ${equipment.name} Equipment`}
                                    headlineText="Deleting this equipment will also delete its associated issues."
                                    confirmText={`Are you sure you wish to delete the ${equipment.name} equipment?`}
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
