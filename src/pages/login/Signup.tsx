// Description: Signup page for new users
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Form, FormProps, Input, message } from "antd";

import AuthenticationShell from "./components/AuthenticationShell";

interface FieldType {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    accessCode: string;
}

const Signup: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                values,
            );
            login(values.email, values.password);
            navigate("/first-time");
        } catch (error: any) {
            message.error(
                String(error.response?.data?.message || "Unknown Error."),
            );
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/first-time");
        }
    });

    return (
        <AuthenticationShell>
            <h1 style={{ textAlign: "center" }}>SIGNUP</h1>

            <Form
                style={{ width: "100%" }}
                layout="vertical"
                autoComplete="off"
                preserve={false}
                onFinish={onFinish}
            >
                <Flex gap="20px">
                    <Form.Item<FieldType>
                        style={{ width: "50%", textTransform: "capitalize" }}
                        label="First Name"
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: "Please add your first name.",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        style={{ width: "50%" }}
                        label="Last Name"
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: "Please add your last name.",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Flex>

                <Form.Item<FieldType>
                    label="Vanderbilt Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please enter your Vanderbilt email address.",
                        },
                        {
                            pattern: /^[a-zA-Z0-9._%+-]+@vanderbilt\.edu$/i,
                            message:
                                "Please enter a valid Vanderbilt email address!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please add your password.",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Access Code"
                    name="accessCode"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please add the access code provided in the Digital Fabrication Lab.",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button
                        className="primary-button-filled"
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            <p style={{ textAlign: "center" }}>
                Already a user?{"  "}
                <a onClick={() => navigate("/login")}>Login</a>
            </p>
        </AuthenticationShell>
    );
};

export default Signup;
