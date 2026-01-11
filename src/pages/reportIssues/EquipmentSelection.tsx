// Description: EquipmentSelection component for selecting equipment based on the chosen category when reporting issues.
import CardSelection, {
    CardSelectionProps,
} from "../../components/CardSelection";
import { Flex } from "antd";
import { useAllEquipment } from "../../hooks/equipment";
import { WithCategoryId } from "../../types/category";

type EquipmentSelectionProps = CardSelectionProps & WithCategoryId; 

const EquipmentSelection: React.FC<EquipmentSelectionProps> = ({
    categoryId,
    value,
    onChange,
}: EquipmentSelectionProps) => {
    const {data: equipments, isLoading} = useAllEquipment(categoryId);

    return (
        <Flex gap="large" style={{width: "100%"}} vertical align="center" justify="center">
            <p>Select the equipment that experienced the issue.</p>
            <CardSelection
                value={value}
                onChange={onChange}
                options={
                    equipments?.map((c) => ({
                        label: c.name,
                        value: c.uuid,
                    })) || []
                }
            />
        
        </Flex>
    );
};

export default EquipmentSelection;
