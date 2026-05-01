import { Row, Col, Card, Button, Flex, Input, Typography } from "antd";
import { Equipment, WithEquipment } from "../../../types/equipment";
import { EditableComponentProps } from "../../../types/common";
import { useState } from "react";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import HasAccess from "../../../components/routing/HasAccess";
import IssueTable from "../../../components/tables/IssueTable";
import { useAllIssues } from "../../../hooks/useIssues";

const General: React.FC<EditableComponentProps<Equipment> & WithEquipment> = ({
    equipment,
    handleClick,
}) => {
    const [editMode, setEditMode] = useState(false);
    const [description, setDescription] = useState<string>(
        equipment?.description || "",
    );

    const { data: issues, refetch } = useAllIssues(
        equipment ? ["open", "in-progress", "completed"] : undefined,
        equipment ? equipment.uuid : undefined,
    );
    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Card>
                    <Flex vertical gap="small">
                        <Flex justify="space-between" align="center">
                            <Typography.Title level={2}>
                                DESCRIPTION
                            </Typography.Title>
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
                                        editMode ? (
                                            <SaveOutlined />
                                        ) : (
                                            <EditOutlined />
                                        )
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
            </Col>
            <Col span={24}>
                <Card>
                    <Typography.Title level={2}>
                        {`${equipment?.name.toUpperCase()}'S ONGOING ISSUES`}
                    </Typography.Title>
                    <IssueTable issues={issues} />
                </Card>
            </Col>
        </Row>
    );
};

export default General;
