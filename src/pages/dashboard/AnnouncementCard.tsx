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
import { useEffect, useState } from "react";
import { Announcement } from "../../types/Announcement";
import axios from "axios";
import { EditOutlined, DesktopOutlined } from "@ant-design/icons";
import HasAccess from "../../components/rbac/HasAccess";
import { useNavigate } from "react-router-dom";
import { red } from "@ant-design/colors";

const { Title } = Typography;

const AnnouncementCard: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
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
                setIsLoading(false);
            } catch (error) {
                console.error("Internal Server Error: ", error);
            }
        };

        fetchData();
    }, []);
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
                    <div key={announcement._id} style={{ marginBottom: 16 }}>
                        <Divider />
                        <Tag>{announcement.type}</Tag>
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
