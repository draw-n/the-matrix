// Description: Login page for users

import { Button,Flex, Form, FormProps, Input, message } from "antd";
import { useAuth } from "../hooks/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface FieldType {
    email: string;
    accessCode: string;
    password: string;
}

const Login: React.FC = () => {
    const { user, login } = useAuth();
    const location = useLocation();
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
        <>
            <Flex style={{ width: "100vw", height: "100vh" }}>
                <div className="login-background" style={{ width: "50%" }} />

                <Flex
                    flex="1"
                    vertical
                    justify="center"
                    style={{ padding: "20px" }}
                >
                    <h1 style={{ textAlign: "center" }}>LOGIN</h1>

                    <Form
                        style={{ width: "100%" }}
                        layout="vertical"
                        autoComplete="off"
                        preserve={false}
                        onFinish={onFinish}
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please type in your Vanderbilt University email address.",
                                },
                                {
                                    pattern:
                                        /^[a-zA-Z0-9._%+-]+@vanderbilt\.edu$/i,
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
                                }}
                                type="primary"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>

                    <p style={{ textAlign: "center" }}>
                        First time user? <a onClick={() => navigate("/signup")}>Signup</a>
                    </p>
                </Flex>
            </Flex>
        </>
    );
};

export default Login;
