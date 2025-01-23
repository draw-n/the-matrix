import React, { useState } from "react";
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Flex,
    InputNumber,
    Col,
    Row,
    FormProps,
    message,
} from "antd";
import axios from "axios";
import { FilamentTemperatures, Material } from "../../types/Material";

interface EditMaterialFormProps {
    material: Material;
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    shortName: string;
    type: string;
    properties: string[];
    description: string;
    remotePrintAvailable: boolean;
    temperatures?: FilamentTemperatures;
}

const { TextArea } = Input;

const EditMaterialForm: React.FC<EditMaterialFormProps> = ({
    material,
    onUpdate,
}: EditMaterialFormProps) => {
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
            const editedMaterial: Material = {
                _id: material._id,
                ...values,
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/materials/${material._id}`,
                editedMaterial
            );
            onUpdate();
            message.success("Material successfully updated!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Issue editing update", error);
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
            <Button className="primary-button-filled" onClick={showModal}>
                Edit
            </Button>
            <Modal
                title="Edit Update"
                open={isModalOpen}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    form={form}
                    initialValues={{
                        name: material.name,
                        shortName: material.shortName,
                        type: material.type,
                        description: material.description,
                        temperatures: material.temperatures,
                        properties: material.properties,
                        remotePrintAvailable: material.remotePrintAvailable,
                    }}
                >
                    <Form.Item<FieldType>
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please add a name to the material.",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Flex gap="10px">
                        <Form.Item<FieldType>
                            name="shortName"
                            style={{ width: "50%" }}
                            label="Short Name"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add a short name to the material.",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            name="type"
                            style={{ width: "50%" }}
                            label="Type"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select a type of material.",
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
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description for the material.",
                            },
                        ]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.type !== currentValues.type
                        }
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue("type");
                            // Only render the grid if 'visibility' is 'show'
                            return type === "filament" ? (
                                <Row gutter={[16, 16]}>
                                    <Col span={4}>
                                        <p>Extruder</p>
                                    </Col>
                                    <Col span={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>First layer:</p>
                                            <Form.Item<FieldType>
                                                name={[
                                                    "temperatures",
                                                    "extruder",
                                                    "firstLayer",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            type === "filament",
                                                        message:
                                                            "Please add a temperature for the extruder on the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    formatter={(value) =>
                                                        `${value} °C`
                                                    }
                                                    parser={(value) =>
                                                        value?.replace(
                                                            " °C",
                                                            ""
                                                        ) as unknown as number
                                                    }
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Col>
                                    <Col span={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>Other layers:</p>
                                            <Form.Item<FieldType>
                                                name={[
                                                    "temperatures",
                                                    "extruder",
                                                    "otherLayers",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            type === "filament",
                                                        message:
                                                            "Please add a temperature for the extruder after the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    formatter={(value) =>
                                                        `${value} °C`
                                                    }
                                                    parser={(value) =>
                                                        value?.replace(
                                                            " °C",
                                                            ""
                                                        ) as unknown as number
                                                    }
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Col>
                                    <Col span={4}>
                                        <p>Bed</p>
                                    </Col>
                                    <Col span={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>First layer:</p>
                                            <Form.Item<FieldType>
                                                name={[
                                                    "temperatures",
                                                    "bed",
                                                    "firstLayer",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            type === "filament",
                                                        message:
                                                            "Please add a temperature for the bed on the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    formatter={(value) =>
                                                        `${value} °C`
                                                    }
                                                    parser={(value) =>
                                                        value?.replace(
                                                            " °C",
                                                            ""
                                                        ) as unknown as number
                                                    }
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Col>
                                    <Col span={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>Other layers:</p>
                                            <Form.Item<FieldType>
                                                name={[
                                                    "temperatures",
                                                    "bed",
                                                    "otherLayers",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            type === "filament",
                                                        message:
                                                            "Please add a temperature for the bed after the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    formatter={(value) =>
                                                        `${value} °C`
                                                    }
                                                    parser={(value) =>
                                                        value?.replace(
                                                            " °C",
                                                            ""
                                                        ) as unknown as number
                                                    }
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Col>
                                </Row>
                            ) : null; // Hide the grid if 'visibility' is not 'show'
                        }}
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="remotePrintAvailable"
                        label={null}
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

export default EditMaterialForm;
