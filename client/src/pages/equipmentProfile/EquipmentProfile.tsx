import { Button } from "antd";
import { Equipment } from "../../types/Equipment";

interface EquipmentProfileProps {
    equipment: Equipment;
}

const EquipmentProfile: React.FC<EquipmentProfileProps> = ({
    equipment,
}: EquipmentProfileProps) => {
    return (
        <>
            <h1 style={{ textTransform: "uppercase" }}>{equipment.name}</h1>
            <p>Description: {equipment.description}</p>
            <p>Type: {equipment.type}</p>
            <p>Status: {equipment.status}</p>
            <p>Issues: {equipment.issues}</p>
            <Button onClick={() => console.log(equipment)}>
                show equipment
            </Button>
        </>
    );
};

export default EquipmentProfile;
