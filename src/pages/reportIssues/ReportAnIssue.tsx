import { Button, Flex, Form, FormProps, Space } from "antd";
import NotFound from "../../components/NotFound";
import CreateIssueForm from "../../components/forms/CreateIssueForm";
import CategorySelection from "./CategorySelection";
import { useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import EquipmentSelection from "./EquipmentSelection";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext";
import Description from "./Description";
import IssueSelection from "./IssueSelection";
import MoreDetails from "./MoreDetails";
import SubmittedIssue from "./SubmittedIssue";

interface FieldType {
    equipment: string;
    category: string;
    initialDescription: string;
    description: string;
}

const ReportAnIssue: React.FC = () => {
    const [form] = Form.useForm();
    const [stepIndex, setStepIndex] = useState(0);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const { user } = useAuth();

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
            setStepIndex(stepIndex + 1);
            form.resetFields();
        } catch (error) {
            console.error("Problem creating an issue: ", error);
        }
    };
    const steps = [
        <Description />,
        <Form.Item<FieldType> name="category" style={{ margin: 0 }}>
            <CategorySelection />
        </Form.Item>,
        <>
            <Form.Item
                noStyle
                shouldUpdate={(prev, curr) => prev.category !== curr.category}
            >
                {({ getFieldValue }) => (
                    <Form.Item<FieldType>
                        name="equipment"
                        style={{ margin: 0 }}
                    >
                        <EquipmentSelection
                            category={getFieldValue("category")}
                        />
                    </Form.Item>
                )}
            </Form.Item>
        </>,

        <>
            <Form.Item
                noStyle
                shouldUpdate={(prev, curr) => prev.category !== curr.category}
            >
                {({ getFieldValue }) => (
                    <Form.Item<FieldType>
                        name="initialDescription"
                        style={{ margin: 0 }}
                    >
                        <IssueSelection
                            categoryId={getFieldValue("category")}
                        />
                    </Form.Item>
                )}
            </Form.Item>
        </>,
        <Form.Item<FieldType> name="description" style={{ margin: 0 }}>
            <MoreDetails />
        </Form.Item>,
        <SubmittedIssue refreshForm={() => setStepIndex(0)} />,
    ];

    return (
        <Form form={form} onFinish={onFinish}>
            {JSON.stringify(form.getFieldsValue())}
            {steps.map((step, index) => (
                <Flex
                    style={{
                        display: index === stepIndex ? "contents" : "none",
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {step}
                </Flex>
            ))}
            <Flex
                style={{ marginTop: 20 }}
                justify="center"
                align="center"
                flex="1"
                gap="small"
            >
                {stepIndex > 0 && stepIndex < steps.length - 1 && (
                    <Button
                        variant="filled"
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        iconPosition="start"
                        onClick={() => setStepIndex(Math.max(stepIndex - 1, 0))}
                    >
                        Back
                    </Button>
                )}
                {stepIndex < steps.length - 2 && (
                    <Button
                        variant="filled"
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        onClick={() =>
                            setStepIndex(
                                Math.min(stepIndex + 1, steps.length - 1)
                            )
                        }
                    >
                        Next
                    </Button>
                )}
                {stepIndex === steps.length - 2 && (
                    <Button
                        variant="filled"
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        htmlType="submit"
                    >
                        Submit
                    </Button>
                )}
            </Flex>
        </Form>
    );
};

export default ReportAnIssue;
