import { Card, Flex, Space } from "antd";
import AnnouncementForm from "../../components/forms/AnnouncementForm";
import AnnouncementTable from "../../components/tables/AnnouncementTable";

const AnnouncementTab: React.FC = () => {
    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ANNOUNCEMENTS</h2>
                <AnnouncementForm onUpdate={() => {}} />
            </Flex>
            <AnnouncementTable refresh={0} setRefresh={() => {}} />
        </Space>
    );
};

export default AnnouncementTab;
