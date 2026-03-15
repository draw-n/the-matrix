// Description: EquipmentProfile component for displaying and editing equipment details.

import { Col, Row, Space, Tabs, TabsProps } from "antd";
import { Equipment, WithEquipment } from "../../types/equipment";
import {
    useAllEquipment,
    useEditEquipmentById,
} from "../../hooks/useEquipment";

import HeaderCard from "./components/HeaderCard";
import QueueCard from "../../components/dashboard/QueueCard";
import Settings from "./components/Settings";
import LiveFeed from "./components/LiveFeed";
import HasAccess, { checkAccess } from "../../components/routing/HasAccess";
import General from "./components/General";

const EquipmentProfile: React.FC<WithEquipment> = ({
    equipment,
}: WithEquipment) => {
    const { refetch: equipmentRefresh } = useAllEquipment();

    const { mutateAsync: editEquipmentById } = useEditEquipmentById();

    /**
     * Toggles edit mode and saves changes if exiting edit mode.
     */
    const handleEditClick = async (
        editMode: boolean,
        setEditMode: (editMode: boolean) => void,
        values: Partial<Equipment> | undefined,
    ) => {
        if (equipment && editMode) {
            const editedEquipment: Equipment = {
                ...equipment,
                ...values,
            };
            await editEquipmentById({
                equipmentId: equipment.uuid,
                editedEquipment,
            });
            equipmentRefresh();
        }
        setEditMode(!editMode);
    };

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "General",
            children: (
                <General equipment={equipment} handleClick={handleEditClick} />
            ),
        },
        {
            key: "2",
            label: "Print History",
            children: <QueueCard equipmentId={equipment?.uuid} />,
        },
        ...(equipment && equipment?.cameraUrl
            ? [
                  {
                      key: "3",
                      label: "Live Feed",
                      children: (
                          <LiveFeed
                              equipment={equipment}
                              handleClick={handleEditClick}
                          />
                      ),
                  },
              ]
            : []),
        ...(checkAccess(["admin", "moderator"])
            ? [
                  {
                      key: "4",
                      label: "Settings",
                      children: (
                          <Settings
                              equipment={equipment}
                              handleClick={handleEditClick}
                          />
                      ),
                  },
              ]
            : []),
    ];

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <HeaderCard
                    equipment={equipment}
                    handleClick={handleEditClick}
                />
                <Tabs defaultActiveKey="1" items={items} />
            </Space>
        </>
    );
};

export default EquipmentProfile;
