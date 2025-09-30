import { Card, Flex, Space } from "antd";
import AnnouncementForm from "../../components/forms/AnnouncementForm";
import AnnouncementTable from "../../components/tables/AnnouncementTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { Announcement } from "../../types/Announcement";

const AnnouncementTab: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const fetchData = async () => {
        try {
            const response = await axios.get<Announcement[]>(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/announcements?status=posted`
            );

            const formattedData = response.data.map((item) => ({
                ...item,
                key: item._id, // or item.id if you have a unique identifier
            }));
            setAnnouncements(formattedData);
        } catch (error) {
            console.error("Fetching updates or issues failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ANNOUNCEMENTS</h2>
                <AnnouncementForm onUpdate={fetchData} />
            </Flex>
            <AnnouncementTable
                refreshTable={fetchData}
                announcements={announcements}
            />
        </Space>
    );
};

export default AnnouncementTab;
