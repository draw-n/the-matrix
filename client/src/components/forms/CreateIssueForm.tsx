import {
    Button,
    Form,
    Select,
    Input,
    Result,
    Flex,
    message,
    FormProps,
} from "antd";
import { useEffect, useState } from "react";
import SelectEquipment from "./SelectEquipment";
import { useAuth } from "../../hooks/AuthContext";
import "./issues.css";
import axios from "axios";
import { CaretDownFilled } from "@ant-design/icons";
import { Category } from "../../types/Category";

const { TextArea } = Input;

interface FieldType {
    equipment: string;
    type: string;
    initialDescription: string;
    description: string;
}

const CreateIssueForm: React.FC = () => {
    const [form] = Form.useForm();
    const [submitted, setSubmitted] = useState<boolean>(false);
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

    const refreshForm = () => {
        form.resetFields();
        setSubmitted(false);
    };

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
            setSubmitted(true);
        } catch (error) {
            console.error("Problem creating an issue: ", error);
        }
    };

    return (
        <>
            {submitted ? (
                <Result
                    status="success"
                    title="Successfully Submitted an Issue!"
                    subTitle="Thank you for letting us know about the problem. We will fix it as soon as possible."
                    extra={[
                        <Button
                            onClick={refreshForm}
                            key="resubmit"
                            type="primary"
                        >
                            Submit Another
                        </Button>,
                    ]}
                />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Flex style={{ width: "100%" }} justify="space-between">
                        <Form.Item required label="First Name">
                            <Input disabled value={user?.firstName} />
                        </Form.Item>
                        <Form.Item required label="Last Name">
                            <Input disabled value={user?.lastName} />
                        </Form.Item>
                        <Form.Item
                            style={{ width: "40%" }}
                            required
                            label="Email"
                        >
                            <Input disabled value={user?.email} />
                        </Form.Item>
                    </Flex>
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Type of Equipment"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: "Please select a type of equipment.",
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

                    <Form.Item<FieldType>
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.type !== currentValues.type
                        }
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue("type");

                            return type ? (
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
                                        <SelectEquipment category={type} />
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
                                            suffixIcon={<CaretDownFilled />}
                                            options={categories
                                                ?.find(
                                                    (item) => item._id === type
                                                )
                                                ?.defaultIssues?.map(
                                                    (issue) => ({
                                                        value: issue,
                                                        label: issue,
                                                    })
                                                )}
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
                        <TextArea rows={6} />
                    </Form.Item>
                    <Flex justify="end" style={{ width: "100%" }} gap="10px">
                        <Form.Item>
                            <Button onClick={refreshForm}>Clear All</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Submit
                            </Button>
                        </Form.Item>
                    </Flex>
                </Form>
            )}
        </>
    );
};

export default CreateIssueForm;
