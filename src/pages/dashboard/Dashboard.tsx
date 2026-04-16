// Description: Dashboard page displaying user greeting and various dashboard cards.
import { useAuth } from "../../contexts/AuthContext";

import {
    Flex,
    Space,
    Row,
    Col,
    Card,
    theme,
    Tabs,
    TabsProps,
    Alert,
} from "antd";

import AnnouncementCard from "../../components/dashboard/AnnouncementCard";
import SocialsCard from "../../components/dashboard/SocialsCard";
import NeedHelpCard from "../../components/dashboard/NeedHelpCard";
import RemotePrintCard from "../../components/dashboard/RemotePrintCard";
import TotalFilamentUsedCard from "../../components/dashboard/TotalFilamentUsedCard";
import QueueCard from "../../components/dashboard/QueueCard";

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const items: TabsProps["items"] = [
        {
            key: "general",
            label: "General",
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Alert
                            showIcon
                            title={
                                <span>
                                    <span style={{ fontWeight: "bold" }}>
                                        Note:
                                    </span>{" "}
                                    This website is developed by students, for
                                    students. As a result, it may contain some
                                    features that may not be fully functional.
                                    We appreciate your understanding and
                                    encourage you to report any issues or
                                    provide feedback to help us improve the
                                    platform.
                                </span>
                            }
                            type="info"
                        />
                    </Col>
                    <Col span={24}>
                        <AnnouncementCard />
                    </Col>
                </Row>
            ),
        },
        {
            key: "activity",
            label: "Activity",
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <RemotePrintCard userId={user?.uuid} />
                    </Col>
                    <Col span={8}>
                        <TotalFilamentUsedCard userId={user?.uuid} />
                    </Col>
                    <Col span={24}>
                        <QueueCard showMineOnly editable={false} />
                    </Col>
                </Row>
            ),
        },
        {
            key: "office-hours",
            label: "Office Hours",
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <NeedHelpCard />
                    </Col>
                    {/* <Col span={8}>
                        <SocialsCard />
                    </Col> */}
                </Row>
            ),
        },
    ];

    return (
        <>
            <Space
                style={{ width: "100%", height: "100%" }}
                vertical
                size="middle"
            >
                <Row gutter={[16, 16]} style={{ flex: 1 }}>
                    <Col span={24}>
                        <Card
                            style={{
                                backgroundColor: colorPrimary,
                                color: "#fff",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                    color: "#fff",
                                }}
                            >
                                Hello, {user?.firstName}!
                            </h2>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Tabs defaultActiveKey="1" items={items} />
                    </Col>
                </Row>
            </Space>
        </>
    );
};

export default Dashboard;
