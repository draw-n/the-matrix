import { Card, Table, TableProps, Tag } from "antd";
import { useAllJobs } from "../../hooks/job";
import { WithEquipmentId } from "../../types/equipment";
import { geekblueDark } from "@ant-design/colors";
import Title from "antd/es/typography/Title";

const QueueSystem: React.FC<WithEquipmentId> = ({ equipmentId }) => {
    const {
        data: jobs,
        isLoading,
        refetch,
    } = useAllJobs(["queued", "ready", "printing"], equipmentId);
    const sortedJobs = jobs?.sort((a, b) => {
        // 1. Define Priority (Lower number = higher priority)
        const priority = {
            printing: 0,
            ready: 1,
            queued: 2,
            completed: 3,
            failed: 4,
        };

        // 2. Handle status priority
        const statusDiff =
            (priority[a.status] ?? 99) - (priority[b.status] ?? 99);

        if (statusDiff !== 0) {
            return statusDiff;
        }

        // 3. Fallback to Date if status is the same
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateA - dateB;
    });

    const columns: TableProps["columns"] = [
        {
            title: "File Name",
            dataIndex: "gcodeFileName",
            key: "gcodeFileName",
        },
        {
            title: "Upload Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: Date) => new Date(date).toLocaleString(),
        },
        {
            title: "Position in Queue",
            dataIndex: "position",
            key: "position",
            render: (_: any, record, index: number) => {
                if (record.status === "printing") return <p>PRINTING</p>;
                if (record.status === "ready") return <p>READY</p>;
                // Find how many jobs above this one are 'printing'
                const printingOffset =
                    sortedJobs?.filter(
                        (j) => j.status === "printing" || j.status === "ready",
                    ).length || 0;
                return index - printingOffset + 1;
            },
        },
    ];

    const numRows = 5;
    return (
        <Card style={{ height: "100%" }}>
            <Title level={2}>PRINTING QUEUE</Title>
            {isLoading ? null : sortedJobs?.length === 0 ? (
                <Tag color="green" style={{ marginTop: "20px" }}>
                    No jobs in queue! Add a new print job to get started.
                </Tag>
            ) : (
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
                    onRow={(record) => ({
                        style: {
                            borderRadius: "5px",
                            backgroundColor:
                                record.status === "printing"
                                    ? geekblueDark[5]
                                    : undefined,
                            color:
                                record.status === "printing"
                                    ? "white"
                                    : undefined,
                            cursor: "default",
                        },
                    })}
                />
            )}
        </Card>
    );
};

export default QueueSystem;
