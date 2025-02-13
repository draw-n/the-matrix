import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Tooltip } from "antd";
import React, { useState } from "react";

interface EditDefaultIssueProps {
    initialEditMode: boolean;
    issue: string;
    setIssue: (index: number, item: string) => void;
    index: number;
    updateCategory: () => void;
}

const EditDefaultIssue: React.FC<EditDefaultIssueProps> = ({
    issue,
    setIssue,
    index,
    initialEditMode,
    updateCategory,
}: EditDefaultIssueProps) => {
    const [editMode, setEditMode] = useState(initialEditMode);

    return (
        <Flex justify="space-between" gap="small">
            <Input
                onChange={(e) => setIssue(index, e.target.value)}
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

            <Tooltip title="Delete Issue">
                <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
        </Flex>
    );
};

export default EditDefaultIssue;
