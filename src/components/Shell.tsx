import React, { useState } from "react";

import {
    Button,
    Divider,
    Flex,
    Image,
    Layout,
    Menu,
    theme,
    Typography,
    MenuProps,
} from "antd";
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

const { Title } = Typography;
const { Header, Content, Sider } = Layout;

// Custom type for your page definitions (with access)
interface PageItem {
    label: React.ReactNode;
    key: React.Key;
    access: string[];
    type?: string;
    icon?: React.ReactNode;
    children?: PageItem[];
}

const allPages: PageItem[] = [
    {
        key: "general",
        label: "GENERAL",
        access: ["novice", "proficient", "expert", "moderator", "admin"],
        type: "group",
        children: [
            {
                key: "/",
                label: "Dashboard",
                access: [
                    "novice",
                    "proficient",
                    "expert",
                    "moderator",
                    "admin",
                ],
                icon: <HomeFilled />,
            },
            {
                key: "/profile",
                label: "User Profile",
                access: [
                    "novice",
                    "proficient",
                    "expert",
                    "moderator",
                    "admin",
                ],
                icon: <UserOutlined />,
            },
        ],
    },
    {
        key: "hub",
        label: "HUB",
        access: ["novice", "proficient", "expert", "moderator", "admin"],
        type: "group",
        children: [
            {
                key: "/makerspace",
                label: "Makerspace",
                access: [
                    "novice",
                    "proficient",
                    "expert",
                    "moderator",
                    "admin",
                ],
                icon: <DesktopOutlined />,
            },
            {
                key: "/report",
                label: "Report an Issue",
                access: [
                    "novice",
                    "proficient",
                    "expert",
                    "moderator",
                    "admin",
                ],
                icon: <FileExclamationOutlined />,
            },
            {
                key: "/upload",
                label: "Remote Print",
                access: [
                    "novice",
                    "proficient",
                    "expert",
                    "moderator",
                    "admin",
                ],
                icon: <UsbFilled />,
            },
        ],
    },
    {
        key: "admin",
        label: "ADMIN",
        access: ["moderator", "admin"],
        type: "group",
        children: [
            {
                key: "/edit",
                label: "Edit Updates",
                access: ["moderator", "admin"],
                icon: <EditOutlined />,
            },

            {
                key: "/directory",
                label: "User Directory",
                access: ["admin"],
                icon: <TeamOutlined />,
            },

            {
                key: "/settings",
                label: "Settings",
                access: ["admin"],
                icon: <SettingOutlined />,
            },
        ],
    },
];

interface ShellProps {
    children?: React.ReactNode;
    contentAccess: string[];
    title?: string;
}

const Shell: React.FC<ShellProps> = ({
    children,
    contentAccess,
    title,
}: ShellProps) => {
    const location = useLocation();
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const navigate = useNavigate()
    const { colorPrimary } = theme.useToken().token;
    const menuItems: MenuProps["items"] = allPages
        .filter((item) => checkAccess(item.access))
        .map((item) => {
            if (item.type === "group" && item.children) {
                return {
                    type: "group",
                    label: item.label,
                    key: item.key,
                    children: item.children
                        .filter((child) => checkAccess(child.access))
                        .map((child) => ({
                            key: child.key,
                            label: child.label,
                            icon: child.icon,
                        })),
                };
            }
            return {
                key: item.key,
                label: item.label,
                icon: item.icon,
            };
        });

    const getSelectedKeys = (): string[] => {
        const currentPath = location.pathname;

        // Flatten all menu items to get all leaf keys
        const flattenMenuItems = (items: MenuProps["items"] = []): string[] => {
            return items.flatMap((item) => {
                if (!item) return [];
                if ("children" in item && Array.isArray(item.children)) {
                    return flattenMenuItems(item.children);
                }
                return typeof item.key === "string" ? [item.key] : [];
            });
        };

        const allKeys = flattenMenuItems(menuItems);

        // Find the key(s) that match the current path
        let selectedPages = allKeys.filter((key) =>
            currentPath.startsWith(key)
        );
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
                theme="light"
            >
                <Flex justify="center" style={{ padding: "20px" }}>
                    <div
                        style={{
                            borderRadius: "1000px",
                            backgroundColor: colorPrimary,
                            padding: "7px",
                        }}
                    >
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                objectFit: "contain",
                            }}
                            src={vandyLogoSmall}
                        />
                    </div>
                </Flex>
                <Flex justify="center" style={{ padding: "0 20px" }}>
                    <Divider style={{ margin: "auto" }} />
                </Flex>
                <Menu
                    theme="light"
                    selectedKeys={getSelectedKeys()}
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"
                    items={menuItems}
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
                        <Flex gap="small" align="center">
                            <Button
                                type="text"
                                icon={
                                    collapsed ? (
                                        <MenuOutlined />
                                    ) : (
                                        <CloseOutlined />
                                    )
                                }
                                onClick={() => setCollapsed(!collapsed)}
                            />
                            {title && <Title level={1}>{title}</Title>}
                        </Flex>

                        <ProfileDropdown />
                    </Flex>
                </Header>
                <Content>
                    <div style={{ padding: "30px 50px" }}>
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
