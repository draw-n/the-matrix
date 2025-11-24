// Description: InfillSlider component for adjusting infill percentage in remote printing settings.

import { Flex, InputNumber, Slider } from "antd";
import { ControlledValueProps } from "../../../types/common";

const InfillSlider: React.FC<ControlledValueProps<number | null>> = ({
    value,
    onChange,
}) => {
    return (
        <>
            <Flex style={{ width: "100%" }} justify="space-between" gap="10px">
                <Slider
                    min={10}
                    max={50}
                    onChange={onChange}
                    value={typeof value === "number" ? value : 0}
                    step={1}
                    style={{ width: "100%" }}
                />
                <InputNumber
                    min={10}
                    max={50}
                    step={1}
                    formatter={(value) => `${value}%`}
                    parser={(value) =>
                        value?.replace("%", "") as unknown as number
                    }
                    value={value}
                    onChange={onChange}
                />
            </Flex>
        </>
    );
};

export default InfillSlider;
