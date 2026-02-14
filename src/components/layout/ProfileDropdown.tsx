import { useAuth } from "../../contexts/AuthContext";
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

    const logOut = async () => {
        await logout();
        navigate("/login");
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: "Profile",
            icon: <UserOutlined />,
            onClick: () => navigate("/profile"), // Move onClick here
        },
        {
            key: "2",
            danger: true,
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: logOut, // Move onClick here
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
