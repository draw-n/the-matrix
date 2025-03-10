import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Popconfirm, Tooltip } from "antd";
import React, { useState } from "react";

interface EditDefaultIssueProps {
    initialEditMode: boolean;
    issue: string;
    updateIssue: (index: number, item: string) => void;
    index: number;
    updateCategory: () => void;
    deleteIssue: (index: number) => void;
}

const EditDefaultIssue: React.FC<EditDefaultIssueProps> = ({
    issue,
    updateIssue,
    index,
    initialEditMode,
    updateCategory,
    deleteIssue,
}: EditDefaultIssueProps) => {
    const [editMode, setEditMode] = useState(initialEditMode);

    return (
        <Flex justify="space-between" gap="small">
            <Input
                onChange={(e) => updateIssue(index, e.target.value)}
                value={issue}
                disabled={!editMode}
            />
            {editMode ? (
                <Tooltip title="Save Issue">
                    <Button
                        icon={<SaveOutlined />}
                        onClick={() => {
                            updateCategory();
                            setEditMode(false);
                        }}
                    />
                </Tooltip>
            ) : (
                <Tooltip title="Edit Issue">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                    />
                </Tooltip>
            )}

            <Tooltip title="Delete">
                <Popconfirm
                    placement="topRight"
                    title="Delete Common Issue"
                    description="Are you sure you want to delete this common issue?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => deleteIssue(index)}
                >
                    <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
            </Tooltip>
        </Flex>
    );
};

export default EditDefaultIssue;
