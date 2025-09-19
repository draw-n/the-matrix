import {
    Flex,
    Button,
    Space,
    Row,
    Col,
    Card,
    Tooltip,
    theme,
    Typography,
} from "antd";
import AnnouncementCarousel from "../../components/AnnouncementCarousel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import {
    DesktopOutlined,
    EditOutlined,
    PlusCircleFilled,
    PlusOutlined,
} from "@ant-design/icons";
import PrintingChart from "./PrintingChart";
import HasAccess from "../../components/rbac/HasAccess";

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const {
        token: { colorPrimary },
    } = theme.useToken();

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card
                            style={{ background: colorPrimary, border: "none" }}
                        >
                            <h2 style={{ color: "white", margin: 0 }}>
                                Hello, {user?.firstName}!
                            </h2>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card>
                            <Space
                                style={{ width: "100%" }}
                                direction="vertical"
                                size="small"
                            >
                                <Flex justify="space-between">
                                    <Title level={2}>
                                        REMOTE PRINTING OCCURRENCES
                                    </Title>
                                    <Button
                                        variant="filled"
                                        type="primary"
                                        size="small"
                                        shape="circle"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigate("/upload")}
                                    />
                                </Flex>
                                <PrintingChart />
                            </Space>
                        </Card>
                    </Col>
                    <Col span={8}>
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
                                        <HasAccess
                                            roles={["admin", "moderator"]}
                                        >
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
                                        </HasAccess>

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
                </Row>
            </Space>
        </>
    );
};

export default Dashboard;
