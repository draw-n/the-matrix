import { Button, Divider, Flex, Form, Input } from "antd";
import axios from "axios";
import { GoogleOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleRegisterUser = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                { email: email, password: password, firstName: firstName, lastName: lastName }
            );
            console.log(response.data);
            login(email, password);
            navigate(location.state?.from || "/");
        } catch (error) {
            console.error("Signup failed: ", error);
        }
    };

    useEffect(() => {
        if (user) {
            navigate(location.state?.from || "/");
        }
    });

    return (
        <>
            <Flex style={{ width: "100vw", height: "100vh" }}>
                <div className="login-background" style={{ width: "50%" }} />

                <Flex
                    gap="10px"
                    flex="1"
                    vertical
                    justify="center"
                    style={{ padding: "20px" }}
                >
                    <h1 style={{ textAlign: "center" }}>SIGNUP</h1>

                    <Form
                        style={{ width: "100%" }}
                        layout="vertical"
                        autoComplete="off"
                        preserve={false}
                    >
                        <Flex gap="10px">
                            <Form.Item
                                style={{ width: "50%" }}
                                label="First Name"
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please add your first name.",
                                    },
                                ]}
                            >
                                <Input
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </Form.Item>
                            <Form.Item
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
                                <Input
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Flex>

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
                        <Form.Item
                            style={{ width: "100%" }}
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
                            <Input />{" "}
                            {
                                // TODO: need to implement the access code logic
                            }
                        </Form.Item>
                    </Form>

                    <Button type="primary" onClick={handleRegisterUser}>
                        Submit
                    </Button>
                    <p style={{ textAlign: "center" }}>
                        Already a user?{" "}
                        <a onClick={() => navigate("/login")}>Login</a>
                    </p>
                </Flex>
            </Flex>
        </>
    );
};

export default Signup;
