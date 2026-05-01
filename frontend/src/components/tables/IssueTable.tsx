// Description: A table component to display and manage issues reported by users

import { useMemo } from "react";

import {
    Avatar,
    Button,
    Flex,
    Popconfirm,
    Table,
    TableProps,
    Tag,
    Tooltip,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import AutoAvatar from "../common/AutoAvatar";
import { geekblue } from "@ant-design/colors";
import { useNavigate } from "react-router-dom";

import {
    IssueStatus,
    issueStatusColors,
    type Issue,
    type WithIssues,
} from "../../types/issue";
import { checkAccess } from "../routing/HasAccess";

import EditIssueForm from "../forms/EditIssueForm";
import { useAllUsers } from "../../hooks/useUsers";
import { useAllEquipment } from "../../hooks/useEquipment";
import { useDeleteIssueById } from "../../hooks/useIssues";

const IssueTable: React.FC<WithIssues> = ({ issues }: WithIssues) => {
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

    const issueColumns: TableProps["columns"] = [
        {
            title: "Equipment",
            dataIndex: "equipmentId",
            key: "equipment",
            width: "20%",
            sorter: (a, b) => {
                const nameA = equipmentMap[a.equipmentId]?.name || "";
                const nameB = equipmentMap[b.equipmentId]?.name || "";
                return nameA.localeCompare(nameB);
            },
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
            width: "15%",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
            sorter: (a, b) => {
                const nameA = userMap[a.createdBy]?.fullName || "";
                const nameB = userMap[b.createdBy]?.fullName || "";
                return nameA.localeCompare(nameB);
            },
            render: (userId) => {
                const info = userMap[userId];
                const fullName = info?.fullName || "Unknown User";
                return (
                    <Flex justify="center" align="center">
                        <Tooltip
                            style={{ textTransform: "capitalize" }}
                            title={fullName}
                        >
                            <a href={`mailto:${info?.email || ""}`}>
                                <AutoAvatar text={info?.initials || "?"} />
                            </a>
                        </Tooltip>
                    </Flex>
                );
            },
        },
        {
            title: "Date Created",
            dataIndex: "dateCreated",
            key: "dateCreated",
            width: "25%",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
            defaultSortOrder: "ascend",
            sorter: {
                compare: (a, b) =>
                    new Date(a.dateCreated).getTime() -
                    new Date(b.dateCreated).getTime(),
                multiple: 1,
            },
            render: (dateCreated) => (
                <Flex justify="center" align="center">
                    {new Date(dateCreated).getTime() == new Date(0).getTime()
                        ? ""
                        : new Date(dateCreated).toLocaleString()}
                </Flex>
            ),
        },

        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            width: "15%",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
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
                <Flex justify="center" align="center">
                    <Tag
                        color={
                            issueStatusColors[type as IssueStatus] ||
                            geekblue[5]
                        }
                        key={type}
                    >
                        {type.toUpperCase()}
                    </Tag>
                </Flex>
            ),
        },

        ...(checkAccess(["admin", "moderator"])
            ? [
                  {
                      title: "Assigned To",
                      dataIndex: "assignedTo",
                      key: "assignedTo",
                      width: "15%",
                      onHeaderCell: () => ({
                          style: { textAlign: "center" as const },
                      }),
                      sorter: (a: any, b: any) => {
                          const nameA = userMap[a.assignedTo]?.fullName || "";
                          const nameB = userMap[b.assignedTo]?.fullName || "";
                          return nameA.localeCompare(nameB);
                      },
                      render: (assignedTo: string[]) => {
                          if (!assignedTo || assignedTo.length === 0) {
                              return (
                                  <Flex justify="center" align="center">
                                      <Tag color="default">UNASSIGNED</Tag>
                                  </Flex>
                              );
                          }

                          return (
                              <Flex justify="center" align="center">
                                  <Avatar.Group>
                                      {assignedTo?.map((userId) => {
                                          const userInfo =
                                              userMap[userId] || null;
                                          const userFullName =
                                              userInfo?.fullName ||
                                              "Unknown User";
                                          return (
                                              <Tooltip
                                                  style={{
                                                      textTransform:
                                                          "capitalize",
                                                  }}
                                                  title={userFullName}
                                              >
                                                  <a
                                                      href={`mailto:${userInfo?.email || ""}`}
                                                  >
                                                      <AutoAvatar
                                                          text={
                                                              userInfo?.initials ||
                                                              "?"
                                                          }
                                                      />
                                                  </a>
                                              </Tooltip>
                                          );
                                      })}
                                  </Avatar.Group>
                              </Flex>
                          );
                      },
                  },
                  {
                      title: "Actions",
                      key: "action",
                      width: "15%",
                      onHeaderCell: () => ({
                          style: { textAlign: "center" as const },
                      }),
                      render: (item: Issue) => (
                          <Flex gap="small" justify="center" align="center">
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
                        <Flex justify="space-between">
                            <Flex vertical gap="small">
                                <p>{record.description}</p>
                            </Flex>
                        </Flex>
                    ),
                    rowExpandable: (record) => !!record.description,
                }}
                size="middle"
                rowKey="uuid"
            />
        </>
    );
};

export default IssueTable;
