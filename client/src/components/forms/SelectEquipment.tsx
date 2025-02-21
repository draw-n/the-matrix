import { Card, Space, Row, Col, Typography, Flex, Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import type { Equipment } from "../../types/Equipment";

import "./issues.css";

interface SelectEquipmentProps {
    category: string;
    value?: string;
    onChange?: (value: string) => void;
}

const SelectEquipment: React.FC<SelectEquipmentProps> = ({
    category,
    value,
    onChange,
    ...rest
}: SelectEquipmentProps) => {
    const [showEquipment, setShowEquipment] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/equipment?category=${category}`
                );
                setShowEquipment(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };
        if (onChange) {
            onChange("");
        } //TODO: this causes the form to auto create this every time, maybe make it less intense
        fetchData();
    }, [category]);

    const handleSelect = (value: string) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {showEquipment.length == 0 && (
                        <Flex
                            align="center"
                            justify="center"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <Empty
                                description={
                                    <Typography.Text>
                                        No equipment of this category found.
                                    </Typography.Text>
                                }
                            />
                        </Flex>
                    )}

                    <Row gutter={[20, 20]}>
                        {showEquipment.map((equipment: Equipment) => {
                            return (
                                <Col key={equipment._id} span={8}>
                                    <div
                                        className={`select-card ${
                                            equipment._id === value &&
                                            "select-active"
                                        }`}
                                        onClick={() =>
                                            handleSelect(equipment._id)
                                        }
                                    >
                                        <p>{equipment.name}</p>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </>
            )}
        </>
    );
};

export default SelectEquipment;
