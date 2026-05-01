// Description: TotalFilamentUsedCard component displaying total filament used with a button to initiate a new print.
import { Card, Space, Flex, Typography, Progress } from "antd";
import { WithUserId } from "../../types/user";
import { useFilamentUsedGrams } from "../../hooks/useJobs";

const TotalFilamentUsedCard: React.FC<WithUserId> = ({ userId }) => {
    const { data } = useFilamentUsedGrams(userId);

    return (
        <Card style={{ height: "100%" }}>
            <Space
                style={{ width: "100%", height: "100%" }}
                vertical
                size="middle"
            >
                <Typography.Title level={2} style={{ margin: 0 }}>
                    TOTAL FILAMENT USED
                </Typography.Title>
                <Flex gap="small" align="end">
                    <Typography.Title
                        level={1}
                        style={{
                            margin: 0,
                        }}
                    >
                        {data !== undefined && data !== null
                            ? `${Math.round(data as number)}g`
                            : "Loading..."}
                    </Typography.Title>
                    <p style={{ color: "#a9a9a9" }}>all-time</p>
                </Flex>
                <Flex gap="medium" align="center">
                    <p>PLA</p>
                    <Progress strokeColor={"#1155ff"}  size="middle" showInfo={false} percent={100} />
                </Flex>
            </Space>
        </Card>
    );
};

export default TotalFilamentUsedCard;
