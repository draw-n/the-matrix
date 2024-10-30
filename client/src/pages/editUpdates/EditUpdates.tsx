import { Flex } from "antd";

import { useState } from "react";

import AnnouncementForm from "./AnnouncementForm";
import AnnouncementTable from "./AnnouncementTable";
import IssueTable from "./IssueTable";

const EditUpdates: React.FC = () => {
    const [refreshUpdates, setRefreshUpdates] = useState<number>(0); // State for refresh count
    const [refreshIssues, setRefreshIssues] = useState<number>(0); // State for refresh count

    return (
        <>
            <h1>EDIT UPDATES</h1>

            <Flex
                align="center"
                justify="space-between"
                style={{ width: "100%" }}
            >
                <h2>Announcements</h2>

                <AnnouncementForm
                    onUpdate={() => setRefreshUpdates((prev) => prev + 1)}
                />
            </Flex>
            <AnnouncementTable
                refresh={refreshUpdates}
                setRefresh={setRefreshUpdates}
            />
            <h2>Equipment Issues</h2>
            <IssueTable refresh={refreshIssues} setRefresh={setRefreshIssues} />
        </>
    );
};

export default EditUpdates;
