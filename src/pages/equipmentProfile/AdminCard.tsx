import { Button, Card, Col, Flex } from "antd";
import ConfirmAction from "../../components/ConfirmAction";
import { useState } from "react";
import { Equipment, WithEquipment } from "../../types/equipment";
import { deleteEquipment } from "../../api/equipment";
import HasAccess from "../../components/rbac/HasAccess";
import { EditableComponentProps } from "../../types/common";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

type AdminCardProps = WithEquipment & EditableComponentProps<Equipment>;

const AdminCard: React.FC<AdminCardProps> = ({ equipment, handleClick }) => {
    const [editMode, setEditMode] = useState(false);

    return (
        <>
            <Card>
                <Flex justify="space-between" align="center">
                    <h3>Admin Actions</h3>
                    <HasAccess roles={["admin", "moderator"]}>
                        <Button
                            onClick={() =>
                                handleClick &&
                                handleClick(editMode, setEditMode, undefined)
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
                {editMode && (
                    <ConfirmAction
                        target={
                            <Button danger style={{ width: "100%" }}>
                                {`Delete ${equipment?.name}`} and its associated
                                data
                            </Button>
                        }
                        actionSuccess={deleteEquipment}
                        title={`Delete the ${equipment?.name} Equipment`}
                        headlineText="Deleting this equipment will also delete its associated issues."
                        confirmText={`Are you sure you wish to delete the ${equipment?.name} equipment?`}
                    />
                )}
            </Card>
        </>
    );
};

export default AdminCard;
