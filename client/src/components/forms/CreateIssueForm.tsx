import {
    Button,
    Form,
    Select,
    Input,
    Result,
    Flex,
    Space,
    message,
} from "antd";
import { useState } from "react";
import SelectEquipment from "./SelectEquipment";
import { useAuth } from "../../hooks/AuthContext";
import "./issues.css";
import axios from "axios";
import { Equipment } from "../../types/Equipment";

const { TextArea } = Input;

const CreateIssueForm: React.FC = () => {
    const [form] = Form.useForm();
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [type, setType] = useState<string | null>(null);
    const [initialDescription, setInitialDescription] = useState<string | null>(
        null
    );
    const [description, setDescription] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { user } = useAuth();

    const handleSubmit = async () => {
        try {
            const newIssue = {
                equipment: equipment?._id,
                createdBy: user?._id,
                dateCreated: new Date(),
                description: `${initialDescription}\n${description}`,
            };
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/issues`,
                newIssue
            );
            makeAnnouncement();
            updateEquipment(response.data._id);
        } catch (error) {
            console.error("issue submitting an issue:", error);
        }
    };

    const makeAnnouncement = async () => {
        try {
            const newAnnouncement = {
                type: "issue",
                title: equipment?.name,
                createdBy: user?._id,
                dateCreated: new Date(),
                description: `${initialDescription}`,
            };
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/announcements`,
                newAnnouncement
            );
        } catch (error) {
            console.error("issue submitting a new announcement", error);
        }
    };

    const updateEquipment = async (issueID: string) => {
        try {
            const updateEquipment = {
                issues: [issueID],
            };
            if (equipment) {
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment/${
                        equipment?._id
                    }`,
                    updateEquipment
                );
            }
        } catch (error) {
            console.error("issue updating equipment", error);
        }
    };

    const refreshForm = () => {
        setEquipment(null);
        setType(null);
        setDescription("");
        setInitialDescription(null);
        setSubmitted(false);
    };

    const onFinishFailed = () => {
        message.error("Missing one or more fields.");
    };

    const onFinish = () => {
        setSubmitted(true);
        handleSubmit();
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
                    {type}

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
                    <Form.Item
                        style={{ width: "100%" }}
                        label="Type of Equipment"
                        name="equipmentType"
                        rules={[
                            {
                                required: true,
                                message: "Please select a type of equipment.",
                            },
                        ]}
                    >
                        <Select
                            value={type}
                            onChange={setType}
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
                    {type !== null && (
                        <Form.Item
                            style={{ width: "100%" }}
                            label="Select the Equipment with the Issue"
                            name="equipmentID"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select the equipment experiencing the issue.",
                                },
                            ]}
                        >
                            <SelectEquipment
                                value={equipment}
                                setValue={(value) => {
                                    setEquipment(value);
                                    form.setFieldsValue({
                                        equipmentID: value,
                                    }); // Update the form's value
                                }}
                                type={type}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
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
                            value={initialDescription}
                            onChange={setInitialDescription}
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
                    <Form.Item
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
                        <TextArea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                        />
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
