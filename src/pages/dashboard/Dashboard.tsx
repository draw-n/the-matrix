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
import SocialsCard from "./SocialsCard";
import AdminCard from "./AdminCard";
import RemotePrintCard from "./RemotePrintCard";
import FirstTime from "../login/FirstTime";

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
                        <Flex vertical gap={16}>
                           <RemotePrintCard />
                            <AdminCard />
                        </Flex>
                    </Col>
                    <Col span={8}>
                        <Flex vertical gap={16}>
                            <AnnouncementCard />
                            <SocialsCard />
                        </Flex>
                    </Col>
                </Row>
            </Space>
        </>
    );
};

export default Dashboard;
