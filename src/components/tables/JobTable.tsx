import { geekblueDark } from "@ant-design/colors";
import { Flex, Table, TableProps, Tag } from "antd";
import { WithJobs } from "../../types/job";
import { formatTime } from "../../types/common";

const JobTable: React.FC<WithJobs> = ({ jobs }) => {
    const sortedJobs = jobs?.sort((a, b) => {
        const priority = {
            printing: 0,
            ready: 1,
            queued: 2,
            completed: 3,
            failed: 4,
        };
        const statusDiff =
            (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
        if (statusDiff !== 0) {
            return statusDiff;
        }
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
    });

    const columns: TableProps["columns"] = [
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
            render: (_: any, record, index: number) => {
                const displayIndex = index + 1;
                return (
                    <Flex justify="center">
                        <span style={{ color: "#a9a9a9" }}>{displayIndex}</span>
                    </Flex>
                );
            },
        },
        {
            title: "File Name",
            dataIndex: "gcodeFileName",
            key: "gcodeFileName",
            render: (text: string, record) => (
                <Flex vertical gap="small">
                    <span
                        style={{
                            color: geekblueDark[4],
                            fontWeight: "bold",
                        }}
                    >
                        {text}
                    </span>
                    <span style={{ color: "#a9a9a9" }}>
                        {`${formatTime(record.estimatedTimeSeconds || 0).h}h ${formatTime(record.estimatedTimeSeconds || 0).m}m ${formatTime(record.estimatedTimeSeconds || 0).s}s • ${Math.round(record.totalFilamentGrams || 0)}g`}
                    </span>
                </Flex>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_: any, record, index: number) => {
                return (
                    <Flex justify="end">
                        <Tag
                            color={
                                record.status === "completed"
                                    ? "green"
                                    : record.status === "failed"
                                      ? "red"
                                      : "default"
                            }
                        >
                            {record.status.toUpperCase()}
                        </Tag>
                    </Flex>
                );
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
                showHeader={false}
                dataSource={sortedJobs}
                size="middle"
                style={{
                    borderRadius: "5px",
                    borderCollapse: "separate",
                }}
                rowHoverable={false}
                onRow={() => ({
                    style: {
                        cursor: "default",
                    },
                })}
            />
        </>
    );
};

export default JobTable;
