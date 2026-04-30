import { PauseOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { usePausePrinterById } from "../../../hooks/useEquipment";
import { WithEquipmentId } from "../../../types/equipment";

const PrinterActions: React.FC<WithEquipmentId> = ({ equipmentId }) => {
    const { mutateAsync: pausePrinterById } = usePausePrinterById();

    return (
        <Card style={{ height: "100%" }}>
            <Typography.Title level={2} style={{ marginBottom: "16px" }}>
                PRINTER ACTIONS
            </Typography.Title>
            <Typography.Paragraph>
                Only use the pause button if it looks like an active print
                failure.
            </Typography.Paragraph>
            <Button
                onClick={() => pausePrinterById({ equipmentId })}
                icon={<PauseOutlined />}
                type="primary"
            >
                Pause Print
            </Button>
        </Card>
    );
};

export default PrinterActions;
