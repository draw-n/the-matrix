import { Button, Space, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import EditModal from "./EditModal";

interface Update {
    _id: string;
    createdBy: string;
    dateCreated: Date;
    type: string;
    description: string;
}

interface AnnouncementTableProps {
    refresh: number;
    setRefresh: (numValue: number) => void;
}

const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
    refresh,
    setRefresh,
}: AnnouncementTableProps) => {
    const [updates, setUpdates] = useState<Update[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<Update[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/updates`
                );
                setUpdates(responseUpdates.data);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        fetchData();
    }, [refresh]);

    const updateColumns: TableProps<Update>["columns"] = [
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
            render: (dateCreated) => (
                <p>{new Date(dateCreated).toLocaleString()}</p>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => <p>{text}</p>,
        },
        {
            title: "Type",
            key: "type",
            dataIndex: "type",
            render: (type) => (
                <Tag color={"blue"} key={type}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, update) => (
                <Space>
                    <EditModal
                        onUpdate={() => setRefresh(refresh + 1)}
                        defaultDescription={update.description}
                        defaultType={update.type}
                        id={update._id}
                        createdBy={update.createdBy}
                        dateCreated={update.dateCreated}
                    />
                    <Button>Archive</Button>
                    <Button>Delete</Button>
                </Space>
            ),
        },
    ];
    return (
        <>
            <Table<Update>
                pagination={{
                    pageSize: 5, // Set the number of rows per page
                }}
                columns={updateColumns}
                dataSource={updates}
            />
        </>
    );
};

export default AnnouncementTable;
