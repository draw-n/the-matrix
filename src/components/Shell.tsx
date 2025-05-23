import React, { useState } from "react";

import { Button, Flex, Image, Layout, Menu, Skeleton } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import ProfileDropdown from "../pages/profile/ProfileDropdown";
import NoAccess from "./rbac/NoAccess";
import NotFound from "./NotFound";
import {
    MenuOutlined,
    CloseOutlined,
    HomeFilled,
    UsbFilled,
    UserOutlined,
    FileExclamationOutlined,
    EditOutlined,
    SettingOutlined,
    DesktopOutlined,
    TeamOutlined,
} from "@ant-design/icons";

import vandyLogoSmall from "../assets/White_Pinstripe_V.png";
import { checkAccess } from "./rbac/HasAccess";

const { Header, Content, Sider } = Layout;

interface MenuItem {
    label: React.ReactNode;
    key: React.Key;
    access: string[];
    icon?: React.ReactNode;
    children?: MenuItem[];
}

const allPages: MenuItem[] = [
    {
        key: "/",
        label: "Dashboard",
        access: ["novice", "proficient", "expert", "moderator", "admin"],
        icon: <HomeFilled />,
    },
    {
        key: "/report",
        label: "Report an Issue",
        access: ["novice", "proficient", "expert", "moderator", "admin"],
        icon: <FileExclamationOutlined />,
    },
    {
        key: "/edit",
        label: "Edit Updates",
        access: ["moderator", "admin"],
        icon: <EditOutlined />,
    },
    {
        key: "/upload",
        label: "Remote Print",
        access: ["novice", "proficient", "expert", "moderator", "admin"],
        icon: <UsbFilled />,
    },
    {
        key: "/makerspace",
        label: "Makerspace",
        access: ["novice", "proficient", "expert", "moderator", "admin"],
        icon: <DesktopOutlined />,
    },

    {
        key: "/directory",
        label: "User Directory",
        access: ["admin"],
        icon: <TeamOutlined />,
    },
    {
        key: "/profile",
        label: "User Profile",
        access: ["novice", "proficient", "expert", "moderator", "admin"],
        icon: <UserOutlined />,
    },

    {
        key: "/settings",
        label: "Settings",
        access: ["admin"],
        icon: <SettingOutlined />,
    },
];

interface ShellProps {
    children?: React.ReactNode;
    contentAccess: string[];
}

const Shell: React.FC<ShellProps> = ({
    children,
    contentAccess,
}: ShellProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const accessPages: MenuItem[] = allPages.filter((item) =>
        checkAccess(item.access)
    );

    const getSelectedKeys = (): string[] => {
        const currentPath = location.pathname;

        // Get keys that match the beginning of the current path
        let selectedPages = accessPages
            .filter((item) => currentPath.startsWith(String(item.key)))
            .map((item) => item.key as string); // Ensure the key is treated as a string
        if (selectedPages.length > 1) {
            selectedPages = selectedPages.filter((item) => item !== "/");
        }
        return selectedPages;
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                breakpoint="lg"
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="shell-sider"
            >
                <Flex justify="center" style={{ padding: "20px" }}>
                    <Image style={{ width: 50 }} src={vandyLogoSmall} />
                </Flex>

                <Menu
                    theme="dark"
                    selectedKeys={getSelectedKeys()}
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"
                    items={accessPages}
                    onClick={({ key }) => {
                        navigate(key);
                    }}
                />
            </Sider>
            <Layout>
                <Header>
                    <Flex
                        style={{ width: "100%", height: "100%" }}
                        justify="space-between"
                        align="center"
                    >
                        <Button
                            style={{ color: "white" }}
                            type="text"
                            icon={
                                collapsed ? <MenuOutlined /> : <CloseOutlined />
                            }
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <ProfileDropdown />
                    </Flex>
                </Header>
                <Content>
                    <div style={{ padding: "25px 50px" }}>
                        {user &&
                            (checkAccess(contentAccess) ? (
                                children
                            ) : (
                                <NoAccess />
                            ))}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Shell;
