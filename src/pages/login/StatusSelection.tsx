import { Flex } from "antd";
import CardSelection from "../../components/CardSelection";
import { ControlledValueProps } from "../../types/common";

const StatusSelection: React.FC<ControlledValueProps<string>> = ({
    value,
    onChange,
}) => {
    return (
        <Flex gap="large" style={{width: "100%"}} vertical align="center" justify="center">
            <p>Select your current status at Vanderbilt University.</p>
            <CardSelection
                value={value}
                onChange={onChange}
                options={[
                    { label: "Undergraduate", value: "undergraduate" },
                    { label: "Graduate", value: "graduate" },
                    { label: "Faculty", value: "faculty" },
                ]}
            />
        </Flex>
    );
};

export default StatusSelection;
