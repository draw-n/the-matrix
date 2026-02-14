import { useParams } from "react-router-dom";
import { useAllEquipment } from "../../hooks/useEquipment";
import EquipmentProfile from "./EquipmentProfile";
import NotFound from "../../components/routing/NotFound";

const EquipmentProfileLoader: React.FC = () => {
    const { routePath } = useParams();
    const {
        data: equipments,
        isLoading,
        isFetchedAfterMount,
    } = useAllEquipment();

    if (isLoading || !isFetchedAfterMount) {
        return null;
    }

    const equipment = equipments?.find((e) => e.routePath === routePath);
    if (!equipment) {
        return <NotFound />;
    }

    return <EquipmentProfile equipment={equipment} />;
};

export default EquipmentProfileLoader;
