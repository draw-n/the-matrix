import { geekblueDark } from "@ant-design/colors";
import {
    Button,
    Flex,
    Popconfirm,
    Table,
    TableProps,
    Tag,
    Tooltip,
} from "antd";
import { WithJobs } from "../../types/job";
import { formatTime } from "../../types/common";
import AutoAvatar from "../common/AutoAvatar";
import { useAllUsers } from "../../hooks/useUsers";
import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { checkAccess } from "../routing/HasAccess";
import { DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useDeleteJobById, useEditJobById } from "../../hooks/useJobs";

const JobTable: React.FC<WithJobs> = ({ jobs }) => {
    const { data: users } = useAllUsers();
    const { user } = useAuth();
    const { mutateAsync: deleteJobById } = useDeleteJobById();
    const { mutateAsync: editJobById } = useEditJobById();
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

    const swapJobPositions = (jobId: string, before: boolean) => {
        const job1Index = jobs?.findIndex((job) => job.uuid === jobId);
        if (
            job1Index === undefined ||
            job1Index === -1 ||
            (before && job1Index === 0) ||
            (!before && job1Index === (jobs?.length || 0) - 1)
        ) {
            console.error("Job not found for swapping positions.");
            return;
        }
        const job2Index = before ? job1Index - 1 : job1Index + 1;
        if (job2Index === undefined || job2Index === -1) {
            console.error("One or both jobs not found for swapping positions.");
            return;
        }
        const tempOrder = jobs?.[job1Index]?.order;
        editJobById({
            jobId: jobs?.[job1Index]?.uuid || "",
            updatedFields: { order: jobs?.[job2Index]?.order },
        });
        editJobById({
            jobId: jobs?.[job2Index]?.uuid || "",
            updatedFields: { order: tempOrder },
        });
    };

    const queuedJobs = jobs?.filter((job) => job.status === "queued") || [];

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
                                <Flex align="center" gap="1px">
                                    {"queued" === record.status &&
                                        checkAccess(["admin"]) && (
                                            <Tooltip title="Move Up in Queue">
                                                <Button
                                                    disabled={
                                                        queuedJobs.findIndex(
                                                            (job) =>
                                                                job.uuid ===
                                                                record.uuid,
                                                        ) <= 0
                                                    }
                                                    size="small"
                                                    icon={<UpOutlined />}
                                                    shape="circle"
                                                    type="text"
                                                    variant="text"
                                                    onClick={() =>
                                                        swapJobPositions(
                                                            record.uuid,
                                                            true,
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        )}
                                    {"queued" === record.status &&
                                        checkAccess(["admin"]) && (
                                            <Tooltip title="Move Down in Queue">
                                                <Button
                                                    size="small"
                                                    icon={<DownOutlined />}
                                                    shape="circle"
                                                    type="text"
                                                    disabled={
                                                        queuedJobs.findIndex(
                                                            (job) =>
                                                                job.uuid ===
                                                                record.uuid,
                                                        ) >=
                                                        queuedJobs.length - 1
                                                    }
                                                    variant="text"
                                                    onClick={() =>
                                                        swapJobPositions(
                                                            record.uuid,
                                                            false,
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        )}
                                    {"queued" === record.status &&
                                        (record.userId === user?.uuid ||
                                            checkAccess(["admin"])) && (
                                            <Popconfirm
                                                title="Delete Job"
                                                description="Are you sure you want to delete this job? This action cannot be undone."
                                                onConfirm={() =>
                                                    deleteJobById({
                                                        jobId:
                                                            record.uuid || "",
                                                    })
                                                }
                                            >
                                                <Button
                                                    size="small"
                                                    color="red"
                                                    variant="text"
                                                    shape="circle"
                                                    icon={<DeleteOutlined />}
                                                />
                                            </Popconfirm>
                                        )}
                                </Flex>
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
