import { Table, TableProps } from "antd";
import { useAllJobs } from "../../hooks/job";
import { WithEquipmentId } from "../../types/equipment";

const QueueSystem: React.FC<WithEquipmentId> = ({ equipmentId }) => {
    const { data: jobs } = useAllJobs("queued", equipmentId);
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
            render: (_: any, __: any, index: number) => index + 1,
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
                dataSource={jobs}
                size="middle"
            />
        </>
    );
};

export default QueueSystem;
