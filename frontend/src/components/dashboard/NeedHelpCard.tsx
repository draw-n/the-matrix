// Description: AdminCard component displaying a help section with a user table.
import { Card, Flex } from "antd";
import UserTable from "../tables/UserTable";

const NeedHelpCard: React.FC = () => {
    return (
        <Card style={{ height: "100%" }}>
            <Flex vertical gap="middle">
                <h2>Need help?</h2>
                <UserTable />
            </Flex>
        </Card>
    );
};

export default NeedHelpCard;
