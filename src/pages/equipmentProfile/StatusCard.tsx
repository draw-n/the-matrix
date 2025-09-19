import { Card, Flex, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import Paragraph from "antd/es/skeleton/Paragraph";

import { Equipment } from "../../types/Equipment";

interface StatusCardProps {
    equipment: Equipment;
}

const { Title } = Typography;

const StatusCard: React.FC<StatusCardProps> = ({
    equipment,
}: StatusCardProps) => {
    return (
        <Card style={{ height: "100%" }}>
            <Flex
                flex="1"
                vertical
                style={{ height: "100%" }}
                justify="center"
                align="center"
            >
                <Title level={2}>Status</Title>
                <p style={{ textTransform: "capitalize" }}>
                    {equipment.status}
                </p>
            </Flex>
        </Card>
    );
};

export default StatusCard;
