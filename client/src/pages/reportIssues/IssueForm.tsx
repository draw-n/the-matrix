import { Button, Form, Select, Steps, Input, Result } from "antd";
import { useState } from "react";
import SelectEquipment from "./SelectEquipment";

const { TextArea } = Input;

const IssueForm: React.FC = () => {
    const [current, setCurrent] = useState(0);

    const [equipmentID, setEquipmentID] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const steps = [
        {
            title: "General",
            content: (
                <Form.Item
                    style={{ width: "100%" }}
                    label="Types of Equipment"
                    name="equipmentType"
                    rules={[
                        {
                            required: true,
                            message: "Please select a type of equipment.",
                        },
                    ]}
                >
                    <Select
                        onChange={(e) => setType(e.target.value)}
                        options={[
                            {
                                value: "filament",
                                label: "Filament Printers",
                            },
                            { value: "resin", label: "Resin Printers" },
                            { value: "powder", label: "Powder Printers" },
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
            ),
        },
        {
            title: "Select Equipment",
            content: (
                <Form.Item
                    style={{ width: "100%" }}
                    label="Select the Equipment with the Issue."
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: "Please add a description for the issue.",
                        },
                    ]}
                >
                    <SelectEquipment setID={setEquipmentID} type={type} />
                </Form.Item>
            ),
        },
        {
            title: "More Details",
            content: (
                <>
                    <Form.Item
                        style={{ width: "100%" }}
                        label="What is the issue? Select the one that is the most applicable."
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description for the issue.",
                            },
                        ]}
                    >
                        <Select
                            onChange={(e) => setType(e.target.value)}
                            options={[
                                {
                                    value: "filament",
                                    label: "Filament Printers",
                                },
                                { value: "resin", label: "Resin Printers" },
                                { value: "powder", label: "Powder Printers" },
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
                        <TextArea rows={6} />
                    </Form.Item>
                </>
            ),
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleSubmit = async () => {
        next();
        /*try {
            const newIssue = {
                type: type,
                description: description,
            };
                    makeAnnouncement();

        } catch (error) {
            console.error("issue submitting an issue:", error);
        }*/

        setType("");
        setDescription("");
        setEquipmentID("");
    };

    const makeAnnouncement = () => {};

    const refreshForm = () => {
        setCurrent(0);
    };

    return (
        <>
            {current >= steps.length ? (
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
                <>
                    <Steps current={current} items={items} />
                    <div>
                        <Form layout="vertical">{steps[current].content}</Form>
                    </div>
                    <div style={{ marginTop: 24 }}>
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={handleSubmit}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button
                                style={{ margin: "0 8px" }}
                                onClick={() => prev()}
                            >
                                Previous
                            </Button>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default IssueForm;
