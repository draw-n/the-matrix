import {
    Card,
    Flex,
    Tag,
    Skeleton,
    Input,
    theme,
    Space,
    Divider,
    Button,
} from "antd";
import { Equipment } from "../../types/Equipment";
import React from "react";
import HasAccess from "../../components/rbac/HasAccess";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

interface HeaderCardProps {
    equipment: Equipment;
    category?: string;
    handleClick?: () => void;
    editMode?: boolean;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
    equipment,
    category,
    handleClick,
    editMode,
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
            <Flex justify="space-between" align="end">
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
                <HasAccess roles={["admin", "moderator"]}>
                    <Button
                        onClick={handleClick}
                        shape="circle"
                        variant="outlined"
                        type="primary"
                        icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                    />
                </HasAccess>
            </Flex>
        </Card>
    );
};

export default HeaderCard;
