// Description: AnnouncementCard component displaying announcements with pagination and action buttons.
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    Button,
    Card,
    Divider,
    Flex,
    Pagination,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { EditOutlined, DesktopOutlined } from "@ant-design/icons";

import { Announcement } from "../../types/announcement";
import HasAccess from "../../components/rbac/HasAccess";
import { useAllAnnouncements } from "../../hooks/announcement";

const { Title } = Typography;

const AnnouncementCard: React.FC = () => {
    const { data: announcements, isLoading } = useAllAnnouncements(["posted"]);
    const [page, setPage] = useState<number>(0);

    const navigate = useNavigate();

    return (
        <Card>
            <Flex justify={"space-between"} align={"center"}>
                <h2>Announcements</h2>
                <Flex gap="small">
                    <HasAccess roles={["admin", "moderator"]}>
                        <Tooltip title="Edit Announcements">
                            <Button
                                onClick={() => navigate("/edit")}
                                size="middle"
                                type="primary"
                                shape="circle"
                                className="primary-button-filled"
                                icon={<EditOutlined />}
                            />
                        </Tooltip>
                    </HasAccess>

                    <Tooltip title="Kiosk Mode">
                        <Button
                            onClick={() => navigate("/kiosk")}
                            size="middle"
                            type="primary"
                            shape="circle"
                            className="secondary-button-filled"
                            icon={<DesktopOutlined />}
                        />
                    </Tooltip>
                </Flex>
            </Flex>
            {announcements && announcements.length > 0 ? (
                announcements.slice(page, page + 3).map((announcement) => (
                    <div key={announcement.uuid} style={{ marginBottom: 16 }}>
                        <Divider />
                        <Tag style={{ textTransform: "uppercase" }}>
                            {announcement.type}
                        </Tag>
                        <Title level={4}>{announcement.title}</Title>
                        <p>{announcement.description}</p>
                    </div>
                ))
            ) : (
                <p>No announcements available.</p>
            )}
            {announcements && announcements.length > 3 && (
                <Pagination
                    align="center"
                    defaultCurrent={1}
                    pageSize={3}
                    onChange={(page) => setPage((page - 1) * 3)}
                    total={announcements.length}
                />
            )}
        </Card>
    );
};

export default AnnouncementCard;
