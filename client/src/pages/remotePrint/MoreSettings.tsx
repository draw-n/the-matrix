import { Col, InputNumber, Row, Select, Slider } from "antd";
import type { InputNumberProps } from "antd";
import { useState } from "react";
import InfillSlider from "./components/InfillSlider";

const MoreSettings: React.FC = () => {
    const [infill, setInfill] = useState(0);
    const [pattern, setPattern] = useState(null);

    const onChange: InputNumberProps["onChange"] = (value) => {
        if (Number.isNaN(value)) {
            return;
        }
        setInfill(value as number);
    };
    return (
        <>
            <h1>MORE SETTINGS</h1>
            <h3>Infill</h3>
            <InfillSlider infill={infill} onChange={onChange} />

            <h3>Infill Pattern</h3>
            <Select
                value={pattern}
                onChange={setPattern}
                options={[
                    { value: "event", label: "Event" },
                    { value: "classes", label: "Classes" },
                    { value: "other", label: "Other" },
                ]}
            />
        </>
    );
};

export default MoreSettings;
