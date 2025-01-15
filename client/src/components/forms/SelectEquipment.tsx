import { Card, Space, Row, Col, Typography, Flex, Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import type { Equipment } from "../../types/Equipment";

const { Paragraph } = Typography;

interface SelectEquipmentProps {
    type: string | null;
    value: Equipment | null;
    setValue: (newValue: Equipment | null) => void;
}

const SelectEquipment: React.FC<SelectEquipmentProps> = ({
    type,
    value,
    setValue,
}: SelectEquipmentProps) => {
    const [showEquipment, setShowEquipment] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                const filterEquipment: Equipment[] = response.data.filter(
                    (item) => item.type === type
                );
                setShowEquipment(filterEquipment);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };
        setValue(null);
        fetchData();
    }, [type]);

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
                                        No equipment of this type found.
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
                                            equipment._id === value?._id &&
                                            "select-active"
                                        }`}
                                        onClick={() => setValue(equipment)}
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
