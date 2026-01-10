// Description: A table component to display and manage issues reported by users

import axios from "axios";
import { useEffect, useState } from "react";

import {
    Button,
    Flex,
    message,
    Popconfirm,
    Table,
    TableProps,
    Tag,
    Tooltip,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import AutoAvatar from "../AutoAvatar";
import { geekblue, gold, green, red } from "@ant-design/colors";
import { useNavigate } from "react-router-dom";

import type { Issue } from "../../types/issue";
import type { Equipment } from "../../types/equipment";
import type { User } from "../../types/user";
import { checkAccess } from "../rbac/HasAccess";

import EditIssueForm from "../forms/EditIssueForm";

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
    refreshTable: () => void;
    issues?: Issue[];
}

const IssueTable: React.FC<IssueTableProps> = ({
    refreshTable,
    issues,
}: IssueTableProps) => {
    const [users, setUsers] = useState<Record<string, UserInfo>>({});
    const [equipment, setEquipment] = useState<Record<string, EquipmentInfo>>(
        {}
    );

    const navigate = useNavigate();

    const deleteIssue = async (_id: string) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/issues/${_id}`
            );
            message.success("Issue deleted successfully");
            refreshTable();
        } catch (error) {
            console.error("Error deleting issue:", error);
            message.error("Error deleting issue");
        }
    };

    const changeIssueStatus = async (issue: Issue, status: string) => {
        try {
            const editedIssue = { ...issue, status };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/issues/${issue._id}`,
                editedIssue
            );
            refreshTable();
        } catch (error) {
            console.error("Issue archiving issue", error);
        }
    };

    useEffect(() => {
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
    }, [issues]);

    const statuses = [
        {
            value: "open",
            color: red[5],
        },
        {
            value: "in progress",
            color: gold[5],
        },
        {
            value: "completed",
            color: green[5],
        },
    ];

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
                return (
                    <Tooltip title={fullName}>
                        <a href={`mailto:${email}`}>
                            <AutoAvatar seed={fullName}>
                                {fullName
                                    .split(" ")
                                    .map((item: string) => item.charAt(0))}
                            </AutoAvatar>
                        </a>
                    </Tooltip>
                );
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
                <Tag
                    color={
                        statuses.find((item) => item.value === type)?.color ||
                        geekblue[5]
                    }
                    key={type}
                >
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        ...(checkAccess(["admin", "moderator"])
            ? [
                  {
                      title: "Actions",
                      key: "action",
                      render: (item: Issue) => (
                          <Flex gap="small">
                              <EditIssueForm
                                  issue={item}
                                  onUpdate={refreshTable}
                              />
                              <Tooltip title="Delete">
                                  <Popconfirm
                                      title="Delete Issue"
                                      description="Are you sure you want to delete this issue?"
                                      onConfirm={() => deleteIssue(item._id)}
                                      okText="Yes"
                                      cancelText="No"
                                  >
                                      <Button
                                          icon={<DeleteOutlined />}
                                          shape="circle"
                                          size="middle"
                                          danger
                                      />
                                  </Popconfirm>
                              </Tooltip>
                          </Flex>
                      ),
                  },
              ]
            : []),
    ];

    const numRows = 5;

    const finalData = issues?.map((row) => {
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
                    defaultPageSize: numRows,
                    hideOnSinglePage: true,
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
