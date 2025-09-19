import { Card, Flex, Tag, Skeleton, Input, theme, Space, Divider } from "antd";
import { Equipment } from "../../types/Equipment";
import React from "react";

interface HeaderCardProps {
    equipment: Equipment;
    category?: string;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
    equipment,
    category,
}: HeaderCardProps) => {
    const {
        token: { colorPrimary, colorBgContainer },
    } = theme.useToken();
    return (
        <Card
            style={{
                background: colorPrimary,
                color: "white",
                border: "none",
            }}
        >
            <Flex justify="space-between" align="center">
                <Flex vertical align="flex-start">
                    <Tag
                        color={colorBgContainer}
                        style={{
                            borderRadius: 1000,
                            textTransform: "uppercase",
                            color: "black",
                            display: "inline-block",
                        }}
                    >
                        {category}
                    </Tag>
                    <h1
                        style={{
                            margin: 0,
                            textTransform: "uppercase",
                        }}
                    >
                        {equipment.name}
                    </h1>
                    <Flex style={{ width: "100%" }} vertical>
                        <p>{equipment.headline}</p>
                    </Flex>
                </Flex>
             
            </Flex>
        </Card>
    );
};

export default HeaderCard;
