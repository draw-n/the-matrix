import {
    Input,
    Form,
    Flex,
    Button,
    Select,
    Modal,
    Switch,
    Tooltip,
    message,
} from "antd";
import { FormProps } from "antd";
import { useState } from "react";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import MultiType from "./MultiType";

interface MaterialFormProps {
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    shortName: string;
    type: string;
    description: string;
    properties: string[];
    remotePrintAvailable: boolean;
}

const { TextArea } = Input;

const CreateMaterialForm: React.FC<MaterialFormProps> = ({
    onUpdate,
}: MaterialFormProps) => {
    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        form.submit();
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            console.log(values.remotePrintAvailable);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/materials`,
                values
            );
            onUpdate();
            message.success("Material successfully created!");
            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Problem creating new material: ", error);
        }
    };

    const onFinishFailed = () => {
        message.error("Missing one or more fields.");
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    return (
        <>
            <Tooltip title="Add New Materials">
                <Button
                    type="primary"
                    className="primary-button-filled"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Add New Materials"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    name="basic"
                    layout="vertical"
                    initialValues={{
                        name: "",
                        shortName: "",
                        type: null,
                        description: "",
                        properties: [],
                        temperatures: undefined,
                        remotePrintAvailable: false,
                    }}
                    style={{ width: "100%" }}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please add a name for the material.",
                            },
                        ]}
                    >
                        <Input placeholder="ex. Polylactic Acid" />
                    </Form.Item>
                    <Flex gap="10px">
                        <Form.Item<FieldType>
                            style={{ width: "50%" }}
                            label="Short Name"
                            name="shortName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add a name for the material.",
                                },
                            ]}
                        >
                            <Input placeholder="ex. PLA" />
                        </Form.Item>
                        <Form.Item<FieldType>
                            style={{ width: "50%" }}
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a category type.",
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    {
                                        value: "filament",
                                        label: "Filament",
                                    },
                                    { value: "resin", label: "Resin" },
                                    { value: "powder", label: "Powder" },
                                ]}
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Properties"
                        name="properties"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add properties for the material.",
                            },
                        ]}
                    >
                        <MultiType />
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description to the equipment.",
                            },
                        ]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label={null}
                        name="remotePrintAvailable"
                    >
                        <Flex gap="10px" align="center">
                            <p>Will it be available for remote printing?</p>

                            <Switch />
                        </Flex>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateMaterialForm;
