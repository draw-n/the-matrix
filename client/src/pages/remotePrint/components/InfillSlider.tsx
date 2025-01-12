import { Col, InputNumber, Row, Slider } from "antd";
import type { InputNumberProps } from "antd";
import { useState } from "react";

interface InfillSliderProps {
    infill: number;
    onChange: (value: any) => void;
}

const InfillSlider: React.FC<InfillSliderProps> = ({infill, onChange}: InfillSliderProps) => {

    return (
        <>
            <Row>
                <Col span={12}>
                    <Slider
                        min={0}
                        max={100}
                        onChange={onChange}
                        value={typeof infill === "number" ? infill : 0}
                        step={1}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={0}
                        max={100}
                        style={{ margin: "0 16px" }}
                        step={1}
                        formatter={(value) => `${value}%`}
                        parser={(value) =>
                            value?.replace("%", "") as unknown as number
                        }
                        value={infill}
                        onChange={onChange}
                    />
                </Col>
            </Row>
        </>
    );
};

export default InfillSlider;
