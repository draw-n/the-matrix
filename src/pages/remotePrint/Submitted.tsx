import { Button, Flex, Result } from "antd";
import { WithJob } from "../../types/job";
import { useAllJobs } from "../../hooks/job";
import { useEquipmentById } from "../../hooks/equipment";

const Submitted: React.FC<WithJob> = ({ job }) => {
    const { data } = useAllJobs();
    const { data: equipment } = useEquipmentById(job ? job.equipmentId : "");

    const equipmentPage = equipment
        ? `/makerspace/${equipment.routePath}`
        : "/makerspace";

    const jobs = data?.sort((a, b) => {
        // Sort by status (printing first) then by date
        const priority = {
            printing: 0,
            ready: 1,
            queued: 2,
            completed: 3,
            failed: 4,
        };
        const statusDiff =
            (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
        if (statusDiff !== 0) return statusDiff;

        return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
    });

    const index = jobs?.findIndex((j) => j.uuid === job?.uuid);

    const displayIndex =
        index !== undefined && index !== -1 ? index + 1 : "...";

    const totalSeconds =
        jobs && index !== -1 && index !== undefined
            ? jobs
                  .slice(0, index + 1)
                  .reduce(
                      (acc, curr) => acc + (curr.estimatedTimeSeconds || 0),
                      0,
                  )
            : job?.estimatedTimeSeconds || 0;

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return { h, m, s };
    };

    const totalTime = formatTime(totalSeconds);
    const myTime = formatTime(job?.estimatedTimeSeconds || 0);

    return (
        <Result
            status="success"
            title="Successfully Sliced and Uploaded Your Print!"
            subTitle={
                <Flex vertical gap="small">
                    <p>
                        <strong>{`You are #${displayIndex} in the queue.`}</strong>
                    </p>
                    <p>
                        Your Print Estimated Time: {myTime.h}h {myTime.m}m{" "}
                        {myTime.s}s
                    </p>
                    <p>
                        Total Wait Time (including yours): {totalTime.h}h{" "}
                        {totalTime.m}m {totalTime.s}s
                    </p>
                    <p>
                        Please pick up your print between 10 am to 6 pm on the
                        nearest weekday you are available after these estimated
                        times. Pick up location is Olin Hall, 4th Floor, Room
                        414.
                    </p>
                </Flex>
            }
            extra={[
                <Button href="/" type="primary" key="dashboard">
                    To Dashboard
                </Button>,
                <Button href={`${equipmentPage}`} key="equipment">
                    To Equipment
                </Button>,
            ]}
        />
    );
};

export default Submitted;
