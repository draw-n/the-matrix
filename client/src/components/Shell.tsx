import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";

import React, { useState } from "react";

import type { MenuProps } from "antd";
import { Button, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../hooks/AuthContext";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem("Announcements", "/", <PieChartOutlined />),
    getItem("History Log", "/history"),
    getItem("Report an Issue", "/report", <DesktopOutlined />),
];

const adminItems: MenuItem[] = [
    getItem("Announcements", "/", <PieChartOutlined />),
    getItem("Edit Updates", "/edit"),
    getItem("History Log", "/history"),
    getItem("Report an Issue", "/report", <DesktopOutlined />),
    getItem("User Directory", "/directory"),
];

interface ShellProps {
    children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }: ShellProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();

    const logOut = () => {
        googleLogout();
        logout();
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ color: "white" }}>
                <h1>DIGITAL FABRICATION LAB</h1>
            </Header>

            <Layout>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        selectedKeys={[location.pathname]}
                        defaultSelectedKeys={[location.pathname]}
                        mode="inline"
                        items={user?.access == "admin" ? adminItems : items}
                        onClick={({ key }) => {
                            navigate(key);
                        }}
                    />
                    <Button style={{ width: "100%" }} onClick={logOut}>
                        Log Out
                    </Button>
                </Sider>
                <Content style={{ margin: "16px" }}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default Shell;
