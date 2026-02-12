// Description: AnnouncementTab component for managing and displaying announcements.
import {  Flex, Space } from "antd";
import AnnouncementForm from "../../components/forms/AnnouncementForm";
import AnnouncementTable from "../../components/tables/AnnouncementTable";

import { useAllAnnouncements } from "../../hooks/announcement";

const AnnouncementTab: React.FC = () => {
    const {data: announcements, refetch} = useAllAnnouncements(['posted']);


    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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

export default AnnouncementTab;
