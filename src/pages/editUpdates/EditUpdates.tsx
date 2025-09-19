import { Flex, Space, Tabs, TabsProps } from "antd";
import { useState } from "react";

import AnnouncementForm from "../../components/forms/AnnouncementForm";
import AnnouncementTable from "../../components/tables/AnnouncementTable";
import IssueTable from "../../components/tables/IssueTable";

const EditUpdates: React.FC = () => {
    const [refreshUpdates, setRefreshUpdates] = useState<number>(0); // State for refresh count
    const [refreshIssues, setRefreshIssues] = useState<number>(0); // State for refresh count

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Issues",
            children: (
                <>
                    <h2>Issues</h2>
                    <IssueTable
                        refresh={refreshIssues}
                        setRefresh={setRefreshIssues}
                    />
                </>
            ),
        },
        {
            key: "2",
            label: "Announcements",
            children: (
                <>
                    <Flex
                        align="center"
                        justify="space-between"
                        style={{ width: "100%" }}
                    >
                        <h2>Announcements</h2>

                        <AnnouncementForm
                            onUpdate={() =>
                                setRefreshUpdates((prev) => prev + 1)
                            }
                        />
                    </Flex>
                    <AnnouncementTable
                        refresh={refreshUpdates}
                        setRefresh={setRefreshUpdates}
                    />
                </>
            ),
        },
    ];

    return (
        <>
            <Tabs defaultActiveKey="1" items={items} />
        </>
    );
};

export default EditUpdates;
