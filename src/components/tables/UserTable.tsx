import React, { useEffect, useState } from "react";
import { User } from "../../hooks/AuthContext";
import axios from "axios";
import { Table, TableProps } from "antd";

const UserTable: React.FC = () => {
    // Component code here
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<User[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/users?access=admin,moderator`
                );

                const formattedData = responseUpdates.data.map((item) => ({
                    ...item,
                    key: item._id,
                }));
                setUsers(formattedData);
            } catch (error) {
                console.error("Fetching users failed:", error);
            }
        };
        fetchData();
    }, []);

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
