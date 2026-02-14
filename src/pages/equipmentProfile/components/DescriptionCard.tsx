import { useState } from "react";

import { Button, Card, Flex, Typography, Input } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

import { Equipment, WithEquipment } from "../../../types/equipment";
import HasAccess from "../../../components/routing/HasAccess";
import { EditableComponentProps } from "../../../types/common";

type DescriptionCardProps = EditableComponentProps<Equipment> & WithEquipment;

const DescriptionCard: React.FC<DescriptionCardProps> = ({
    handleClick,
    equipment,
}: DescriptionCardProps) => {
    const [editMode, setEditMode] = useState(false);
    const [description, setDescription] = useState<string>(
        equipment?.description || "",
    );

    return (
        <Card>
            <Flex vertical gap="small">
                <Flex justify="space-between" align="center">
                    <Typography.Title level={2}>DESCRIPTION</Typography.Title>
                    <HasAccess roles={["admin", "moderator"]}>
                        <Button
                            onClick={() =>
                                handleClick &&
                                handleClick(editMode, setEditMode, {
                                    description,
                                })
                            }
                            shape="circle"
                            variant="outlined"
                            type="primary"
                            icon={
                                editMode ? <SaveOutlined /> : <EditOutlined />
                            }
                        />
                    </HasAccess>
                </Flex>
                {editMode ? (
                    <Input.TextArea
                        size="small"
                        autoSize
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                ) : (
                    <Typography.Paragraph>
                        <p>{description}</p>
                    </Typography.Paragraph>
                )}
            </Flex>
        </Card>
    );
};

export default DescriptionCard;
