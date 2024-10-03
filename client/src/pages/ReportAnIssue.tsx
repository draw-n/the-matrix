import { Input, Button, Form, Flex } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

type FieldType = {
    issueDesc?: string;
};

const { TextArea } = Input;

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    
    console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

//TODO: only send defaulted values to announcements
const ReportAnIssue: React.FC = () => {
    return (
        <>
            <h1>REPORT AN ISSUE</h1>
            <Form
                name="basic"
                layout="vertical"
                style={{ width: "100%" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <p>
                    This form is NOT for class or personal usage. It is only to
                    report any equipment malfunction in the Digital Fabrication
                    Lab. For any other inquiries, please contact Dr. David
                    Florian directly.
                </p>
                <Flex justify="space-between">
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Please Describe in Detail"
                        name="issueDesc"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description to the problem.",
                            },
                        ]}
                    >
                        <TextArea rows={6} />
                    </Form.Item>
                </Flex>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ReportAnIssue;
