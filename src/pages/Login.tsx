import { Button, Divider, Flex, Form, FormProps, Input, message } from "antd";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { useLocation } from "react-router-dom";

interface FieldType {
    email: string;
    accessCode: string;
    password: string;
}

const Login: React.FC = () => {
    const { user, login } = useAuth();
    const location = useLocation();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                values
            );
            login(values.email, values.password);
            window.location.href = location.state?.from || "/";
        } catch (error: any) {
            message.error(
                String(error.response?.data?.message || "Unknown Error.")
            );
        }
    };

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
                        First time user?{" "}
                        <a href="/signup">Signup</a>
                    </p>
                </Flex>
            </Flex>
        </>
    );
};

export default Login;
