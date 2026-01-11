import axios from "axios";
import { useEffect, useState } from "react";

import {
    Button,
    message,
    Popconfirm,
    Space,
    Table,
    TableProps,
    Tag,
    Tooltip,
    theme,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { cyan, magenta, purple } from "@ant-design/colors";

import AnnouncementForm from "../forms/AnnouncementForm";
import type { User } from "../../types/user";
import type { Announcement, WithAnnouncements } from "../../types/announcement";
import { checkAccess } from "../rbac/HasAccess";
import AutoAvatar from "../AutoAvatar";
import { CommonTableProps } from "../../types/common";

interface UserInfo {
    fullName: string;
    email: string;
}

type AnnouncementTableProps = WithAnnouncements & CommonTableProps;


const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
    refresh,
    announcements,
}) => {
    const [users, setUsers] = useState<Record<string, UserInfo>>({});
    const colorPrimary = theme.useToken().token.colorPrimary;
    const deleteAnnouncement = async (announcementId: string) => {
        try {
            const response = await axios.delete(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/announcements/${announcementId}`
            );
            message.success(response.data.message);
            refresh();
        } catch (error: any) {
            message.error(error.response?.data?.message || "Unknown Error.");
            console.error("Error deleting announcement:", error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get<User[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/users`
                );
                const usersMap = response.data.reduce(
                    (acc: Record<string, UserInfo>, user: User) => {
                        acc[user.uuid] = {
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
    }, [announcements]);

    const types = [
        {
            value: "event",
            color: magenta[5],
        },
        {
            value: "classes",
            color: cyan[5],
        },
        {
            value: "other",
            color: purple[5],
        },
    ];

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
                return (
                    <Tooltip title={fullName}>
                        <a href={`mailto:${email}`}>
                            <AutoAvatar
                                text={fullName
                                    .split(" ")
                                    .map((item) => item.charAt(0))
                                    .join("")}
                            />
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
            title: "Last Updated By",
            dataIndex: "lastUpdatedBy",
            key: "lastUpdatedBy",
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
                return (
                    <Tooltip title={fullName}>
                        <a href={`mailto:${email}`}>
                            <AutoAvatar text= {fullName
                                    .split(" ")
                                    .map((item) => item.charAt(0))
                                    .join("")} />
                               
                          
                        </a>
                    </Tooltip>
                );
            },
        },
        {
            title: "Date Last Updated",
            dataIndex: "dateLastUpdated",
            key: "dateLastUpdated",
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
                    <Tag
                        color={
                            types.find((item) => item.value === type)?.color ||
                            colorPrimary
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
                      render: (announcement: Announcement) =>
                          announcement.uuid && (
                              <Space>
                                  <AnnouncementForm
                                      onSubmit={refresh}
                                      announcement={announcement}
                                  />

                                  <Tooltip title="Delete">
                                      <Popconfirm
                                          title="Delete Announcement"
                                          description="Are you sure you want to delete this announcement?"
                                          onConfirm={() =>
                                              deleteAnnouncement(
                                                  announcement.uuid
                                              )
                                          }
                                          okText="Yes"
                                          cancelText="No"
                                      >
                                          <Button
                                              icon={<DeleteOutlined />}
                                              size="middle"
                                              shape="circle"
                                              danger
                                          />
                                      </Popconfirm>
                                  </Tooltip>
                              </Space>
                          ),
                  },
              ]
            : []),
    ];

    const finalData = announcements?.map((row) => {
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
                        <>
                            {record.title && (
                                <p>
                                    <b>Title:</b>
                                    {" " + record.title}
                                </p>
                            )}
                            <p>
                                <b>Description:</b>
                            </p>
                            <p style={{ margin: 0 }}>{record.description}</p>
                        </>
                    ),
                    rowExpandable: (record) => record.description.length > 0,
                }}
            />
        </>
    );
};

export default AnnouncementTable;
