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

const { Paragraph } = Typography;

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
                setIsLoading(false)
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

                    <Button
                        onClick={handleClick}
                        icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                    >
                        {editMode ? "Save" : "Edit"}
                    </Button>
                </Flex>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card>
                            {isLoading ? (
                                <Skeleton active paragraph={{ rows: 2 }} />
                            ) : (
                                <Flex style={{ width: "100%" }} vertical>
                                    <h3>Headline</h3>
                                    {editMode ? (
                                        <Input
                                            onChange={(e) =>
                                                setHeadline(e.target.value)
                                            }
                                            value={headline}
                                        />
                                    ) : (
                                        <p>{headline}</p>
                                    )}
                                </Flex>
                            )}
                        </Card>
                    </Col>
                    <Col lg={12} span={24}>
                        <Card>
                            {isLoading ? (
                                <Skeleton active paragraph={{ rows: 1 }} />
                            ) : (
                                <Flex
                                    style={{ width: "100%", height: "100%" }}
                                    align="center"
                                    vertical
                                >
                                    <h3>Type</h3>
                                    {editMode ? (
                                        <Select
                                            options={categories?.map(
                                                (category) => ({
                                                    value: category._id,
                                                    label: category.name,
                                                })
                                            )}
                                            value={type}
                                            onChange={setType}
                                        />
                                    ) : (
                                        <p
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {
                                                categories?.find(
                                                    (item) => item._id === type
                                                )?.name
                                            }
                                        </p>
                                    )}
                                </Flex>
                            )}
                        </Card>
                    </Col>
                    <Col lg={12} span={24}>
                        <Card>
                            {isLoading ? (
                                <Skeleton active paragraph={{ rows: 1 }} />
                            ) : (
                                <Flex
                                    style={{ width: "100%", height: "100%" }}
                                    align="center"
                                    vertical
                                >
                                    <h3>Status</h3>
                                    <p
                                        style={{
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {equipment.status}
                                    </p>
                                </Flex>
                            )}
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card>
                            {isLoading ? (
                                <Skeleton active paragraph={{ rows: 4 }} />
                            ) : (
                                <Flex vertical>
                                    {" "}
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
                                </Flex>
                            )}
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card>
                            <h3>{`${equipment.name}'s Current Issues`}</h3>
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
