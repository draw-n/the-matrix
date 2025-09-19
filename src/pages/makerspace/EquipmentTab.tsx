import { Flex, Dropdown, Button, Row, Col, Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateEquipmentForm from "../../components/forms/CreateEquipmentForm";
import HasAccess from "../../components/rbac/HasAccess";
import { Category } from "../../types/Category";
import { Equipment } from "../../types/Equipment";
import EquipmentCard from "./EquipmentCard";

const EquipmentTab = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("");

    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Category[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`
                );
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }

            if (filter) {
                try {
                    const response = await axios.get<Equipment[]>(
                        `${
                            import.meta.env.VITE_BACKEND_URL
                        }/equipment?category=${filter}`
                    );
                    setEquipments(response.data);
                } catch (error) {
                    console.error("Fetching equipment failed:", error);
                }
            } else {
                setFilter(categories[0]?._id);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [filter]);
    return (
        <>
            {" "}
            <h2>Equipment</h2>
            <Flex gap="middle">
                {categories.length > 0 && (
                    <Dropdown
                        menu={{
                            items: categories?.map((category) => ({
                                key: category._id,
                                label: category.name,
                            })),
                            onClick: ({ key }) => {
                                setFilter(key);
                            },
                        }}
                        placement="bottom"
                    >
                        <Button
                            variant="solid"
                            size="small"
                            style={{ width: 200 }}
                        >
                            {
                                categories?.find((item) => item._id === filter)
                                    ?.name
                            }
                        </Button>
                    </Dropdown>
                )}
                <HasAccess roles={["admin", "moderator"]}>
                    <CreateEquipmentForm onUpdate={() => {}} />
                </HasAccess>
            </Flex>
            {equipments.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {equipments.map((equipment: Equipment, index) => {
                        return (
                            <Col span={24} lg={8} key={index}>
                                <EquipmentCard equipment={equipment} />
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <Empty style={{ width: "100%" }} />
            )}
        </>
    );
};

export default EquipmentTab;
