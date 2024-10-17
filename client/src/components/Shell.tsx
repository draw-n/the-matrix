import React, { useState } from "react";

import { Flex, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import ProfileDropdown from "../pages/profile/ProfileDropdown";
import NoAccess from "./NoAccess";
import { IconEdit } from "@tabler/icons-react";

const { Header, Content, Sider } = Layout;

interface MenuItem {
    label: React.ReactNode;
    key: React.Key;
    access: string[];
    icon?: React.ReactNode;
    children?: MenuItem[];
}

const allPages: MenuItem[] = [
    { key: "/", label: "Announcements", access: ["view", "edit", "admin"] },

    {
        key: "/report",
        label: "Report an Issue",
        access: ["view", "edit", "admin"],
    },
    {
        key: "/edit",
        label: "Edit Updates",
        access: ["edit", "admin"],
    },
    { key: "/equipment", label: "Manage Equipment", access: ["admin"] },

    { key: "/directory", label: "User Directory", access: ["admin"] },
    {
        key: "/profile",
        label: "User Profile",
        access: ["view", "edit", "admin"],
    },
];

interface ShellProps {
    children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }: ShellProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useAuth();
    const accessPages: MenuItem[] = allPages.filter((item) =>
        item.access.some((access) => user?.access == access)
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header className="shell-header">
                <Flex
                    style={{ width: "100%" }}
                    justify="space-between"
                    align="center"
                >
                    <h1>DIGITAL FABRICATION LAB</h1>
                    <ProfileDropdown />
                </Flex>
            </Header>

            <Layout>
                <Sider
                    className="shell-sider"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <Menu
                        theme="dark"
                        className="shell-navbar"
                        selectedKeys={[location.pathname]}
                        defaultSelectedKeys={[location.pathname]}
                        mode="inline"
                        items={accessPages}
                        onClick={({ key }) => {
                            navigate(key);
                        }}
                    />
                </Sider>
                <Content style={{ margin: "16px" }}>
                    {allPages
                        .find((item) => item.key == location.pathname)
                        ?.access.includes(String(user?.access)) ? (
                        <>{children}</>
                    ) : (
                        <NoAccess />
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Shell;
