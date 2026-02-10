import { Button, Result } from "antd";
import { WithJob } from "../../types/job";
import { useAllJobs } from "../../hooks/job";

const Submitted: React.FC<WithJob> = ({ job }) => {
    const { data } = useAllJobs();

    const jobs = data?.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
    });

    const index = jobs?.findIndex((j) => j.uuid === job?.uuid) || 0;
    const totalTimeSeconds =
        jobs && index !== undefined
            ? jobs
                  .slice(index)
                  .reduce(
                      (acc, curr) => acc + (curr.estimatedTimeSeconds || 0),
                      0,
                  )
            : 0;
    const totalTimeMinutes = Math.ceil(totalTimeSeconds / 60) % 60;
    const totalTimeHours = Math.floor(totalTimeMinutes / 60);

    const estimatedTimeMinutes = Math.ceil(
        (job?.estimatedTimeSeconds || 0) / 60,
    );
    const estimatedTimeHours = Math.floor(estimatedTimeMinutes / 60);

    return (
        <Result
            status="success"
            title="Successfully Sliced and Uploaded Your Print!"
            subTitle="Please pick up your print between 10 am to 6 pm on the nearest weekday you are available. Pick up location is Olin Hall, 4th Floor, Room 414."
            extra={[
                <>
                    <p>{`You are #${index + 1} in the queue.`}</p>
                    <p>
                        Your Print Estimated Time: {estimatedTimeHours}h{" "}
                        {estimatedTimeMinutes}m{" "}
                        {(job?.estimatedTimeSeconds || 0) % 60}s
                    </p>
                    <p>
                        Total Estimated Time: {totalTimeHours}h{" "}
                        {totalTimeMinutes}m {totalTimeSeconds % 60}s
                    </p>
                    <Button href="/" type="primary" key="dashboard">
                        To Dashboard
                    </Button>
                    ,
                </>,
            ]}
        />
    );
};

export default Submitted;
