// Description: TotalFilamentUsedCard component displaying total filament used with a button to initiate a new print.
import { Card, Space, Flex, Typography } from "antd";
import { WithUserId } from "../../types/user";
import { useFilamentUsedGrams } from "../../hooks/useJobs";

const TotalFilamentUsedCard: React.FC<WithUserId> = ({ userId }) => {
    const { data } = useFilamentUsedGrams(userId);

    return (
        <Card>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Flex justify="space-between" align="center">
                    <Typography.Title level={2} style={{ margin: 0 }}>
                        TOTAL FILAMENT USED
                    </Typography.Title>
                </Flex>
                <Typography.Title
                    level={1}
                    style={{
                        margin: 0,
                        textTransform: "uppercase",
                    }}
                >
                    {data !== undefined && data !== null
                        ? `${data} grams`
                        : "Loading..."}
                </Typography.Title>
            </Space>
        </Card>
    );
};

export default TotalFilamentUsedCard;
