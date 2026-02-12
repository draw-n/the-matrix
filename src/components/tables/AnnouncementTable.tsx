import { useMemo } from "react";
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
import type { Announcement, WithAnnouncements } from "../../types/announcement";
import { checkAccess } from "../rbac/HasAccess";
import AutoAvatar from "../AutoAvatar";
import { useAllUsers } from "../../hooks/user";
import { useDeleteAnnouncementById } from "../../hooks/announcement";

const AnnouncementTable: React.FC<WithAnnouncements> = ({
    announcements,
}) => {
    const { mutateAsync: deleteAnnouncementById } = useDeleteAnnouncementById();
    const { data: users } = useAllUsers();
    const colorPrimary = theme.useToken().token.colorPrimary;

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

    const types = [
        { value: "event", color: magenta[5] },
        { value: "classes", color: cyan[5] },
        { value: "other", color: purple[5] },
    ];

    const updateColumns: TableProps<Announcement>["columns"] = [
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
                    <Tooltip title={fullName}>
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
            defaultSortOrder: "descend",
            sorter: (a, b) =>
                new Date(a.dateCreated).getTime() -
                new Date(b.dateCreated).getTime(),
            render: (date) =>
                date && new Date(date).getTime() !== 0
                    ? new Date(date).toLocaleString()
                    : "-",
        },
        {
            title: "Type",
            key: "type",
            dataIndex: "type",
            filters: [
                { text: "Event", value: "event" },
                { text: "Classes", value: "classes" },
                { text: "Other", value: "other" },
            ],
            onFilter: (value, record) => record.type === value,
            render: (type) => (
                <Tag
                    color={
                        types.find((item) => item.value === type)?.color ||
                        colorPrimary
                    }
                >
                    {type?.toUpperCase()}
                </Tag>
            ),
        },
        ...(checkAccess(["admin", "moderator"])
            ? [
                  {
                      title: "Actions",
                      key: "action",
                      render: (_: any, record: Announcement) => (
                          console.log(record.uuid),
                          (
                              <Space>
                                  <AnnouncementForm announcement={record} />
                                  <Popconfirm
                                      title="Delete Announcement"
                                      onConfirm={() =>
                                          deleteAnnouncementById({
                                              announcementId: record.uuid || "",
                                          })
                                      }
                                  >
                                      <Button
                                          icon={<DeleteOutlined />}
                                          shape="circle"
                                          danger
                                      />
                                  </Popconfirm>
                              </Space>
                          )
                      ),
                  },
              ]
            : []),
    ];

    return (
        <Table
            rowKey="uuid"
            pagination={{ defaultPageSize: 5, hideOnSinglePage: true }}
            columns={updateColumns}
            dataSource={announcements}
            size="middle"
            expandable={{
                expandedRowRender: (record) => (
                    <div style={{ padding: "8px 24px" }}>
                        <p>
                            <b>Title:</b> {record.title}
                        </p>
                        <p>
                            <b>Description:</b>
                        </p>
                        <p>{record.description}</p>
                    </div>
                ),
                rowExpandable: (record) => !!record.description,
            }}
        />
    );
};

export default AnnouncementTable;
