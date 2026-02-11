import { Table, TableProps, Tag } from "antd";
import { useAllJobs } from "../../hooks/job";
import { WithEquipmentId } from "../../types/equipment";
import { Job } from "../../types/job";
import { geekblueDark } from "@ant-design/colors";

const QueueSystem: React.FC<WithEquipmentId> = ({ equipmentId }) => {
    const { data: jobs } = useAllJobs(["queued", "printing"], equipmentId);
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

                // Find how many jobs above this one are 'printing'
                const printingOffset =
                    sortedJobs?.filter((j) => j.status === "printing").length ||
                    0;
                return index - printingOffset + 1;
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
                onRow={(record) => ({
                    style: {
                        borderRadius: "5px",
                        backgroundColor:
                            record.status === "printing"
                                ? geekblueDark[5]
                                : undefined,
                        color: record.status === "printing" ? "white" : undefined,
                        cursor: "default",
                        
                    },
                })}
            />
        </>
    );
};

export default QueueSystem;
