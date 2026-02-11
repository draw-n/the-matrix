// Description: SelectMaterial component for choosing a material for 3D printing from a list of available options.

import { Button, Flex, Skeleton, Space, Tag } from "antd";
import { Material } from "../../types/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { CaretLeftOutlined } from "@ant-design/icons";
import { useAllMaterials } from "../../hooks/material";

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
    const {data: materials, isLoading} = useAllMaterials(undefined, true);

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
                            <Flex justify="space-between" gap="5rem" key={material.uuid}>
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
