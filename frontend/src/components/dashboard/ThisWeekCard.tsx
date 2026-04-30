import { Card, Flex, Table, TableProps, Tag } from "antd";

const ThisWeekCard: React.FC = () => {

     const columns: TableProps["columns"] = [
        {
            title: "Sunday",
            dataIndex: "sunday",
            key: "sunday",
            render: (__, record) => {
                return (
                    <Flex gap="small" align="center" wrap>
                       
                        <Flex vertical>
                            <Flex gap="small">
                                <p style={{ textTransform: "capitalize" }}>
                                    {`${record.firstName} ${record.lastName}`}
                                </p>
                                {record.departments &&
                                    record.departments.map((dept: string) => (
                                        <Tag key={dept}>
                                            {dept.replace(".", "")}
                                        </Tag>
                                    ))}
                            </Flex>
                            <p
                                style={{
                                    textTransform: "capitalize",
                                    color: "#a9a9a9",
                                    fontSize: "0.85em",
                                }}
                            >
                                {`${record.access} • ${record.status}`}
                            </p>
                        </Flex>
                    </Flex>
                );
            },
        },
       
    ];
    return (
        <Card style={{ height: "100%" }}>
            <Flex vertical gap="middle">
                <h2>This Week</h2>
                <Table />
            </Flex>
        </Card>
    );
};

export default ThisWeekCard;
