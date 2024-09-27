import {
    DesktopOutlined,
    PieChartOutlined,
} from "@ant-design/icons";

import React, { useState } from "react";

import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

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
];

interface ShellProps {
    children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }: ShellProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Layout style={{ minHeight: "100vh" }}>
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
                    items={(true) ? adminItems: items}
                    onClick={({ key }) => {
                        navigate(key);
                    }}
                />
            </Sider>
            <Layout>
                <Header style={{ color: "white" }}>
                    Digital Fabrication Lab
                </Header>
                <Content style={{ margin: "16px" }}>{children}</Content>
                <Footer style={{ textAlign: "center" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Shell;
