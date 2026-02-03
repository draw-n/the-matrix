import { Button, Card, Flex, Skeleton } from "antd";
import { Equipment, WithEquipment } from "../../types/equipment";
import Paragraph from "antd/es/typography/Paragraph";
import { useState } from "react";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import HasAccess from "../../components/rbac/HasAccess";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import {
    ControlledValueProps,
    EditableComponentProps,
} from "../../types/common";
import { EditOutlined } from "@ant-design/icons";

type DescriptionCardProps = EditableComponentProps<Equipment> &
    WithEquipment;

const DescriptionCard: React.FC<DescriptionCardProps> = ({
    handleClick,
    equipment,
}: DescriptionCardProps) => {
    const [editMode, setEditMode] = useState(false);
    const [description, setDescription] = useState<string>(equipment?.description || "");
    return (
        <Card>
            <Flex vertical gap="small">
                <Flex justify="space-between" align="center">
                    <Title level={2}>DESCRIPTION</Title>
                    <HasAccess roles={["admin", "moderator"]}>
                        <Button
                            onClick={() =>
                                handleClick &&
                                handleClick(editMode, setEditMode, {description})
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
                    <TextArea
                        size="small"
                        autoSize
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                ) : (
                    <Paragraph>
                        <p>{description}</p>
                    </Paragraph>
                )}
            </Flex>
        </Card>
    );
};

export default DescriptionCard;
