// Description: A table component to display and manage issues reported by users

import { useMemo } from "react";

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
import AutoAvatar from "../common/AutoAvatar";
import { geekblue, gold, green, red } from "@ant-design/colors";
import { useNavigate } from "react-router-dom";

import type { Issue, WithIssues } from "../../types/issue";
import { checkAccess } from "../routing/HasAccess";

import EditIssueForm from "../forms/EditIssueForm";
import { useAllUsers } from "../../hooks/useUsers";
import { useAllEquipment } from "../../hooks/useEquipment";
import { useDeleteIssueById } from "../../hooks/useIssues";


const IssueTable: React.FC<WithIssues> = ({
    issues,
}: WithIssues) => {
    const { data: users } = useAllUsers();
    const { data: equipment } = useAllEquipment();
    const { mutateAsync: deleteIssueById } = useDeleteIssueById();
    const userMap = useMemo(() => {
        const map: Record<string, any> = {};
        users?.forEach((u) => {
            map[u.uuid] = {
                fullName: `${u.firstName} ${u.lastName}`,
                email: u.email,
                initials: `${u.firstName?.charAt(0) || ""}${u.lastName?.charAt(0) || ""}`,
            };
        });
        return map;
    }, [users]);

    const equipmentMap = useMemo(() => {
        const map: Record<string, any> = {};
        equipment?.forEach((e) => {
            map[e.uuid] = {
                name: e.name,
                routePath: e.routePath,
                type: e.categoryId,
            };
        });
        return map;
    }, [equipment]);

    const navigate = useNavigate();

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
            dataIndex: "equipmentId",
            key: "equipment",

            render: (equipmentId) => {
                const { name, routePath } = equipmentMap[equipmentId] || {
                    name: "Loading...",
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
            sorter: (a, b) => {
                const nameA = userMap[a.createdBy]?.fullName || "";
                const nameB = userMap[b.createdBy]?.fullName || "";
                return nameA.localeCompare(nameB);
            },
            render: (userId) => {
                const info = userMap[userId];
                const fullName = info?.fullName || "Unknown User";
                return (
                    <Tooltip style={{ textTransform: "capitalize" }} title={fullName}>
                        <a href={`mailto:${info?.email || ""}`}>
                            <AutoAvatar text={info?.initials || "?"} />
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
                              <EditIssueForm issue={item} />
                              <Tooltip title="Delete">
                                  <Popconfirm
                                      title="Delete Issue"
                                      description="Are you sure you want to delete this issue?"
                                      onConfirm={async () =>
                                          await deleteIssueById({
                                              issueId: item.uuid || "",
                                          })
                                      }
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

    return (
        <>
            <Table
                pagination={{
                    defaultPageSize: numRows,
                    hideOnSinglePage: true,
                }}
                columns={issueColumns}
                dataSource={issues}
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
