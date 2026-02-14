// Description: Login page for users

import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Button, Form, FormProps, Input, message } from "antd";

import AuthenticationShell from "./components/AuthenticationShell";

interface FieldType {
    email: string;
    accessCode: string;
    password: string;
}

const Login: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            await login(values.email, values.password);
        } catch (error: any) {
            if (error?.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error("Login failed. Please check your credentials.");
            }
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user]);

    return (
        <AuthenticationShell>
            <h1 style={{ textAlign: "center" }}>LOGIN</h1>
            <Form
                style={{ width: "100%" }}
                layout="vertical"
                autoComplete="off"
                preserve={false}
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Vanderbilt Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please type in your Vanderbilt University email address.",
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
                    style={{ width: "100%" }}
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
                <Form.Item>
                    <Button
                        htmlType="submit"
                        style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            width: "100%",
                        }}
                        type="primary"
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <p style={{ textAlign: "center" }}>
                First time user?{" "}
                <a onClick={() => navigate("/signup")}>Signup</a>
            </p>
        </AuthenticationShell>
    );
};

export default Login;
