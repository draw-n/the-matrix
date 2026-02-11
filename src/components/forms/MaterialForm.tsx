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
    Tooltip,
} from "antd";
import { Material, WithMaterial } from "../../types/material";
import { CaretDownFilled, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useAllCategories } from "../../hooks/category";
import { CommonFormProps } from "../../types/common";
import HelpField from "./HelpField";
import { createMaterial, editMaterialById } from "../../api/material";

type MaterialFormProps = WithMaterial & CommonFormProps;

const { TextArea } = Input;

const MaterialForm: React.FC<MaterialFormProps> = ({
    material,
    onSubmit,
}: MaterialFormProps) => {
    const [form] = Form.useForm();
    const { data: categories } = useAllCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        form.submit();
    };

    const onFinish: FormProps<Material>["onFinish"] = async (values) => {
        if (material) {
            await editMaterialById(material.uuid, values);
            message.success("Material successfully updated!");
        } else {
            await createMaterial(values);
            message.success("Material successfully created!");
            form.resetFields();
        }

        onSubmit();
        setIsModalOpen(false);
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
                    size="middle"
                    icon={material ? <EditOutlined /> : <PlusOutlined />}
                    onClick={showModal}
                    iconPosition="end"
                    shape={material ? "circle" : "round"}
                >
                    {material ? null : "Add New Material"}
                </Button>
            </Tooltip>

            <Modal
                title={material ? "Edit Material" : "Add Material"}
                open={isModalOpen}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
                styles={{
                    body: {
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 200px)",
                        paddingRight: "16px",
                    },
                }}
            >
                <Form
                    onFinish={onFinish}
                    onFinishFailed={(err: any) =>
                        message.error(
                            "Missing or invalid fields. Please check and try again.",
                        )
                    }
                    name="materialForm"
                    layout="vertical"
                    form={form}
                    colon={false}
                    preserve={false}
                    initialValues={
                        material
                            ? material
                            : {
                                  name: "",
                                  shortName: "",
                                  categoryId: null,
                                  description: "",
                                  properties: [],
                                  temperatures: undefined,
                                  remotePrintAvailable: false,
                              }
                    }
                >
                    <Form.Item<Material>
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
                        <Form.Item<Material>
                            name="shortName"
                            style={{ width: "50%" }}
                            label={
                                <Flex gap="small" align="center">
                                    Acryonym/Abbreviation
                                    <HelpField content="Defines a shorter name for the material. (ex. PLA)" />
                                </Flex>
                            }
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add an acronym/abbreviation to the material.",
                                },
                            ]}
                        >
                            <Input size="small" placeholder="ex. PLA" />
                        </Form.Item>
                        <Form.Item<Material>
                            name="categoryId"
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
                                    value: category.uuid,
                                    label: category.name,
                                }))}
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item<Material>
                        label={
                            <Flex gap="small" align="center">
                                Properties
                                <HelpField content="Defines specific characteristics or attributes of the material (ex. flexibility, biodegradability)" />
                            </Flex>
                        }
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
                    <Form.Item<Material>
                        name="description"
                        label={
                            <Flex gap="small" align="center">
                                Description
                                <HelpField content="Provides a detailed description of the material." />
                            </Flex>
                        }
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
                            prevValues.categoryId !== currentValues.categoryId
                        }
                    >
                        {({ getFieldValue }) => {
                            const category = categories?.find(
                                (item) =>
                                    item.uuid == getFieldValue("categoryId"),
                            );
                            return category?.properties?.includes(
                                "temperature",
                            ) ? (
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} lg={4}>
                                        <p>Extruder</p>
                                    </Col>
                                    <Col xs={24} lg={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>First layer:</p>
                                            <Form.Item<Material>
                                                name={[
                                                    "temperatures",
                                                    "extruder",
                                                    "firstLayer",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            category?.properties?.includes(
                                                                "temperature",
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
                                                            "",
                                                        ) as unknown as number
                                                    }
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Col>
                                    <Col xs={24} lg={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>Other layers:</p>
                                            <Form.Item<Material>
                                                name={[
                                                    "temperatures",
                                                    "extruder",
                                                    "otherLayers",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            category?.properties?.includes(
                                                                "temperature",
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
                                                            "",
                                                        ) as unknown as number
                                                    }
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Col>
                                    <Col xs={24} lg={4}>
                                        <p>Bed</p>
                                    </Col>
                                    <Col xs={24} lg={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>First layer:</p>
                                            <Form.Item<Material>
                                                name={[
                                                    "temperatures",
                                                    "bed",
                                                    "firstLayer",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            category?.properties?.includes(
                                                                "temperature",
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
                                                            "",
                                                        ) as unknown as number
                                                    }
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Col>
                                    <Col xs={24} lg={10}>
                                        <Flex gap="10px" justify="end">
                                            <p>Other layers:</p>
                                            <Form.Item<Material>
                                                name={[
                                                    "temperatures",
                                                    "bed",
                                                    "otherLayers",
                                                ]}
                                                rules={[
                                                    {
                                                        required:
                                                            category?.properties?.includes(
                                                                "temperature",
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
                                                            "",
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

                    <Form.Item<Material>
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
