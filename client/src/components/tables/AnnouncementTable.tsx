import {
    Button,
    message,
    Popconfirm,
    Space,
    Table,
    TableProps,
    Tag,
    Tooltip,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import EditAnnouncementForm from "../forms/EditAnnouncementForm";
import type { User } from "../../hooks/AuthContext";
import type { Announcement } from "../../types/Announcement";
import { DeleteOutlined, FolderOutlined } from "@ant-design/icons";

interface TableAnnouncement extends Announcement {
    key: string;
}

interface UserInfo {
    fullName: string;
    email: string;
}

interface AnnouncementTableProps {
    refresh: number;
    setRefresh: (numValue: number) => void;
}

const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
    refresh,
    setRefresh,
}: AnnouncementTableProps) => {
    const [announcements, setAnnouncements] = useState<TableAnnouncement[]>([]);
    const [users, setUsers] = useState<Record<string, UserInfo>>({});

    const deleteAnnouncement = async (_id: string) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/announcements/${_id}`
            );
            message.success(response.data.message);
            setRefresh(refresh + 1);
        } catch (error: any) {
            message.error(error.response?.data?.message || "Unknown Error.");
            console.error("Error deleting announcement:", error);
        }
    };

    const archiveAnnouncement = async (announcement: Announcement) => {
        try {
            const editedAnnouncement = { ...announcement, status: "archived" };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/announcements/${
                    announcement._id
                }`, //TODO: may remove this option
                editedAnnouncement
            );
            setRefresh(refresh + 1);
        } catch (error) {
            console.error("Issue archiving announcement", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Announcement[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/announcements?status=posted`
                );

                const formattedData = response.data.map((item) => ({
                    ...item,
                    key: item._id, // or item.id if you have a unique identifier
                }));
                setAnnouncements(formattedData);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get<User[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/users`
                );
                const usersMap = response.data.reduce(
                    (acc: Record<string, UserInfo>, user: User) => {
                        acc[user._id] = {
                            fullName: `${user.firstName} ${user.lastName}`,
                            email: user.email,
                        };
                        return acc;
                    },
                    {}
                );

                setUsers(usersMap);
            } catch (error) {
                console.error("importing users failed:", error);
            }
        };
        fetchUserData();
        fetchData();
    }, [refresh]);

    const updateColumns: TableProps["columns"] = [
        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
            sorter: {
                compare: (a, b) =>
                    a.userInfo.fullName.localeCompare(b.userInfo.fullName),
                multiple: 2,
            },
            render: (record) => {
                const userInfo = users[record];
                const { fullName, email } = userInfo || {
                    fullName: "Loading...",
                    email: "",
                };
                return <a href={`mailto:${email}`}>{fullName}</a>;
            },
        },
        {
            title: "Date Created",
            dataIndex: "dateCreated",
            key: "dateCreated",
            defaultSortOrder: "ascend",
            sorter: {
                compare: (a, b) =>
                    new Date(a.dateCreated).getTime() -
                    new Date(b.dateCreated).getTime(),
                multiple: 1,
            },
            render: (dateCreated) => (
                <p>
                    {new Date(dateCreated).getTime() == new Date(0).getTime()
                        ? ""
                        : new Date(dateCreated).toLocaleString()}
                </p>
            ),
        },

        {
            title: "Type",
            key: "type",
            dataIndex: "type",
            filters: [
                {
                    text: "Event",
                    value: "event",
                },
                {
                    text: "Classes",
                    value: "classes",
                },
                {
                    text: "Other",
                    value: "other",
                },
            ],
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value, record) =>
                record.type.indexOf(value as string) === 0,
            render: (type) =>
                type && (
                    <Tag color={"blue"} key={type}>
                        {type.toUpperCase()}
                    </Tag>
                ),
        },
        {
            title: "Action",
            key: "action",
            render: (announcement) =>
                announcement._id && (
                    <Space>
                        <EditAnnouncementForm
                            onUpdate={() => setRefresh(refresh + 1)}
                            announcement={announcement}
                        />
                        <Tooltip title="Archive">
                            <Button
                                icon={<FolderOutlined />}
                                onClick={() =>
                                    archiveAnnouncement(announcement)
                                }
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Delete Announcement"
                                description="Are you sure you want to delete this announcement?"
                                onConfirm={() =>
                                    deleteAnnouncement(announcement._id)
                                }
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                ),
        },
    ];

    const finalData = announcements.map((row) => {
        const userInfo = users[row.createdBy] || {
            fullName: "Loading...",
            email: "Loading...",
        };
        return {
            ...row,
            userInfo,
        };
    });

    return (
        <>
            <Table
                pagination={{ defaultPageSize: 5, hideOnSinglePage: true }}
                columns={updateColumns}
                dataSource={finalData}
                size="middle"
                expandable={{
                    expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                    ),
                    rowExpandable: (record) => record.description.length > 0,
                }}
            />
        </>
    );
};

export default AnnouncementTable;
