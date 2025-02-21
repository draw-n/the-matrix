import {
    Button,
    Flex,
    Popconfirm,
    Table,
    TableProps,
    Tag,
    Tooltip,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Issue } from "../../types/Issue";
import { Equipment } from "../../types/Equipment";
import { useNavigate } from "react-router-dom";
import { User } from "../../hooks/AuthContext";
import { DeleteOutlined, FolderOutlined } from "@ant-design/icons";

interface TableIssue extends Issue {
    key: string;
}

interface UserInfo {
    fullName: string;
    email: string;
}

interface EquipmentInfo {
    routePath: string;
    name: string;
    type: string;
}

interface IssueTableProps {
    equipmentFilter?: string;
    refresh: number;
    setRefresh: (numValue: number) => void;
}

const IssueTable: React.FC<IssueTableProps> = ({
    equipmentFilter,
    refresh,
    setRefresh,
}: IssueTableProps) => {
    const [issues, setIssues] = useState<TableIssue[]>([]);
    const [users, setUsers] = useState<Record<string, UserInfo>>({});
    const [equipment, setEquipment] = useState<Record<string, EquipmentInfo>>(
        {}
    );

    const deleteIssue = async (_id: string) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/issues/${_id}`
            );
            setRefresh(refresh + 1);
        } catch (error) {
            console.error("Error deleting equipment:", error);
        }
    };

    const changeIssueStatus = async (issue: Issue, status: string) => {
        try {
            const editedIssue = { ...issue, status };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/issues/${issue._id}`,
                editedIssue
            );
            setRefresh(refresh + 1);
        } catch (error) {
            console.error("Issue archiving issue", error);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;

                if (equipmentFilter) {
                    response = await axios.get<Issue[]>(
                        `${
                            import.meta.env.VITE_BACKEND_URL
                        }/issues?status=open,in-progress,completed&equipment=${equipmentFilter}`
                    );
                } else {
                    response = await axios.get<Issue[]>(
                        `${
                            import.meta.env.VITE_BACKEND_URL
                        }/issues?status=open,in-progress,completed`
                    );
                }

                let formattedData = response.data.map((item) => ({
                    ...item,
                    key: item._id, // or item.id if you have a unique identifier
                }));

                setIssues(formattedData);
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
        const fetchEquipmentData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                const equipmentMap = response.data.reduce(
                    (
                        acc: Record<string, EquipmentInfo>,
                        equipment: Equipment
                    ) => {
                        acc[equipment._id] = {
                            name: equipment.name,
                            routePath: equipment.routePath,
                            type: equipment.category,
                        };
                        return acc;
                    },
                    {}
                );

                setEquipment(equipmentMap);
            } catch (error) {
                console.error("importing equipment failed:", error);
            }
        };
        fetchEquipmentData();
        fetchUserData();
        fetchData();
    }, [refresh]);

    const issueColumns: TableProps["columns"] = [
        {
            title: "Equipment",
            dataIndex: "equipment",
            key: "equipment",

            render: (__, record) => {
                const { equipmentInfo } = record;
                const { name, type, routePath } = equipmentInfo || {
                    name: "",
                    type: "",
                    routePath: "",
                };
                return (
                    <a onClick={() => navigate(`/makerspace/${routePath}`)}>
                        {name}
                    </a>
                );
            },
        },
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
            title: "Status",
            key: "status",
            dataIndex: "status",
            filters: [
                {
                    text: "Open",
                    value: "open",
                },
                {
                    text: "In Progress",
                    value: "in progress",
                },
                {
                    text: "Completed",
                    value: "completed",
                },
            ],
            onFilter: (value, record) =>
                record.status.indexOf(value as string) === 0,
            render: (type) => (
                <Tag color={"blue"} key={type}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "action",
            render: (item: Issue) => (
                <Flex gap="small">
                    <Tooltip title="Archive">
                        <Button
                            icon={<FolderOutlined />}
                            onClick={() => changeIssueStatus(item, "archived")}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete Issue"
                            description="Are you sure to delete this issue?"
                            onConfirm={() => deleteIssue(item._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    const numRows = 5;

    const finalData = issues.map((row) => {
        const userInfo = users[row.createdBy] || {
            fullName: "Loading...",
            email: "Loading...",
        };
        const equipmentInfo = equipment[row.equipment] || {
            name: "Loading...",
            type: "Loading...",
            routePath: "Loading...",
        };
        return {
            ...row,
            userInfo,
            equipmentInfo,
        };
    });
    return (
        <>
            <Table
                pagination={{
                    pageSize: numRows, // Set the number of rows per page
                }}
                columns={issueColumns}
                dataSource={finalData}
                expandable={{
                    expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                    ),
                    rowExpandable: (record) => record.description.length > 0,
                }}
                size="middle"
            />
        </>
    );
};

export default IssueTable;
