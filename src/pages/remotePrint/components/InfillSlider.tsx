import { Col, Flex, InputNumber, Row, Slider } from "antd";
import type { InputNumberProps } from "antd";
import { useState } from "react";

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
                    min={0}
                    max={1}
                    onChange={onChange}
                    value={typeof infill === "number" ? infill : 0}
                    step={0.01}
                    style={{ width: "100%" }}
                />
                <InputNumber
                    min={0}
                    max={1}
                    step={0.01}
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
