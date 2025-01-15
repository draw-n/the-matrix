import { Button, Divider, Flex, Form, Input } from "antd";
import axios from "axios";
import { GoogleOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface FieldType {
    email: string;
    accessCode: string;
}

const Login: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            navigate(location.state?.from || "/");
        }
    });

    const handleLoginUser = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                { email, password }
            );
            login(email, password);
            navigate(location.state?.from || "/");
        } catch (error) {
            console.error("Login failed", error);
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
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please add your email.",
                                },
                            ]}
                        >
                            <Input onChange={(e) => setEmail(e.target.value)} />
                        </Form.Item>
                        <Form.Item
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
                            <Input.Password
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>
                    </Form>

                    <Button
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                        type="primary"
                        onClick={handleLoginUser}
                    >
                        Submit
                    </Button>
                    <p style={{ textAlign: "center" }}>
                        First time user?{" "}
                        <a onClick={() => navigate("/signup")}>Signup</a>
                    </p>
                </Flex>
            </Flex>
        </>
    );
};

export default Login;
