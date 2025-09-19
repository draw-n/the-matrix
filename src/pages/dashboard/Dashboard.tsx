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
import AnnouncementCard from "./AnnouncementCard";

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
                                size="middle"
                            >
                                <Flex justify="space-between" align="center">
                                    <Title level={2} style={{ margin: 0 }}>
                                        REMOTE PRINTING OCCURRENCES
                                    </Title>
                                    <Button
                                        variant="filled"
                                        type="primary"
                                        size="middle"
                                        shape="round"
                                        iconPosition="end"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigate("/upload")}
                                    >
                                        New Print
                                    </Button>
                                </Flex>
                                <PrintingChart />
                            </Space>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <AnnouncementCard />
                    </Col>
                </Row>
            </Space>
        </>
    );
};

export default Dashboard;
