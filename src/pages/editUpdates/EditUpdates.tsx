// Description: EditUpdates component with tabs for editing issues and announcements.

import { Tabs, TabsProps } from "antd";

import IssueTab from "./IssueTab";
import AnnouncementTab from "./AnnouncementTab";

const EditUpdates: React.FC = () => {
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
