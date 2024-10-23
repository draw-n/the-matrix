import React, { useState } from "react";

import { Button, Flex, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import ProfileDropdown from "../pages/profile/ProfileDropdown";
import NoAccess from "./NoAccess";
import NotFound from "./NotFound";
import { MenuOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

interface MenuItem {
    label: React.ReactNode;
    key: React.Key;
    access: string[];
    icon?: React.ReactNode;
    children?: MenuItem[];
}

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  };

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
    { key: "/equipment", label: "All Equipment", access: ["view", "edit", "admin"] },

    { key: "/directory", label: "User Directory", access: ["admin"] },
    {
        key: "/profile",
        label: "User Profile",
        access: ["view", "edit", "admin"],
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
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useAuth();
    const accessPages: MenuItem[] = allPages.filter((item) =>
        item.access.some((access) => user?.access == access)
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
            <Header className="shell-header">
                <Flex
                    style={{ width: "100%" }}
                    justify="space-between"
                    align="center"
                >
                    <Button
                        type="text"
                        icon={
                            <MenuOutlined />
                            /*collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )*/
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: "white",
                        }}
                    />
                    <h1>DIGITAL FABRICATION LAB</h1>
                    <ProfileDropdown />
                </Flex>
            </Header>

            <Layout>
                <Sider
                    className="shell-sider"
                    breakpoint="lg"
                    collapsedWidth="0"
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <Menu
                        theme="dark"
                        className="shell-navbar"
                        selectedKeys={getSelectedKeys()}
                        defaultSelectedKeys={[location.pathname]}
                        mode="inline"
                        items={accessPages}
                        onClick={({ key }) => {
                            navigate(key);
                        }}
                    />
                </Sider>
                <Content style={{ margin: "16px" }}>
                    {contentAccess.includes(String(user?.access)) ||
                    user == null ? (
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
