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
import { useEffect, useState } from "react";

const EquipmentProfile: React.FC<WithEquipment> = ({
    equipment,
}: WithEquipment) => {
    const { refetch: equipmentRefresh } = useAllEquipment();

    const { mutateAsync: editEquipmentById } = useEditEquipmentById();

     const [activeKey, setActiveKey] = useState("general");
    
        useEffect(() => {
            const hash = window.location.hash.replace("#", "");
    
            if (hash) {
                setActiveKey(hash);
            }
        }, []);
    
        const handleChange = (key: string) => {
            setActiveKey(key);
    
            window.history.replaceState(null, "", `#${key}`);
        };

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
            key: "general",
            label: "General",
            children: <General equipment={equipment} />,
        },
        ...(equipment && equipment?.remotePrintAvailable && equipment?.uuid
            ? [
                  {
                      key: "print-history",
                      label: "Print History",
                      children: (
                          <QueueCard
                              showMineOnlyToggable
                              equipmentId={equipment?.uuid}
                          />
                      ),
                  },
              ]
            : []),
        ...(equipment && equipment?.cameraUrl
            ? [
                  {
                      key: "live-feed",
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
    ];

    return (
        <>
            <Space style={{ width: "100%" }} vertical size="middle">
                <HeaderCard equipment={equipment} />
                <Tabs
                    activeKey={activeKey}
                    onChange={handleChange}
                    items={items}
                />
            </Space>
        </>
    );
};

export default EquipmentProfile;
