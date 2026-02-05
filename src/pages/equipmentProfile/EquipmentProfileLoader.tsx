import { useParams } from "react-router-dom";
import { useAllEquipment } from "../../hooks/equipment";
import EquipmentProfile from "./EquipmentProfile";
import { Spin } from "antd"; // Or your preferred loader
import NotFound from "../../components/NotFound";

const EquipmentProfileLoader: React.FC = () => {
    const { routePath } = useParams();
    const { data: equipments, isLoading } = useAllEquipment();

    // 1. Show a loading spinner while fetching
    if (isLoading) {
        return null;
    }

    // 2. Find the specific equipment based on the URL path
    const equipment = equipments?.find(e => e.routePath === routePath);
    // 3. If data is loaded and NO equipment is found, THEN show 404
    if (!equipment) {
        return <NotFound />;
    }

    // 4. Data is here, render the profile
    return <EquipmentProfile equipment={equipment} />;
};

export default EquipmentProfileLoader;