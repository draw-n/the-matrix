// Description: Profile page component for displaying and editing user profile information.

import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Button,
    Card,
    Col,
    Descriptions,
    Flex,
    Input,
    message,
    Row,
    Space,
    Tabs,
    TabsProps,
    theme,
} from "antd";

import {
    ArrowRightOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { WithUser } from "../../types/user";
import RemotePrintCard from "../../components/dashboard/RemotePrintCard";
import TotalFilamentUsedCard from "../../components/dashboard/TotalFilamentUsedCard";
import { useEditUserById } from "../../hooks/useUsers";
import AutoAvatar from "../../components/common/AutoAvatar";
import PersonalInfoCard from "./components/PersonalInfoCard";
import QueueCard from "../../components/dashboard/QueueCard";
import UserForm from "../../components/forms/UserForm";
import ImageCard from "./components/ImageCard";
import HeaderCard from "./components/HeaderCard";

const Profile: React.FC<WithUser> = ({ user: propUser }) => {
    const { user: currentUser } = useAuth();
    const user = propUser || currentUser;
     const [activeKey, setActiveKey] = useState("general");

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");

        if (hash) {
            setActiveKey(hash);
        }
    }, []);

    const handleChange = (key: string) => {
        setActiveKey(key);

        window.history.replaceState(null, "", `#${key}`);
    };

    // const handleChangePassword = async () => {
    //     try {
    //         await axios.put(
    //             `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
    //             {
    //                 currentPassword,
    //                 newPassword,
    //             },
    //         );
    //         message.success("Password changed successfully.");
    //         setCurrentPassword("");
    //         setNewPassword("");
    //     } catch (error) {
    //         message.error("Can't change password at the moment.");
    //         console.error("Issue changing password", error);
    //     }
    // };

    const items: TabsProps["items"] = [
        {
            key: "general",
            label: "General",
            children: (
                <Row gutter={[16, 16]}>
                    {user?.imageName && (
                        <Col lg={6} span={24}>
                            <ImageCard
                                user={user ? user : undefined}
                                height={300}
                            />
                        </Col>
                    )}

                    <Col lg={18} span={24}>
                        <PersonalInfoCard user={user ? user : undefined} />
                    </Col>
                </Row>
            ),
        },
        {
            key: "activity",
            label: "Activity",
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <RemotePrintCard userId={user?.uuid} />
                    </Col>
                    <Col span={8}>
                        <TotalFilamentUsedCard userId={user?.uuid} />
                    </Col>
                    <Col span={24}>
                        <QueueCard userId={user?.uuid} editable={false} />
                    </Col>
                </Row>
            ),
        },
    ];

    return (
        <>
            <Space vertical size="middle" style={{ width: "100%" }}>
                <HeaderCard user={user ? user : undefined} />
                <Tabs
                    activeKey={activeKey}
                    onChange={handleChange}
                    items={items}
                />

                {/* <Card hidden={currentUser?.uuid !== user?.uuid}>
                    <Space style={{ width: "100%" }} vertical size="middle">
                        <h2>Change Password</h2>
                        <p>Current Password</p>
                        <Input.Password
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <p>New Password</p>
                        <Input.Password
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Flex justify="end" style={{ width: "100%" }}>
                            <Button
                                iconPlacement="end"
                                variant="filled"
                                type="primary"
                                icon={<ArrowRightOutlined />}
                                onClick={handleChangePassword}
                            >
                                Submit
                            </Button>
                        </Flex>
                    </Space>
                </Card> */}
            </Space>
        </>
    );
};

export default Profile;
