import {
    Dropdown,
    Tooltip,
    Button,
    MenuProps,
    Flex,
    Avatar,
    Badge,
} from "antd";
import React from "react";
import {
    BellFilled,
    BellOutlined,
    CaretDownFilled,
    LogoutOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/AuthContext";

const ProfileDropdown: React.FC = () => {
    const { user, logout } = useAuth();

    const logOut = () => {
        logout();
        window.location.href = "/login";
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <Flex
                    style={{ width: "100%" }}
                    justify="space-between"
                    gap="10px"
                    align="center"
                    onClick={() => (window.location.href = "/profile")}
                >
                    Profile
                </Flex>
            ),
            icon: <UserOutlined />,
        },
        {
            key: "2",
            danger: true,
            label: (
                <Flex
                    style={{ width: "100%" }}
                    justify="space-between"
                    gap="10px"
                    align="center"
                    onClick={logOut}
                >
                    Logout
                </Flex>
            ),
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <Flex align="center" gap="middle">
            <Badge count={5}>
                <Button size="middle" variant="outlined" shape="circle">
                    <BellFilled />
                </Button>
            </Badge>

            <Dropdown
                arrow
                menu={{ items }}
                placement="bottomRight"
                trigger={["click"]}
            >
                <Button
                    variant="outlined"
                    size="middle"
                    shape="round"
                    iconPosition="end"
                    icon={<CaretDownFilled style={{ marginLeft: "10px" }} />}
                >
                    {user?.firstName + " " + user?.lastName}
                </Button>
            </Dropdown>
        </Flex>
    );
};

export default ProfileDropdown;
