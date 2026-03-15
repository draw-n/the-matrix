import { Button, Card, Checkbox, Flex, Space, Typography } from "antd";
import { useAllJobs } from "../../hooks/useJobs";
import { WithEquipmentId } from "../../types/equipment";
import JobTable from "../tables/JobTable";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const QueueCard: React.FC<WithEquipmentId> = ({ equipmentId }) => {
    const [showMineOnlyActive, setShowMineOnlyActive] = useState(false);
    const [showMineOnlyFinished, setShowMineOnlyFinished] = useState(false);
    const { user } = useAuth();
    const { data: activeJobs } = useAllJobs(
        ["queued", "ready", "printing"],
        equipmentId,
        showMineOnlyActive ? user?.uuid : undefined,
    );

    const { data: finishedJobs } = useAllJobs(
        ["completed", "failed"],
        equipmentId,
        showMineOnlyFinished ? user?.uuid : undefined,
    );

    const sortedFinishedJobs = finishedJobs?.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Sort in descending order
    });

    return (
        <Card style={{ height: "100%" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Flex justify="space-between" align="center">
                    <Typography.Title level={2}>QUEUE</Typography.Title>
                    <Checkbox
                        checked={showMineOnlyActive}
                        onChange={() =>
                            setShowMineOnlyActive(!showMineOnlyActive)
                        }
                    >
                        Show Mine Only
                    </Checkbox>
                </Flex>
                <JobTable jobs={activeJobs || []} />
                <Flex justify="space-between" align="center">
                    <Typography.Title level={2}>HISTORY</Typography.Title>
                    <Checkbox
                        checked={showMineOnlyFinished}
                        onChange={() =>
                            setShowMineOnlyFinished(!showMineOnlyFinished)
                        }
                    >
                        Show Mine Only
                    </Checkbox>
                </Flex>
                <JobTable jobs={sortedFinishedJobs || []} />
            </Space>
        </Card>
    );
};

export default QueueCard;
