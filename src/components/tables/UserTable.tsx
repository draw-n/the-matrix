// Description: A table component to display a list of users with their names and email addresses

import { Table, TableProps } from "antd";
import { useAllUsers } from "../../hooks/useUsers";

const UserTable: React.FC = () => {
    const { data: users } = useAllUsers(["admin", "moderator"]);

    const columns: TableProps["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (__, record) => {
                return <p>{`${record.firstName} ${record.lastName}`}</p>;
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (__, record) => {
                return <a href={`mailto:${record.email}`}>{record.email}</a>;
            },
        },
    ];
    const numRows = 5;
    return (
        <>
            <Table
                pagination={{
                    defaultPageSize: numRows,
                    hideOnSinglePage: true,
                }}
                columns={columns}
                dataSource={users}
                size="middle"
            />
        </>
    );
};

export default UserTable;
