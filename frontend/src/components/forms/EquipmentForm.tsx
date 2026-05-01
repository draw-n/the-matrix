// Description: Form component for creating new equipment entries.
import { useEffect, useState } from "react";

import {
    Input,
    Form,
    Button,
    Select,
    Modal,
    Tooltip,
    FormProps,
    Flex,
    Switch,
    UploadFile,
    Upload,
    message,
    UploadProps,
} from "antd";
import {
    CaretDownFilled,
    EditOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Equipment, WithEquipment } from "../../types/equipment";
import {
    useCreateEquipment,
    useEditEquipmentById,
} from "../../hooks/useEquipment";
import { useAllCategories } from "../../hooks/useCategories";

import HelpField from "./components/HelpField";
import axios from "axios";

const EquipmentForm: React.FC<WithEquipment> = ({ equipment }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { data: categories } = useAllCategories();
    const { mutateAsync: createEquipment } = useCreateEquipment();
    const { mutateAsync: editEquipmentById } = useEditEquipmentById();
    const [uploadedFile, setUploadedFile] = useState<UploadFile[]>([]);
    const onFinish: FormProps<Equipment>["onFinish"] = async (values) => {
        if (equipment) {
            const editedEquipment: Equipment = {
                ...equipment,
                remotePrintAvailable: values.remotePrintAvailable || false,
                name: values.name || equipment.name,
                routePath: values.routePath || equipment.routePath,
                categoryId: values.categoryId || equipment.categoryId,
                description: values.description || "",
                headline: values.headline || "",
            };
            await editEquipmentById({
                equipmentId: equipment.uuid,
                editedEquipment,
                file: uploadedFile[0]?.originFileObj,
            });
        } else {
            await createEquipment({
                newEquipment: {
                    ...values,
                    remotePrintAvailable: values.remotePrintAvailable || false,
                },
                file: uploadedFile[0]?.originFileObj,
            });
        }
        setIsModalOpen(false);
        form.resetFields();
    };

    useEffect(() => {
        if (!equipment || !equipment.imageName) return;
        const fileName = equipment.imageName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/images/equipment/${fileName}`;

        let previewUrl: string | null = null;
        (async () => {
            try {
                const response = await axios.get(url, {
                    responseType: "blob",
                    withCredentials: true,
                });
                if (!response.data)
                    throw new Error(
                        `Failed to fetch image: ${response.status}`,
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
    }, [equipment]);

    const props: UploadProps = {
        beforeUpload: (file) => {
            // 1. Validate File Extension
            const isValidExtension =
                file.name.toLowerCase().endsWith(".jpg") ||
                file.name.toLowerCase().endsWith(".png") ||
                file.name.toLowerCase().endsWith(".gif") ||
                file.name.toLowerCase().endsWith(".bmp") ||
                file.name.toLowerCase().endsWith(".webp") ||
                file.name.toLowerCase().endsWith(".tiff") ||
                file.name.toLowerCase().endsWith(".raw") ||
                file.name.toLowerCase().endsWith(".svg") ||
                file.name.toLowerCase().endsWith(".jpeg");

            if (!isValidExtension) {
                message.error("Only image files are supported.");
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

    return (
        <>
            <Tooltip title={equipment ? "Edit Equipment" : "Add Equipment"}>
                <Button
                    type="primary"
                    size="middle"
                    color={equipment ? "blue" : "primary"}
                    variant="solid"
                    style={{
                        boxShadow: "none",
                    }}
                    icon={equipment ? <EditOutlined /> : <PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    iconPlacement="end"
                    shape={equipment ? "circle" : "round"}
                >
                    {equipment ? null : "Add New Equipment"}
                </Button>
            </Tooltip>

            <Modal
                title={equipment ? "Edit Equipment" : "Add Equipment"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                centered
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
                    form={form}
                    name="basic"
                    layout="vertical"
                    colon={false}
                    style={{ width: "100%" }}
                    initialValues={
                        equipment
                            ? {
                                  name: equipment.name,
                                  routePath: equipment.routePath,
                                  categoryId: equipment.categoryId,
                                  description: equipment.description,
                                  headline: equipment.headline,
                                  ipUrl: equipment.ipUrl,
                                  cameraUrl: equipment.cameraUrl,
                                  remotePrintAvailable:
                                      equipment.remotePrintAvailable,
                                  file: uploadedFile[0]?.originFileObj,
                              }
                            : {
                                  remotePrintAvailable: false,
                                  name: "",
                                  routePath: "",
                                  categoryId: "",
                                  description: "",
                                  headline: "",
                                  ipUrl: "",
                                  cameraUrl: "",
                              }
                    }
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item<Equipment>
                        style={{ width: "100%" }}
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please add a name to the equipment.",
                            },
                        ]}
                    >
                        <Input size="small" />
                    </Form.Item>
                    <Flex gap="small">
                        <Form.Item<Equipment>
                            style={{ width: "100%" }}
                            label={
                                <Flex gap="small" align="center">
                                    Website Page Route Path
                                    <HelpField content="Defines the url for the equipment's webpage. (ex. /makerspace/voron-1)" />
                                </Flex>
                            }
                            name="routePath"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add a route path (ex. voron-1).",
                                },
                            ]}
                        >
                            <Input addonBefore="/makerspace/" size="small" />
                        </Form.Item>
                        <Form.Item<Equipment>
                            style={{ width: "100%" }}
                            label="Category"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a category type.",
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
                    <Form.Item<Equipment>
                        style={{ width: "100%" }}
                        label={
                            <Flex gap="small" align="center">
                                Headline
                                <HelpField content="Important information about the equipment. (ex. volume size, special features)" />
                            </Flex>
                        }
                        name="headline"
                    >
                        <Input size="small" />
                    </Form.Item>
                    <Form.Item<Equipment>
                        style={{ width: "100%" }}
                        label={
                            <Flex gap="small" align="center">
                                Description
                                <HelpField content="Provide a detailed description of the equipment." />
                            </Flex>
                        }
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description for the equipment.",
                            },
                        ]}
                    >
                        <Input.TextArea size="small" rows={6} />
                    </Form.Item>
                    <Form.Item<Equipment>
                        style={{ width: "100%" }}
                        label={
                            <Flex gap="small" align="center">
                                IP Address
                                <HelpField content="The IP address or URL of the equipment. (ex. 10.68.1.176)" />
                            </Flex>
                        }
                        name="ipUrl"
                    >
                        <Input size="small" />
                    </Form.Item>
                    <Form.Item<Equipment>
                        style={{ width: "100%" }}
                        label={
                            <Flex gap="small" align="center">
                                Camera URL
                                <HelpField content="The IP address or URL of the equipment's camera. (ex. 10.68.1.176)" />
                            </Flex>
                        }
                        name="cameraUrl"
                    >
                        <Input size="small" />
                    </Form.Item>
                    <Form.Item<Equipment>
                        valuePropName="checked"
                        name="remotePrintAvailable"
                        label="Will it be available for remote printing?"
                        layout="horizontal"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item name="file">
                        <Upload
                            {...props}
                            fileList={uploadedFile}
                            listType="picture"
                        >
                            <Button
                                shape="round"
                                type="default"
                                icon={<UploadOutlined />}
                            >
                                Upload Image
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EquipmentForm;
