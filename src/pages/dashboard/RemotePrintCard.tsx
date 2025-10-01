import { PlusOutlined } from "@ant-design/icons";
import { Card, Space, Flex, Button, Typography } from "antd";
import PrintingChart from "./PrintingChart";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const RemotePrintCard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Card>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
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
    );
};

export default RemotePrintCard;
