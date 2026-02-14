// Description: StatusCard component for displaying equipment status.
import { Card, Flex, Typography } from "antd";

import { WithEquipment } from "../../../types/equipment";

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
                <Typography.Title level={2}>Status</Typography.Title>
                <p style={{ textTransform: "capitalize" }}>
                    {equipment?.status}
                </p>
            </Flex>
        </Card>
    );
};

export default StatusCard;
