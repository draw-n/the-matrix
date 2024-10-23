import { Card, Radio, Space, Row, Col, Typography, Flex, Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import type { Equipment } from "../../types/Equipment";

const { Paragraph } = Typography;

interface SelectEquipmentProps {
    type: string;
    id: string;
    setID: (newValue: string) => void;
}

const SelectEquipment: React.FC<SelectEquipmentProps> = ({
    type,
    id,
    setID,
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
        setID("");
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
                    <Radio.Group
                        className="select-radio"
                        onChange={(e) => setID(e.target.value)}
                    >
                        <Row gutter={[16, 16]}>
                            {showEquipment.map((equipment: Equipment) => {
                                return (
                                    <Col
                                        key={equipment._id}
                                        span={8}
                                        className="select-card"
                                    >
                                        <Radio
                                            className="select-card"
                                            key={equipment._id}
                                            value={equipment._id}
                                        >
                                            <Card
                                                className={`select-card ${
                                                    equipment._id == id &&
                                                    "select-active"
                                                }`}
                                                style={{ width: 300 }}
                                                hoverable
                                            >
                                                <Paragraph>
                                                    <h2>{equipment.name}</h2>
                                                </Paragraph>
                                            </Card>
                                        </Radio>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Radio.Group>
                </>
            )}
        </>
    );
};

export default SelectEquipment;
