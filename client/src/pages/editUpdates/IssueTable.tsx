import { Button, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import EditModal from "./EditModal";
import { Update } from "vite/types/hmrPayload.js";

interface Issue {
    equipment: { name: string; type: string };
    status: string;
    description: string;
    createdBy: string;
    dateCreated: Date;
    assignedTo: string;
}

interface IssueTableProps {
    refresh: number;
    setRefresh: (numValue: number) => void;
}

const IssueTable: React.FC<IssueTableProps> = ({
    refresh,
    setRefresh,
}: IssueTableProps) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<Issue[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/issues`
                );
                setIssues(responseUpdates.data);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        fetchData();
    }, [refresh]);

    const issueColumns: TableProps<Issue>["columns"] = [
        {
            title: "Equipment",
            dataIndex: "equipment",
            key: "equipment",
            render: (equipment) => <p>{equipment.name}</p>,
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
            render: (text) => <p>{text}</p>,
        },
        {
            title: "Date Created",
            dataIndex: "dateCreated",
            key: "dateCreated",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (desc) => <p>{desc}</p>,
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (type) => (
                <Tag color={"blue"} key={type}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "action",
            render: (_, { status }) => <Button>Delete</Button>,
        },
    ];
    return (
        <>
            <Table<Issue> columns={issueColumns} dataSource={issues} />
        </>
    );
};

export default IssueTable;
