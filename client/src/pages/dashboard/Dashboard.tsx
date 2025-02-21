import { Flex, Button, Space, Row, Col, Card, Tooltip } from "antd";
import AnnouncementCarousel from "../../components/AnnouncementCarousel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { DesktopOutlined, EditOutlined } from "@ant-design/icons";
import PrintingChart from "./PrintingChart";

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <h1>DASHBOARD</h1>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card>
                            <Space
                                style={{ width: "100%" }}
                                direction="vertical"
                                size="small"
                            >
                                <Flex
                                    justify={"space-between"}
                                    align={"center"}
                                >
                                    <h2>Announcements</h2>
                                    <Flex gap="small">
                                        {(user?.access == "moderator" ||
                                            user?.access == "admin") && (
                                            <Tooltip title="Edit Announcements">
                                                <Button
                                                    onClick={() =>
                                                        navigate("/edit")
                                                    }
                                                    size="small"
                                                    type="primary"
                                                    className="primary-button-filled"
                                                    icon={<EditOutlined />}
                                                />
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Kiosk Mode">
                                            <Button
                                                onClick={() =>
                                                    navigate("/kiosk")
                                                }
                                                size="small"
                                                type="primary"
                                                className="secondary-button-filled"
                                                icon={<DesktopOutlined />}
                                            />
                                        </Tooltip>
                                    </Flex>
                                </Flex>
                                <AnnouncementCarousel />
                            </Space>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card>
                            <Space
                                style={{ width: "100%" }}
                                direction="vertical"
                                size="small"
                            >
                                <h2>Remote Printing Occurrences</h2>
                                <PrintingChart />
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </>
    );
};

export default Dashboard;
