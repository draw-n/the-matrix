import React, { useEffect, useState } from "react";
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
    Tooltip,
} from "antd";
import axios from "axios";
import { FilamentTemperatures, Material } from "../../types/Material";
import { CaretDownFilled, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Category } from "../../types/Category";

interface MaterialFormProps {
    material?: Material;
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    shortName: string;
    category: string;
    properties: string[];
    description: string;
    remotePrintAvailable: boolean;
    temperatures?: FilamentTemperatures;
}

const { TextArea } = Input;

const MaterialForm: React.FC<MaterialFormProps> = ({
    material,
    onUpdate,
}: MaterialFormProps) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<Category[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        form.submit();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Category[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`
                );
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            if (material) {
                const editedMaterial: Material = {
                    _id: material._id,
                    ...values,
                };
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/materials/${
                        material._id
                    }`,
                    editedMaterial
                );
                message.success(response.data.message);
            } else {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/materials`,
                    values
                );
                message.success("Material successfully created!");
                form.resetFields();
            }

            onUpdate();
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
            <Tooltip title={material ? "Edit Material" : "Add Material"}>
                <Button
                    type="primary"
                    size="small"
                    icon={material ? <EditOutlined /> : <PlusOutlined />}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title={material ? "Edit Material" : "Add Material"}
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
                    colon={false}
                    preserve={false}
                    initialValues={
                        material
                            ? {
                                  name: material.name,
                                  shortName: material.shortName,
                                  category: material.category,
                                  description: material.description,
                                  temperatures: material.temperatures,
                                  properties: material.properties,
                                  remotePrintAvailable:
                                      material.remotePrintAvailable,
                              }
                            : {
                                  name: "",
                                  shortName: "",
                                  category: null,
                                  description: "",
                                  properties: [],
                                  temperatures: undefined,
                                  remotePrintAvailable: false,
                              }
                    }
                >
                    <Form.Item<FieldType>
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please add a name for the material.",
                            },
                        ]}
                    >
                        <Input size="small" placeholder="ex. Polylactic Acid" />
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
                                        "Please add a short name/nickname to the material.",
                                },
                            ]}
                        >
                            <Input size="small" placeholder="ex. PLA" />
                        </Form.Item>
                        <Form.Item<FieldType>
                            name="category"
                            style={{ width: "50%" }}
                            label="Category"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select a type of material.",
                                },
                            ]}
                        >
                            <Select
                                size="small"
                                suffixIcon={<CaretDownFilled />}
                                options={categories?.map((category) => ({
                                    value: category._id,
                                    label: category.name,
                                }))}
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item<FieldType>
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
                        <Select
                            size="small"
                            mode="tags"
                            style={{ width: "100%" }}
                            tokenSeparators={[","]}
                            open={false}
                            suffixIcon={null}
                        />
                    </Form.Item>
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
                        <TextArea size="small" rows={3} />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.category !== currentValues.category
                        }
                    >
                        {({ getFieldValue }) => {
                            const category = categories?.find(
                                (item) => item._id == getFieldValue("category")
                            );
                            return category?.properties?.includes(
                                "temperature"
                            ) ? (
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
                                                            category?.properties?.includes(
                                                                "temperature"
                                                            ),
                                                        message:
                                                            "Please add a temperature for the extruder on the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    size="small"
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
                                                            category?.properties?.includes(
                                                                "temperature"
                                                            ),
                                                        message:
                                                            "Please add a temperature for the extruder after the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    size="small"
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
                                                            category?.properties?.includes(
                                                                "temperature"
                                                            ),
                                                        message:
                                                            "Please add a temperature for the bed on the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    size="small"
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
                                                            category?.properties?.includes(
                                                                "temperature"
                                                            ),
                                                        message:
                                                            "Please add a temperature for the bed after the first layer.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    size="small"
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
                        label="Will it be available for remote printing?"
                        layout="horizontal"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default MaterialForm;
