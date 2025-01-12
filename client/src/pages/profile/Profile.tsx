import { Alert, Space } from "antd";
import { useAuth } from "../../hooks/AuthContext";

const Profile: React.FC = () => {
    const { user } = useAuth();
    return (
        <>
            <Space direction="vertical" size="middle">
                <h1>PROFILE</h1>
                <Alert
                    message="To have your access role or personal details changed, contact Dr. David Florian by email."
                    type="info"
                />

                <Space>
                    <p>First Name: {user?.firstName}</p>
                    <p>Last Name: {user?.lastName}</p>
                    <p>Email: {user?.email}</p>
                    <p>Access: {user?.access}</p>
                </Space>
            </Space>
        </>
    );
};

export default Profile;
