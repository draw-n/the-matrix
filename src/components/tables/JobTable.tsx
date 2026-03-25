import { geekblueDark } from "@ant-design/colors";
import { Button, Flex, Popconfirm, Table, TableProps, Tag } from "antd";
import { WithJobs } from "../../types/job";
import { formatTime } from "../../types/common";
import AutoAvatar from "../common/AutoAvatar";
import { useAllUsers } from "../../hooks/useUsers";
import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { checkAccess } from "../routing/HasAccess";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteJobById } from "../../hooks/useJobs";

const JobTable: React.FC<WithJobs> = ({ jobs }) => {
    const { data: users } = useAllUsers();
    const { user } = useAuth();
    const { mutateAsync: deleteJobById } = useDeleteJobById();
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
    const columns: TableProps["columns"] = [
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
            render: (_: any, record, index: number) => {
                const displayIndex = index + 1;
                return (
                    <Flex justify="center">
                        <span style={{ color: "#a9a9a9" }}>{displayIndex}</span>
                    </Flex>
                );
            },
            width: 50,
        },

        {
            title: "File Name",
            dataIndex: "gcodeFileName",
            key: "gcodeFileName",
            render: (text: string, record) => {
                const info = userMap[record.userId];
                return (
                    <Flex align="center" gap="middle">
                        <Flex justify="center">
                            <a href={`mailto:${info?.email || ""}`}>
                                <AutoAvatar text={info?.initials || "?"} />
                            </a>
                        </Flex>

                        <Flex vertical>
                            <Flex align="center" gap="small">
                                <span
                                    style={{
                                        color: geekblueDark[4],
                                        fontWeight: "bold",
                                    }}
                                >
                                    {text}
                                </span>
                                {["queued", "ready"].includes(record.status) &&
                                    (record.userId === user?.uuid ||
                                        checkAccess(["admin"])) && (
                                        <Popconfirm
                                            title="Delete Job"
                                            description="Are you sure you want to delete this job? This action cannot be undone."
                                            onConfirm={() =>
                                                deleteJobById({
                                                    jobId: record.uuid || "",
                                                })
                                            }
                                        >
                                            <Button
                                                color="red"
                                                variant="text"
                                                shape="circle"
                                                icon={<DeleteOutlined />}
                                            />
                                        </Popconfirm>
                                    )}
                            </Flex>
                            <span style={{ color: "#a9a9a9" }}>
                                {`${formatTime(record.estimatedTimeSeconds || 0).h}h ${formatTime(record.estimatedTimeSeconds || 0).m}m ${formatTime(record.estimatedTimeSeconds || 0).s}s • ${Math.round(record.filamentUsedGrams || 0)}g`}
                            </span>
                        </Flex>
                    </Flex>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_: any, record, index: number) => {
                return (
                    <Flex justify="center" align="end" vertical gap="small">
                        <Tag
                            color={
                                record.status === "completed"
                                    ? "green"
                                    : record.status === "failed"
                                      ? "red"
                                      : "default"
                            }
                        >
                            {record.status.toUpperCase()}
                        </Tag>
                        {record.finishedAt && (
                            <span style={{ color: "#a9a9a9" }}>
                                {new Date(
                                    record.finishedAt,
                                ).toLocaleDateString()}
                            </span>
                        )}
                    </Flex>
                );
            },
        },
    ];

    const numRows = 5;
    return (
        <>
            <Table
                pagination={{
                    defaultPageSize: numRows,
                    hideOnSinglePage: true,
                }}
                columns={columns}
                showHeader={false}
                dataSource={jobs}
                size="middle"
                style={{
                    borderRadius: "5px",
                    borderCollapse: "separate",
                }}
                rowHoverable={false}
                onRow={() => ({
                    style: {
                        cursor: "default",
                    },
                })}
            />
        </>
    );
};

export default JobTable;
