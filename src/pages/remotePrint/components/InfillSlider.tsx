// Description: InfillSlider component for adjusting infill percentage in remote printing settings.

import { Flex, InputNumber, Slider } from "antd";

interface InfillSliderProps {
    infill: number;
    onChange: (value: any) => void;
}

const InfillSlider: React.FC<InfillSliderProps> = ({
    infill,
    onChange,
}: InfillSliderProps) => {
    return (
        <>
            <Flex style={{ width: "100%" }} justify="space-between" gap="10px">
                <Slider
                    min={10}
                    max={50}
                    onChange={onChange}
                    value={typeof infill === "number" ? infill : 0}
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
                    value={infill}
                    onChange={onChange}
                />
            </Flex>
        </>
    );
};

export default InfillSlider;
