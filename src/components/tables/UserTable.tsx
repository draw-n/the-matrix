// Description: A table component to display a list of users with their names and email addresses

import { Button, Flex, Table, TableProps } from "antd";
import { useAllUsers } from "../../hooks/useUsers";
import AutoAvatar from "../common/AutoAvatar";
import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";

const UserTable: React.FC = () => {
    const { data: users } = useAllUsers(["admin", "moderator"]);

    const columns: TableProps["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (__, record) => {
                return (
                    <Flex gap="small" align="center" wrap>
                        <AutoAvatar
                            text={
                                `${record.firstName?.charAt(0) || ""}${record.lastName?.charAt(0) || ""}` ||
                                "?"
                            }
                        />
                        <Flex vertical>
                             <p
                            style={{ textTransform: "capitalize" }}
                        >{`${record.firstName} ${record.lastName}`}</p>
                            <p style={{textTransform: "capitalize", color: "#a9a9a9", fontSize: "0.85em" }}>
                               {`${record.access} • ${record.status}`}
                            </p>
                            </Flex>
                       
                    </Flex>
                );
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (__, record) => {
                return (
                    <Flex justify="end">
                        <Button
                            icon={<MailOutlined />}
                            type="link"
                            style={{ color: "#a9a9a9"}}
                            href={`mailto:${record.email}`}
                        />
                    </Flex>
                );
                
            },
        },
    ];
    const numRows = 5;
    return (
        <>
            <Table
                style={{ height: "100%", border: "none" }}
                pagination={{
                    defaultPageSize: numRows,
                    hideOnSinglePage: true,
                }}
                bordered={false}
                showHeader={false}
                columns={columns}
                dataSource={users}
                size="middle"
            />
        </>
    );
};

export default UserTable;
