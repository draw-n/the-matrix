import { Button, Checkbox, Divider, Flex, Form, Input, Switch } from "antd";
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
    remember: boolean;
}

const Signup: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [remember, setRemember] = useState(true);

    const handleRegisterUser = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                { email, password, firstName, lastName, accessCode }
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
                    gap="5px"
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
                        <Flex gap="20px">
                            <Form.Item<FieldType>
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
                                <Input
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Flex>

                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter your Vanderbilt email address.",
                                },
                                {
                                    pattern:
                                        /^[a-zA-Z0-9._%+-]+@vanderbilt\.edu$/,
                                    message:
                                        "Please enter a valid Vanderbilt email address!",
                                },
                            ]}
                        >
                            <Input onChange={(e) => setEmail(e.target.value)} />
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
                            <Input.Password
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
                            <Input
                                onChange={(e) => setAccessCode(e.target.value)}
                            />
                        </Form.Item>
                        <Flex
                            align="center"
                            style={{ width: "100%" }}
                            justify="space-between"
                        >
                            <Form.Item<FieldType>
                                name="remember"
                                valuePropName="checked"
                                label={null}
                            >
                                <Flex gap="20px">
                                    <p>Remember Me</p>

                                    <Switch
                                        value={remember}
                                        onChange={setRemember}
                                    />
                                </Flex>
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button
                                    className="primary-button-filled"
                                    onClick={handleRegisterUser}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Flex>
                    </Form>

                    <p style={{ textAlign: "center" }}>
                        Already a user?{"  "}
                        <a onClick={() => navigate("/login")}>Login</a>
                    </p>
                </Flex>
            </Flex>
        </>
    );
};

export default Signup;
