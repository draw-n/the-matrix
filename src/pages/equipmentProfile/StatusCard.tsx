// Description: StatusCard component for displaying equipment status.
import { Card, Flex, Typography } from "antd";

import { WithEquipment } from "../../types/equipment";
const { Title } = Typography;

const StatusCard: React.FC<WithEquipment> = ({
    equipment,
}) => {
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
                    {equipment?.status}
                </p>
            </Flex>
        </Card>
    );
};

export default StatusCard;
