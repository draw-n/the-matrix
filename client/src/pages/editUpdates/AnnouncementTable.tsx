import { Button, Space, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import EditModal from "./EditModal";
import type { User } from "../../hooks/AuthContext";
import type { Announcement } from "../../types/Announcement";

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
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/announcements/${_id}`
            );
            // Update the state to remove the deleted equipment
            setAnnouncements(
                announcements.filter((announcement) => announcement._id !== _id)
            );
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<Announcement[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/announcements`
                );

                const formattedData = responseUpdates.data.map((item) => ({
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
                const responseUsers = await axios.get<User[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/users`
                );
                const usersMap = responseUsers.data.reduce(
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
            render: (__, record) => {
                const { userInfo } = record;
                const { fullName, email } = userInfo || {
                    fullName: "",
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
                        <EditModal
                            onUpdate={() => setRefresh(refresh + 1)}
                            announcement={announcement}
                        />
                        {/*<Button>Archive</Button> */}
                        <Button
                        className="secondary-button-outlined"
                            onClick={() => deleteAnnouncement(announcement._id)}
                        >
                            Delete
                        </Button>
                    </Space>
                ),
        },
    ];
    const numRows = 5;
    /*
    const emptyUpdate: Update = {
        _id: "",
        createdBy: "",
        dateCreated: new Date(0),
        type: "",
        description: "",
        key: -1,
        // other properties with default values...
    };*/

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

    /*const fillInData = [
        ...finalData,
        ...Array.from(
            { length: numRows - (updates.length % numRows) },
            (_, index) => ({ ...emptyUpdate, key: `empty-${index}` })
        ),
    ];*/
    return (
        <>
            <Table
                pagination={{
                    pageSize: numRows, // Set the number of rows per page
                }}
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
