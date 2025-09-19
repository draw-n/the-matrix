import {
    Button,
    DatePicker,
    Flex,
    Form,
    FormProps,
    Input,
    message,
    Select,
} from "antd";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";

interface FieldType {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const Signup: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [showGradDate, setShowGradDate] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                values
            );
            login(values.email, values.password);
            navigate(location.state?.from || "/");
        } catch (error: any) {
            message.error(
                String(error.response?.data?.message || "Unknown Error.")
            );
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
                        onFinish={onFinish}
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
                                        /^[a-zA-Z0-9._%+-]+@vanderbilt\.edu$/i,
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

                        <Flex justify="end">
                            <Form.Item label={null}>
                                <Button
                                    className="primary-button-filled"
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
