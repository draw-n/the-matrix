import { Flex, Form, Input } from "antd";
import EditAccessCode from "./EditAccessCode";

const AccessCodes: React.FC = () => {
    const roles = ["novice", "proficient", "expert", "moderator"];
    return (
        <Flex vertical gap="small">
            {roles.map((role) => (
                <EditAccessCode role={role} initialEditMode={false} />
            ))}
        </Flex>
    );
};

export default AccessCodes;
