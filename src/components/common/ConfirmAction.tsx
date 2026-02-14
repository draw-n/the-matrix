// Description: A reusable confirmation modal component that prompts users to confirm or cancel an action, executing corresponding callbacks based on user choice.

import { useState } from "react";
import { Modal, Space } from "antd";

interface ConfirmActionProps {
    target?: React.ReactNode;
    actionSuccess?: () => void;
    actionFailed?: () => void;
    children?: React.ReactNode;
    title?: string;
    headlineText?: string;
    confirmText?: string;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
    target,
    actionSuccess,
    actionFailed,
    children,
    title,
    headlineText,
    confirmText,
}: ConfirmActionProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        if (actionSuccess) {
            actionSuccess();
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        if (actionFailed) {
            actionFailed();
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div onClick={() => setIsModalOpen(true)}>{target}</div>
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                title={title}
            >
                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="small"
                >
                    <p>{headlineText}</p>
                    {children}
                    <p>
                        <b>{confirmText}</b>
                    </p>
                </Space>
            </Modal>
        </>
    );
};

export default ConfirmAction;
