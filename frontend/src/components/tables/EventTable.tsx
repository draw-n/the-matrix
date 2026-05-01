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
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import EventForm from "../forms/EventForm";
import {
    Event,
    EventType,
    WithEvents,
    eventTypeColors,
} from "../../types/event";
import { checkAccess } from "../routing/HasAccess";
import AutoAvatar from "../common/AutoAvatar";
import { useAllUsers } from "../../hooks/useUsers";
import { useDeleteEventById } from "../../hooks/useEvents";

const EventTable: React.FC<WithEvents> = ({ events }) => {
    const { mutateAsync: deleteEventById } = useDeleteEventById();
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

    const updateColumns: TableProps<Event>["columns"] = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
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
            title: "Date & Time",
            dataIndex: "datetime",
            key: "datetime",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
            sorter: (a, b) => {
                if (a.date && b.date) {
                    return (
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    );
                } else if (a.date) {
                    return 1; // a is greater (has date)
                } else if (b.date) {
                    return -1; // b is greater (has date)
                }
                if (a.dayOfWeek && b.dayOfWeek && a.dayOfWeek !== b.dayOfWeek) {
                    const days = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ];
                    return (
                        days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek)
                    );
                }
                return 0; // both are equal (no date)
            },
            render: (_, record) => {
                if (record.date) {
                    const date = new Date(record.date);
                    return (
                        <Flex justify="center">
                            {date.toLocaleDateString() +
                                ", " +
                                record.startTime +
                                " - " +
                                record.endTime}
                        </Flex>
                    );
                } else if (record.dayOfWeek) {
                    return (
                        <Flex justify="center">
                            {record.dayOfWeek +
                                ", " +
                                record.startTime +
                                " - " +
                                record.endTime +
                                " (recurring)"}
                        </Flex>
                    );
                } else {
                    return "N/A";
                }
            },
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
            onFilter: (value, record) => record.type === value,
            render: (type) => (
                <Flex justify="center" align="center">
                    <Tag
                        color={eventTypeColors[type as EventType] || "default"}
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
                      onHeaderCell: () => ({
                          style: { textAlign: "center" as const },
                      }),

                      render: (_: any, record: Event) => {
                          if (record.type === "office hours") {
                              return (
                                  <Flex
                                      justify="center"
                                      align="center"
                                      gap="small"
                                  >
                                      N/A
                                  </Flex>
                              );
                          }
                          return (
                              <Flex justify="center" align="center" gap="small">
                                  <EventForm event={record} />
                                  <Popconfirm
                                      title="Delete Event"
                                      onConfirm={() =>
                                          deleteEventById({
                                              eventId: record.uuid || "",
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
                          );
                      },
                  },
              ]
            : []),
    ];

    return (
        <Table
            style={{ overflow: "auto" }}
            rowKey="uuid"
            pagination={{ defaultPageSize: 5, hideOnSinglePage: true }}
            columns={updateColumns}
            dataSource={events}
            size="middle"
            expandable={{
                expandedRowRender: (record) => (
                    <div>
                        <Flex justify="space-between">
                            <Flex vertical gap="small">
                                <p>
                                    <b>Description:</b>
                                </p>
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

export default EventTable;
