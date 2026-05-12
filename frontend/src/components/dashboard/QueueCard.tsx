import { Card, Checkbox, Flex, Space, Typography } from "antd";
import { useAllJobs } from "../../hooks/useJobs";
import { WithEquipmentId } from "../../types/equipment";
import JobTable from "../tables/JobTable";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface QueueCardProps extends WithEquipmentId {
    userId?: string;
    showMineOnly?: boolean;
    showMineOnlyToggable?: boolean;
    hideActive?: boolean;
    hideFinished?: boolean;
    editable?: boolean;
}

const QueueCard: React.FC<QueueCardProps> = ({
    equipmentId,
    userId,
    showMineOnly,
    showMineOnlyToggable,
    hideActive = false,
    hideFinished = false,
    editable = true
}) => {
    const [showMineOnlyActive, setShowMineOnlyActive] = useState(
        showMineOnly ?? false,
    );
    const [showMineOnlyFinished, setShowMineOnlyFinished] = useState(
        showMineOnly ?? false,
    );
    const { user } = useAuth();
    const { data: activeJobs } = useAllJobs(
        ["queued", "ready", "printing"],
        equipmentId,
        userId || (showMineOnlyActive ? user?.uuid : undefined),
    );

    const sortedActiveJobs = activeJobs?.slice().sort((a, b) => {
        const priority = {
            printing: 0,
            ready: 1,
            queued: 2,
            completed: 3,
            failed: 4,
        };
        const statusDiff =
            (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
        if (statusDiff !== 0) {
            return statusDiff;
        }
        const orderA =
            a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB =
            b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return orderA - orderB || dateA - dateB;
    });

    const { data: finishedJobs } = useAllJobs(
        ["completed", "failed"],
        equipmentId,
        userId || (showMineOnlyFinished ? user?.uuid : undefined),
    );

    const sortedFinishedJobs = finishedJobs?.slice().sort((a, b) => {
        const dateA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
        const dateB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
        return dateB - dateA; // Sort in descending order
    });

    return (
        <Card style={{ height: "100%" }}>
            <Space vertical size="middle" style={{ width: "100%" }}>
                {!hideActive && (
                    <>
                        <Flex justify="space-between" align="center">
                            <Typography.Title level={2}>QUEUE</Typography.Title>
                            {showMineOnlyToggable && (
                                <Checkbox
                                    checked={showMineOnlyActive}
                                    onChange={() =>
                                        setShowMineOnlyActive(
                                            !showMineOnlyActive,
                                        )
                                    }
                                >
                                    Show Mine Only
                                </Checkbox>
                            )}
                        </Flex>
                        <JobTable jobs={sortedActiveJobs || []} editable={editable} />
                    </>
                )}
                {!hideFinished && (
                    <>
                        <Flex justify="space-between" align="center">
                            <Typography.Title level={2}>
                                HISTORY
                            </Typography.Title>
                            {showMineOnlyToggable && (
                                <Checkbox
                                    checked={showMineOnlyFinished}
                                    onChange={() =>
                                        setShowMineOnlyFinished(
                                            !showMineOnlyFinished,
                                        )
                                    }
                                >
                                    Show Mine Only
                                </Checkbox>
                            )}
                        </Flex>
                        <JobTable jobs={sortedFinishedJobs || []} editable={editable} />
                    </>
                )}
            </Space>
        </Card>
    );
};

export default QueueCard;
