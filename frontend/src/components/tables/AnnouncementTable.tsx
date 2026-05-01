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
    Flex,
    Image,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { cyan, magenta, purple } from "@ant-design/colors";

import AnnouncementForm from "../forms/AnnouncementForm";
import type { Announcement, WithAnnouncements } from "../../types/announcement";
import { checkAccess } from "../routing/HasAccess";
import AutoAvatar from "../common/AutoAvatar";
import { useAllUsers } from "../../hooks/useUsers";
import { useDeleteAnnouncementById } from "../../hooks/useAnnouncements";

const AnnouncementTable: React.FC<WithAnnouncements> = ({ announcements }) => {
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
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "20%",
            sorter: (a, b) =>
                a?.title?.localeCompare(b?.title?.toString() || "") || 0,
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
            defaultSortOrder: "descend",
            sorter: (a, b) =>
                new Date(a.dateCreated).getTime() -
                new Date(b.dateCreated).getTime(),
            render: (date) => (
                <Flex justify="center" align="center">
                    {date && new Date(date).getTime() !== 0
                        ? new Date(date).toLocaleString()
                        : "-"}
                </Flex>
            ),
        },
        {
            title: "Image",
            dataIndex: "imageName",
            key: "imageName",
            width: "15%",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
            render: (imageName) => (
                <Flex justify="center" align="center">
                    {imageName && (
                        <Flex vertical align="center" gap="small">
                            <Image.PreviewGroup
                                items={[
                                    `${import.meta.env.VITE_BACKEND_URL}/images/announcements/${imageName}`,
                                ]}
                            >
                                <Image
                                    alt="webp image"
                                    style={{ maxWidth: 40, height: "auto" }}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/announcements/${imageName}`}
                                />
                            </Image.PreviewGroup>
                        </Flex>
                    )}
                </Flex>
            ),
        },
        {
            title: "Type",
            key: "type",
            dataIndex: "type",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
            filters: [
                { text: "Event", value: "event" },
                { text: "Classes", value: "classes" },
                { text: "Other", value: "other" },
            ],
            width: "10%",
            onFilter: (value, record) => record.type === value,
            render: (type) => (
                <Flex justify="center" align="center">
                    <Tag
                        color={
                            types.find((item) => item.value === type)?.color ||
                            colorPrimary
                        }
                    >
                        {type?.toUpperCase()}
                    </Tag>
                </Flex>
            ),
        },
        ...(checkAccess(["admin", "moderator"])
            ? [
                  {
                      title: "Actions",
                      key: "action",
                      width: "10%",
                      onHeaderCell: () => ({
                          style: { textAlign: "center" as const },
                      }),
                      render: (_: any, record: Announcement) => (
                          <Flex gap="small" justify="center">
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
                          </Flex>
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
                    <div style={{ padding: "24px" }}>
                        <Flex justify="space-between">
                            <Flex vertical gap="small">
                                <p>{record.description}</p>
                            </Flex>
                        </Flex>
                    </div>
                ),
                rowExpandable: (record) => !!record.description,
            }}
        />
    );
};

export default AnnouncementTable;
