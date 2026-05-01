// Description: AnnouncementCard component displaying announcements with pagination and action buttons.
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

import HasAccess from "../routing/HasAccess";
import { useAllAnnouncements } from "../../hooks/useAnnouncements";

const AnnouncementCard: React.FC = () => {
    const { data: announcements } = useAllAnnouncements(["posted"]);
    const [page, setPage] = useState<number>(0);

    const navigate = useNavigate();
    const pageSize = 3; // Show one announcement per page
    return (
        <Card style={{ height: "100%" }}>
            <Flex style={{ marginBottom: 16 }} justify={"space-between"} align={"center"}>
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
                announcements
                    .slice(page, page + pageSize)
                    .map((announcement) => (
                        <div
                            key={announcement.uuid}
                            style={{ marginBottom: 16 }}
                        >
                            <Flex gap="small" align="center">
                                {announcement.imageName && (
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/announcements/${announcement.imageName}`}
                                        alt={announcement.title}
                                        style={{
                                            maxWidth: 75,
                                            height: "auto",
                                        }}
                                    />
                                )}
                                <Flex
                                    justify="space-between"
                                    align="start"
                                    style={{ width: "100%" }}
                                >
                                    <Flex vertical>
                                        <Typography.Title
                                            style={{ margin: 0 }}
                                            level={4}
                                        >
                                            {announcement.title}
                                        </Typography.Title>
                                        <p>{announcement.description}</p>
                                    </Flex>
                                    <Tag
                                        style={{
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {announcement.type}
                                    </Tag>
                                </Flex>
                            </Flex>
                            <Divider />
                        </div>
                    ))
            ) : (
                <p>No announcements available.</p>
            )}
            {announcements && announcements.length > pageSize && (
                <Pagination
                    align="center"
                    defaultCurrent={1}
                    pageSize={pageSize}
                    onChange={(page) => setPage((page - 1) * pageSize)}
                    total={announcements.length}
                />
            )}
        </Card>
    );
};

export default AnnouncementCard;
