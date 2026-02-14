// Description: Dashboard page displaying user greeting and various dashboard cards.
import { useAuth } from "../../contexts/AuthContext";

import { Flex, Space, Row, Col, Card, theme } from "antd";

import AnnouncementCard from "../../components/dashboard/AnnouncementCard";
import SocialsCard from "../../components/dashboard/SocialsCard";
import NeedHelpCard from "../../components/dashboard/NeedHelpCard";
import RemotePrintCard from "../../components/dashboard/RemotePrintCard";
import TotalFilamentUsedCard from "../../components/dashboard/TotalFilamentUsedCard";

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
                            <RemotePrintCard userId={user?.uuid} />
                            <NeedHelpCard />
                        </Flex>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Flex vertical gap={16}>
                            <AnnouncementCard />

                            <TotalFilamentUsedCard userId={user?.uuid} />

                            <SocialsCard />
                        </Flex>
                    </Col>
                </Row>
            </Space>
        </>
    );
};

export default Dashboard;
