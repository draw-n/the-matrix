import { Alert, Space } from "antd";
import { useAuth } from "../../hooks/AuthContext";

const Profile: React.FC = () => {
    const { user } = useAuth();
    return (
        <>
            <h1>PROFILE</h1>
            <Alert
                message="To have your access changed, contact Dr. David Florian by email. All other profile information is tied to your Vanderbilt Google Account, so changes to those need to be requested to Vanderbilt University."
                type="info"
            />

            <Space>
                <p>First Name: {user?.firstName}</p>
                <p>Last Name: {user?.lastName}</p>
                <p>Email: {user?.email}</p>
                <p>Access: {user?.access}</p>
            </Space>
        </>
    );
};

export default Profile;
