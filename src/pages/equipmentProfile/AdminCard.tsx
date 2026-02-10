import { Button, Card, Col, Flex, Form, Input, Switch } from "antd";
import ConfirmAction from "../../components/ConfirmAction";
import { useState } from "react";
import { Equipment, WithEquipment } from "../../types/equipment";
import { deleteEquipment } from "../../api/equipment";
import HasAccess from "../../components/rbac/HasAccess";
import { EditableComponentProps } from "../../types/common";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";
type AdminCardProps = WithEquipment & EditableComponentProps<Equipment>;

const AdminCard: React.FC<AdminCardProps> = ({ equipment, handleClick }) => {
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            <Card>
                <Flex justify="space-between" align="center">
                    <Form
                        style={{ flex: 1 }}
                        onFinish={(values) => {
                            const isSaving = editMode;
                            const isRouteChanged =
                                values.routePath !== equipment?.routePath;
                            handleClick &&
                                handleClick(editMode, setEditMode, values);
                            if (isSaving && isRouteChanged) {
                                navigate(`/makerspace`);
                            }
                        }}
                        colon={false}
                        form={form}
                        initialValues={{
                            ipUrl: equipment?.ipUrl,
                            cameraUrl: equipment?.cameraUrl,
                            remotePrintAvailable:
                                equipment?.remotePrintAvailable,
                            routePath: equipment?.routePath,
                        }}
                        layout="horizontal"
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                            style={{ marginBottom: "16px" }}
                        >
                            <Title level={2}>ADMIN ACTIONS</Title>
                            <HasAccess roles={["admin", "moderator"]}>
                                <Button
                                    shape="circle"
                                    variant="outlined"
                                    type="primary"
                                    htmlType="submit"
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
                        <Form.Item label="Camera URL" name="cameraUrl">
                            <Input disabled={!editMode} />
                        </Form.Item>
                        <Form.Item label="IP URL" name="ipUrl">
                            <Input disabled={!editMode} />
                        </Form.Item>
                        <Form.Item
                            name="remotePrintAvailable"
                            label="Will it be available for remote printing?"
                            layout="horizontal"
                        >
                            <Switch disabled={!editMode} />
                        </Form.Item>
                        <Form.Item
                            label="Website Page Route Path (if this is changed, you will be redirected to /makerspace)"
                            name="routePath"
                            layout="vertical"
                            rules={[
                                {
                                    pattern: /^[a-z0-9-]+$/i,
                                    message:
                                        "Route path can only contain lowercase letters, numbers, and hyphens.",
                                },
                            ]}
                        >
                            <Input disabled={!editMode} />
                        </Form.Item>
                    </Form>
                </Flex>

                <ConfirmAction
                    target={
                        <Button
                            disabled={!editMode}
                            danger
                            style={{ width: "100%" }}
                        >
                            {`Delete ${equipment?.name}`} and its associated
                            data
                        </Button>
                    }
                    actionSuccess={deleteEquipment}
                    title={`Delete the ${equipment?.name} Equipment`}
                    headlineText="Deleting this equipment will also delete its associated issues."
                    confirmText={`Are you sure you wish to delete the ${equipment?.name} equipment?`}
                />
            </Card>
        </>
    );
};

export default AdminCard;
