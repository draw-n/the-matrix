import { geekblueDark } from "@ant-design/colors";
import { Flex, Table, TableProps, Tag } from "antd";
import { WithJobs } from "../../types/job";
import { formatTime } from "../../types/common";

const JobTable: React.FC<WithJobs> = ({ jobs }) => {
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
                        {`${formatTime(record.estimatedTimeSeconds || 0).h}h ${formatTime(record.estimatedTimeSeconds || 0).m}m ${formatTime(record.estimatedTimeSeconds || 0).s}s • ${Math.round(record.filamentUsedGrams || 0)}g`}
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
                    <Flex justify="end" gap="small">
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
                        {record.finishedAt && (
                            <span style={{ color: "#a9a9a9" }}>
                                {new Date(
                                    record.finishedAt,
                                ).toLocaleDateString()}
                            </span>
                        )}
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
                dataSource={jobs}
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
