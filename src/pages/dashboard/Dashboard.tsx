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

import AnnouncementCard from "./AnnouncementCard";
import SocialsCard from "./SocialsCard";
import AdminCard from "./AdminCard";
import RemotePrintCard from "./RemotePrintCard";
import { useAuth } from "../../hooks/AuthContext";

const Dashboard: React.FC = () => {
    const { user } = useAuth();

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
                    <Col xs={24} lg={16}>
                        <Flex vertical gap={16}>
                            <RemotePrintCard />
                            <AdminCard />
                        </Flex>
                    </Col>
                    <Col xs={24} lg={8}>
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
