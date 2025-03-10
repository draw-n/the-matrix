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
import { useEffect, useState } from "react";
import axios from "axios";
import { CaretDownFilled, PlusOutlined } from "@ant-design/icons";
import MultiType from "./MultiType";
import { Category } from "../../types/Category";

interface MaterialFormProps {
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    shortName: string;
    category: string;
    description: string;
    properties: string[];
    remotePrintAvailable: boolean;
}

const { TextArea } = Input;

const CreateMaterialForm: React.FC<MaterialFormProps> = ({
    onUpdate,
}: MaterialFormProps) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<Category[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
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
            <Tooltip title="Add New Materials" placement="topLeft">
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
                        category: null,
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
                            label="Category"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a category type.",
                                },
                            ]}
                        >
                            <Select
                                suffixIcon={<CaretDownFilled />}
                                options={categories?.map((category) => ({
                                    value: category._id,
                                    label: category.name,
                                }))}
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
