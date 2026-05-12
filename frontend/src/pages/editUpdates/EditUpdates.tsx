// Description: EditUpdates component with tabs for editing issues and announcements.
import { useNavigate } from "react-router-dom";

import { Button, Flex, Grid, Space, Tabs, TabsProps } from "antd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

import AnnouncementForm from "../../components/forms/AnnouncementForm";
import AnnouncementTable from "../../components/tables/AnnouncementTable";
import { useAllAnnouncements } from "../../hooks/useAnnouncements";

import IssueTable from "../../components/tables/IssueTable";
import { useAllIssues } from "../../hooks/useIssues";

import EventForm from "../../components/forms/EventForm";
import EventTable from "../../components/tables/EventTable";
import { useAllEvents } from "../../hooks/useEvents";
import { useEffect, useState } from "react";

const EditUpdates: React.FC = () => {
     const [activeKey, setActiveKey] = useState("issues");
    
        useEffect(() => {
            const hash = window.location.hash.replace("#", "");
    
            if (hash) {
                setActiveKey(hash);
            }
        }, []);
    
        const handleChange = (key: string) => {
            setActiveKey(key);
    
            window.history.replaceState(null, "", `#${key}`);
        };

    const items: TabsProps["items"] = [
        {
            key: "issues",
            label: "Issues",
            children: <IssueTab />,
        },
        {
            key: "announcements",
            label: "Announcements",
            children: <AnnouncementTab />,
        },
        {
            key: "events",
            label: "Events",
            children: <EventTab />,
        },
    ];

    return (
        <>
            <Tabs
                activeKey={activeKey}
                onChange={handleChange}
                items={items}
            />
        </>
    );
};

const AnnouncementTab: React.FC = () => {
    const {data: announcements, refetch} = useAllAnnouncements(['posted']);


    return (
        <Space vertical size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ANNOUNCEMENTS</h2>
                <AnnouncementForm />
            </Flex>
            <AnnouncementTable
                announcements={announcements}
            />
        </Space>
    );
};

const IssueTab: React.FC = () => {
    const {data: issues} = useAllIssues();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md; // Consider mobile if screen width is less than 768px
    const navigate = useNavigate();

    return (
        <Space vertical size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ISSUES</h2>
                <Button
                    type="primary"
                    size="middle"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/report")}
                    iconPlacement="end"
                    shape={isMobile ? "circle" : "round"}
                >
                    {isMobile ? null : "Add New Issue"}
                </Button>
            </Flex>
            <IssueTable issues={issues} />
        </Space>
    );
};

const EventTab: React.FC = () => {
    const {data: events} = useAllEvents();
    const navigate = useNavigate();

    return (
        <Space vertical size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>EVENTS</h2>
                <EventForm />
            </Flex>
            <EventTable events={events} />
        </Space>
    );
};

export default EditUpdates;
