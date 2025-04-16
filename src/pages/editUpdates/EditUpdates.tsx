import { Flex, Space } from "antd";
import { useState } from "react";

import AnnouncementForm from "../../components/forms/AnnouncementForm";
import AnnouncementTable from "../../components/tables/AnnouncementTable";
import IssueTable from "../../components/tables/IssueTable";

const EditUpdates: React.FC = () => {
    const [refreshUpdates, setRefreshUpdates] = useState<number>(0); // State for refresh count
    const [refreshIssues, setRefreshIssues] = useState<number>(0); // State for refresh count

    return (
        <>
            <Space direction="vertical" size="middle" style={{width: "100%"}}>
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
                <h2>Issues</h2>
                <IssueTable
                    refresh={refreshIssues}
                    setRefresh={setRefreshIssues}
                />
            </Space>
        </>
    );
};

export default EditUpdates;
