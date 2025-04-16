import { Modal, Space } from "antd";
import React, { useState } from "react";

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

    const showModal = () => {
        setIsModalOpen(true);
    };

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
            <div onClick={showModal}>{target}</div>
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
