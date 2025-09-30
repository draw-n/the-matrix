import { Flex, Space, Tabs, TabsProps } from "antd";
import { useState } from "react";

import IssueTab from "./IssueTab";
import AnnouncementTab from "./AnnouncementTab";

const EditUpdates: React.FC = () => {
    const [refreshUpdates, setRefreshUpdates] = useState<number>(0); // State for refresh count
    const [refreshIssues, setRefreshIssues] = useState<number>(0); // State for refresh count

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Issues",
            children: <IssueTab />,
        },
        {
            key: "2",
            label: "Announcements",
            children: <AnnouncementTab />,
        },
    ];

    return (
        <>
            <Tabs defaultActiveKey="1" items={items} />
        </>
    );
};

export default EditUpdates;
