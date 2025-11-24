// Description: AdminCard component displaying a help section with a user table.
import { Card, Flex } from "antd";
import React from "react";
import UserTable from "../../components/tables/UserTable";

const AdminCard: React.FC = () => {
    return (
        <Card>
            <Flex vertical gap="middle">
                <h2>Need help?</h2>
                <UserTable />
            </Flex>
        </Card>
    );
};

export default AdminCard;
