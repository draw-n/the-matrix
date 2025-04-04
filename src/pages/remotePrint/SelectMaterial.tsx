import { Button, Flex, List, Skeleton, Space, Tag } from "antd";
import { Material } from "../../types/Material";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { CaretLeftFilled, CaretLeftOutlined } from "@ant-design/icons";

interface SelectMaterialProps {
    next: () => void;
    prev: () => void;
    setMaterial: (value: Material) => void;
}

const SelectMaterial: React.FC<SelectMaterialProps> = ({
    next,
    prev,
    setMaterial,
}: SelectMaterialProps) => {
    const [materials, setMaterials] = useState<Material[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Material[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/materials?remotePrintAvailable=true`
                );

                setMaterials(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        fetchData();
    }, []);

    const handleSelect = (value: Material) => {
        setMaterial(value);
        next();
    };

    return (
        <>
            {isLoading ? (
                <Skeleton active />
            ) : (
                <Space direction="vertical" size="large">
                    <h2>Select Material</h2>
                    {materials?.map((material: Material) => {
                        return (
                            <Flex justify="space-between" gap="5rem">
                                <Space
                                    direction="vertical"
                                    size="small"
                                    style={{ display: "flex" }}
                                >
                                    <h3>{`${material.name} (${material.shortName})`}</h3>
                                    <p>{material.description}</p>
                                    <Flex gap="10px" align="center">
                                        <p>Properties:</p>
                                        {material.properties.map((property) => (
                                            <Tag>{property}</Tag>
                                        ))}
                                    </Flex>
                                </Space>

                                <Button
                                    type="primary"
                                    onClick={() => handleSelect(material)}
                                >
                                    Select for Printing
                                </Button>
                            </Flex>
                        );
                    })}
                    <Flex justify="center" style={{ width: "100%" }}>
                        <Button
                            iconPosition="start"
                            icon={<CaretLeftOutlined />}
                            onClick={() => prev()}
                        >
                            Upload File
                        </Button>
                    </Flex>
                </Space>
            )}
        </>
    );
};

export default SelectMaterial;
