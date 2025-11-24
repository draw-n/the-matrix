import { useAuth } from "../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

import { Dropdown, Button, MenuProps, Flex } from "antd";
import {
    CaretDownFilled,
    LogoutOutlined,
    MoonFilled,
    SunFilled,
    UserOutlined,
} from "@ant-design/icons";

interface ProfileDropdownProps {
    toggleTheme?: () => void;
    theme?: "light" | "dark";
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
    toggleTheme,
    theme,
}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const logOut = () => {
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
            <Button
                size="middle"
                onClick={toggleTheme}
                variant="outlined"
                shape="circle"
            >
                {theme == "light" ? <SunFilled /> : <MoonFilled />}
            </Button>

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
