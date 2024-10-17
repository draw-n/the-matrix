import { Dropdown, Tooltip, Button, MenuProps, Flex } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { googleLogout } from "@react-oauth/google";
import { IconUser, IconLogout } from "@tabler/icons-react";

const ProfileDropdown: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const logOut = () => {
        googleLogout();
        logout();
        navigate("/login");
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
                    onClick={() => navigate("/profile")}
                >
                    <IconUser />
                    Profile
                </Flex>
            ),
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
                    <IconLogout />
                    Logout
                </Flex>
            ),
        },
    ];

    return (
        <Dropdown menu={{ items }} placement="bottomRight">
            <a onClick={(e) => e.preventDefault()}>
                {user?.firstName + " " + user?.lastName}
            </a>
        </Dropdown>
    );
};

export default ProfileDropdown;
