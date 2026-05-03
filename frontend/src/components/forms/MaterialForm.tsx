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
    Grid,
    UploadFile,
    UploadProps,
    Upload,
} from "antd";
import {
    CaretDownFilled,
    EditOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { useAllCategories } from "../../hooks/useCategories";
import { Material, WithMaterial } from "../../types/material";

import {
    useCreateMaterial,
    useEditMaterialById,
} from "../../hooks/useMaterials";
import HelpField from "./components/HelpField";
import axios from "axios";
import { useAllEquipment } from "../../hooks/useEquipment";

const MaterialForm: React.FC<WithMaterial> = ({ material }: WithMaterial) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md; // Consider mobile if screen width is less than 768px
    const { data: categories } = useAllCategories();
    const { mutateAsync: editMaterialById } = useEditMaterialById();
    const { mutateAsync: createMaterial } = useCreateMaterial();
    const [remotePrintAvailable, setRemotePrintAvailable] = useState(
        material?.remotePrintAvailable || false,
    );
    const { data: equipment } = useAllEquipment(
        undefined,
        remotePrintAvailable,
    );
    const [uploadedFile, setUploadedFile] = useState<UploadFile[]>([]);

    const props: UploadProps = {
        beforeUpload: (file) => {
            // 1. Validate File Extension
            const isValidExtension = file.name.toLowerCase().endsWith(".ini");

            if (!isValidExtension) {
                message.error("Only .ini files are supported.");
                return Upload.LIST_IGNORE;
            }
            // 2. Validate File Size (50MB)
            const isLt50M = file.size / 1024 / 1024 < 50;

            if (!isLt50M) {
                message.error("File must be smaller than 50MB.");
                return Upload.LIST_IGNORE;
            }

            // 3. Update State
            setUploadedFile([
                {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    originFileObj: file,
                },
            ]);

            return false; // Prevent auto upload
        },
        onChange: ({ fileList }) => {
            setUploadedFile(fileList as UploadFile[]);
        },
    };

    useEffect(() => {
        if (!material || !material.remotePrintConfigName) return;
        const fileName = material.remotePrintConfigName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/configs/${fileName}`;

        let previewUrl: string | null = null;
        (async () => {
            try {
                const response = await axios.get(url, {
                    responseType: "blob",
                    withCredentials: true,
                });
                if (!response.data)
                    throw new Error(
                        `Failed to fetch config file: ${response.status}`,
                    );
                const blob = await response.data;
                const file = new File([blob], fileName, {
                    type: blob.type || "application/octet-stream",
                });
                // create a preview so Upload shows the item as if it were local
                previewUrl = URL.createObjectURL(file);
                setUploadedFile([
                    {
                        uid: `server-${fileName}`,
                        name: fileName,
                        status: "done",
                        originFileObj: file,
                        url,
                        thumbUrl: previewUrl,
                    } as UploadFile,
                ]);
            } catch (err) {
                // Fallback to URL-only entry if fetching as blob fails
                setUploadedFile([
                    {
                        uid: `server-${fileName}`,
                        name: fileName,
                        status: "done",
                        url,
                        thumbUrl: url,
                    } as UploadFile,
                ]);
            }
        })();
        // cleanup preview URL when announcement changes or component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [material]);

    const onFinish: FormProps<Material>["onFinish"] = async (values) => {
        if (material) {
            const editedMaterial = {
                ...material,
                remotePrintAvailable: values.remotePrintAvailable,
                shortName: values.shortName,
                name: values.name,
                categoryId: values.categoryId,
                description: values.description,
                properties: values.properties,
                temperatures: values.temperatures,
                remotePrintEquipmentIds: values.remotePrintEquipmentIds,
            };
            await editMaterialById({
                materialId: material.uuid,
                editedMaterial: editedMaterial,
                file: uploadedFile[0]?.originFileObj,
            });
        } else {
            const newMaterial = {
                remotePrintAvailable: values.remotePrintAvailable,
                shortName: values.shortName,
                name: values.name,
                categoryId: values.categoryId,
                description: values.description,
                properties: values.properties,
                temperatures: values.temperatures,
                remotePrintEquipmentIds: values.remotePrintEquipmentIds,
            };
            await createMaterial({
                newMaterial: newMaterial,
                file: uploadedFile[0]?.originFileObj,
            });
            form.resetFields();
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <Tooltip title={material ? "Edit Material" : "Add Material"}>
                <Button
                    type="primary"
                    size="middle"
                    icon={material ? <EditOutlined /> : <PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    iconPlacement="end"
                    shape={material || isMobile ? "circle" : "round"}
                >
                    {material || isMobile ? null : "Add New Material"}
                </Button>
            </Tooltip>

            <Modal
                title={material ? "Edit Material" : "Add Material"}
                open={isModalOpen}
                centered
                onOk={() => form.submit()}
                onCancel={() => {
                    form.resetFields();
                    setIsModalOpen(false);
                }}
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
                    initialValues={
                        material
                            ? {
                                  remotePrintAvailable:
                                      material.remotePrintAvailable,
                                  shortName: material.shortName,
                                  name: material.name,
                                  categoryId: material.categoryId,
                                  description: material.description,
                                  properties: material.properties,
                                  temperatures: material.temperatures,
                                  remotePrintEquipmentIds:
                                      material.remotePrintEquipmentIds,
                              }
                            : {
                                  name: "",
                                  shortName: "",
                                  categoryId: null,
                                  description: "",
                                  properties: [],
                                  temperatures: {
                                      extruder: {
                                          firstLayer: 0,
                                          otherLayers: 0,
                                      },
                                      bed: {
                                          firstLayer: 0,
                                          otherLayers: 0,
                                      },
                                  },
                                  remotePrintAvailable: false,
                                  remotePrintEquipmentIds: [],
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
                        <Input.TextArea size="small" rows={3} />
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
                                <Row gutter={[8, 8]}>
                                    <Col span={24}>
                                        <p style={{ marginBottom: 0 }}>
                                            Extuder Temperatures
                                        </p>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item<Material>
                                            layout="horizontal"
                                            label="First layer:"
                                            required
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
                                                suffix="°C"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item<Material>
                                            required
                                            layout="horizontal"
                                            label="Other layers:"
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
                                                suffix="°C"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <p style={{ marginBottom: 0 }}>
                                            Bed Temperatures
                                        </p>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item<Material>
                                            label="First layer:"
                                            required
                                            layout="horizontal"
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
                                                suffix="°C"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item<Material>
                                            label="Other layers:"
                                            required
                                            layout="horizontal"
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
                                                suffix="°C"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null; // Hide the grid if 'visibility' is not 'show'
                        }}
                    </Form.Item>

                    <Form.Item<Material>
                        name="remotePrintAvailable"
                        label="Will it be available for remote printing?"
                        layout="horizontal"
                        valuePropName="checked"
                    >
                        <Switch
                            onChange={(checked) =>
                                setRemotePrintAvailable(checked)
                            }
                        />
                    </Form.Item>
                    {remotePrintAvailable && (
                        <Form.Item
                            name="remotePrintEquipmentIds"
                            label={`Equipment(s) for ${material?.shortName} Remote Printing`}
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter the equipment IDs for remote printing.",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                options={equipment?.map((item) => ({
                                    value: item.uuid,
                                    label: item.name,
                                }))}
                            />
                        </Form.Item>
                    )}
                    {remotePrintAvailable && (
                        <Form.Item
                            name="file"
                            label="Remote Print Config (.ini file)"
                            rules={[
                                {
                                    required: !material?.remotePrintConfigName,
                                    message:
                                        "Please upload a remote print config file.",
                                },
                            ]}
                        >
                            <Upload
                                {...props}
                                fileList={uploadedFile}
                                listType="text"
                            >
                                <Button
                                    shape="round"
                                    type="default"
                                    icon={<UploadOutlined />}
                                >
                                    Upload Config File
                                </Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default MaterialForm;
