import {
    Button,
    Form,
    Select,
    Input,
    message,
    FormProps,
    Tooltip,
    Modal,
} from "antd";
import { useEffect, useState } from "react";
import SelectEquipment from "./SelectEquipment";
import { useAuth } from "../../hooks/AuthContext";
import "./issues.css";
import axios from "axios";
import { CaretDownFilled, PlusOutlined } from "@ant-design/icons";
import { Category } from "../../types/Category";

const { TextArea } = Input;

interface FieldType {
    equipment: string;
    category: string;
    initialDescription: string;
    description: string;
}

interface CreateIssueFormProps {
    onUpdate: () => void;
}

const CreateIssueForm: React.FC<CreateIssueFormProps> = ({ onUpdate }: CreateIssueFormProps) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const [categories, setCategories] = useState<Category[]>();

    const { user } = useAuth();

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

    const onFinishFailed = () => {
        message.error("Missing one or more fields.");
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            const newIssue = {
                equipment: values.equipment,
                description: `${values.initialDescription}\n${values.description}`,
                createdBy: user?._id,
                dateCreated: new Date(),
            };
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/issues`,
                newIssue
            );
            setIsModalOpen(false);
            onUpdate();
        } catch (error) {
            console.error("Problem creating an issue: ", error);
        }
    };

    const handleOk = async () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    return (
        <>
            <Tooltip title={"Add Issue"}>
                <Button
                    type="primary"
                    size="middle"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    iconPosition="end"
                    shape={"round"}
                >
                    Add New Issue
                </Button>
            </Tooltip>

            <Modal
                title={"Add Issue"}
                open={isModalOpen}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Equipment Category"
                        name="category"
                        rules={[
                            {
                                required: true,
                                message: "Please select a type of equipment.",
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

                    <Form.Item<FieldType>
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.category !== currentValues.category
                        }
                    >
                        {({ getFieldValue }) => {
                            const category = getFieldValue("category");

                            return category ? (
                                <>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="Select the Equipment with the Issue"
                                        name="equipment"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select the equipment experiencing the issue.",
                                            },
                                        ]}
                                    >
                                        <SelectEquipment category={category} />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        style={{ width: "100%" }}
                                        label="What is the issue? Select the one that is the most applicable."
                                        name="initialDescription"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please add a description for the issue.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            size="small"
                                            suffixIcon={<CaretDownFilled />}
                                            options={[
                                                ...(categories
                                                    ?.find(
                                                        (item) =>
                                                            item._id ===
                                                            category
                                                    )
                                                    ?.defaultIssues?.map(
                                                        (issue) => ({
                                                            value: issue,
                                                            label: issue,
                                                        })
                                                    ) || []),
                                                {
                                                    value: "There is another issue not covered by the other options. Please elaborate below.",
                                                    label: "There is another issue not covered by the other options. Please elaborate below.",
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </>
                            ) : null; // Hide when "option2" is selected
                        }}
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Please Provide More Details About the Issue"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description for the issue.",
                            },
                        ]}
                    >
                        <TextArea size="small" rows={6} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateIssueForm;
