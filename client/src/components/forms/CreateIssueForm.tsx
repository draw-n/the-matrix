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
import { useState } from "react";
import SelectEquipment from "./SelectEquipment";
import { useAuth } from "../../hooks/AuthContext";
import "./issues.css";
import axios from "axios";

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
    const { user } = useAuth();

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
                            options={[
                                {
                                    value: "filament",
                                    label: "Filament Printers",
                                },
                                { value: "resin", label: "Resin Printers" },
                                {
                                    value: "powder",
                                    label: "Powder Printers",
                                },
                                {
                                    value: "subtractive",
                                    label: "Subtractive/Traditional Manufacturing",
                                },
                                {
                                    value: "computer",
                                    label: "Desktops/TV Monitor",
                                },
                                { value: "wiring", label: "Wiring Tools" },
                                { value: "other", label: "Other" },
                            ]}
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
                                    <SelectEquipment type={type} />
                                </Form.Item>
                            ) : null; // Hide when "option2" is selected
                        }}
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
                            options={[
                                {
                                    value: `There is no filament coming out of the nozzle or the nozzle is jammed.`,
                                    label: "There is no filament coming out of the nozzle or the nozzle is jammed.",
                                },
                                {
                                    value: "The software (ex. IP address for Vorons) or method for uploading print files (ex. SD Card for Prusa) is not accessible.",
                                    label: "The software (ex. IP address for Vorons) or method for uploading print files (ex. SD Card for Prusa) is not accessible.",
                                },

                                {
                                    value: "The printer is having problems accepting GCode files.",
                                    label: "The printer is having problems accepting GCode files.",
                                },
                                {
                                    value: "A physical printer part (ex. print head, bed, belt, etc) is noticeably broken or missing.",
                                    label: "A physical printer part (ex. print head, bed, belt, etc) is noticeably broken or missing.",
                                },
                                {
                                    value: "The printer is making weird noises or emitting a strange smell.",
                                    label: "The printer is making weird noises or emitting a strange smell.",
                                },
                                {
                                    value: "There is another issue not explained by the other options. Please describe it in the next field.",
                                    label: "There is another issue not explained by the other options. Please describe it in the next field.",
                                },
                            ]}
                        />
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
