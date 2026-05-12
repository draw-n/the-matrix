import { Card, Flex, theme } from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import AutoAvatar from "../../../components/common/AutoAvatar";
import UserForm from "../../../components/forms/UserForm";
import { WithUser } from "../../../types/user";

const HeaderCard: React.FC<WithUser> = ({ user }) => {
    const { user: currentUser } = useAuth();
    const colorPrimary = theme.useToken().token.colorPrimary;
    return (
        <Card style={{ backgroundColor: colorPrimary, color: "white" }}>
            <Flex gap="large" justify="space-between">
                <Flex align="center" gap="large">
                    <AutoAvatar
                        src={
                            user?.imageName
                                ? `${import.meta.env.VITE_BACKEND_URL}/images/users/${user.imageName}`
                                : undefined
                        }
                        size={64}
                        text={
                            (user?.firstName?.charAt(0) || "") +
                                (user?.lastName?.charAt(0) || "") || "?"
                        }
                    />

                    <Flex vertical>
                        <h1
                            style={{ color: "white" }}
                        >{`${user?.firstName} ${user?.lastName}`}</h1>
                        <p style={{ textTransform: "capitalize" }}>
                            {`${user?.access} • ${user?.status}`}
                        </p>
                    </Flex>
                </Flex>
                {(currentUser?.uuid === user?.uuid ||
                    currentUser?.access === "admin") && (
                    <UserForm user={user ? user : undefined} />
                )}
            </Flex>
        </Card>
    );
};

export default HeaderCard;
