import { Row, Col, Card, Button, Flex, Input, Typography } from "antd";
import { WithEquipment } from "../../../types/equipment";
import IssueTable from "../../../components/tables/IssueTable";
import { useAllIssues } from "../../../hooks/useIssues";
import ImageCard from "./ImageCard";

const General: React.FC<WithEquipment> = ({ equipment }) => {
    const { data: issues } = useAllIssues(
        equipment ? ["open", "in-progress", "completed"] : undefined,
        equipment ? equipment.uuid : undefined,
    );
    return (
        <Row gutter={[16, 16]}>
            {equipment?.imageName && (
                <Col span={24} lg={8}>
                    <ImageCard equipment={equipment} height="100%" />
                </Col>
            )}
            <Col span={24} lg={equipment?.imageName ? 16 : 24}>
                <Card style={{ height: "100%", minHeight: 250 }}>
                    <Flex vertical gap="small">
                        <Flex justify="space-between" align="center">
                            <Typography.Title level={2}>
                                DESCRIPTION
                            </Typography.Title>
                        </Flex>

                        <Typography.Paragraph>
                            <p>{equipment?.description}</p>
                        </Typography.Paragraph>
                    </Flex>
                </Card>
            </Col>
            <Col span={24}>
                <Card>
                    <Typography.Title level={2}>
                        {`${equipment?.name.toUpperCase()}'S ONGOING ISSUES`}
                    </Typography.Title>
                    <IssueTable issues={issues} />
                </Card>
            </Col>
        </Row>
    );
};

export default General;
