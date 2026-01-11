// Description: A component to select equipment based on category

import { Row, Col, Typography, Flex, Empty } from "antd";

import Loading from "../../components/Loading";
import type { Equipment } from "../../types/equipment";

import "./issues.css";
import { ControlledValueProps } from "../../types/common";
import { useAllEquipment } from "../../hooks/equipment";
import { WithCategoryId } from "../../types/category";

type SelectEquipmentProps = WithCategoryId & ControlledValueProps<string>;

const SelectEquipment: React.FC<SelectEquipmentProps> = ({
    categoryId,
    value,
    onChange,
}: SelectEquipmentProps) => {
    const {data: equipments, isLoading} = useAllEquipment(categoryId);
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
                    {(!equipments || equipments.length === 0) && (
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
                        {equipments && equipments.map((equipment: Equipment) => {
                            return (
                                <Col key={equipment.uuid} lg={8} xs={24}>
                                    <div
                                        className={`select-card ${
                                            equipment.uuid === value &&
                                            "select-active"
                                        }`}
                                        onClick={() =>
                                            handleSelect(equipment.uuid)
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
