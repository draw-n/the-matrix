// Description: TotalFilamentUsedCard component displaying total filament used with a button to initiate a new print.
import { Card, Space, Flex, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { WithUserId } from "../../types/user";
import { useAuth } from "../../hooks/AuthContext";
import { useFilamentUsedGrams } from "../../hooks/job";

const { Title } = Typography;

const TotalFilamentUsedCard: React.FC<WithUserId> = ({ userId }) => {
    const { data } = useFilamentUsedGrams(userId);

    return (
        <Card>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Flex justify="space-between" align="center">
                    <Title level={2} style={{ margin: 0 }}>
                        TOTAL FILAMENT USED
                    </Title>
                </Flex>
                <Title
                    level={1}
                    style={{
                        margin: 0,
                        textTransform: "uppercase",
                    }}
                >
                    {data !== undefined && data !== null
                        ? `${data} grams`
                        : "Loading..."}
                </Title>
            </Space>
        </Card>
    );
};

export default TotalFilamentUsedCard;
