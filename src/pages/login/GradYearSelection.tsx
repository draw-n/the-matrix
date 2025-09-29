import { Flex } from "antd";
import CardSelection from "../../components/CardSelection";
import { useState } from "react";

interface GradYearSelectionProps {
    value?: string;
    onChange?: (value: string) => void;
}

const GradYearSelection: React.FC<GradYearSelectionProps> = ({
    value,
    onChange,
}) => {
    const currentMonth = new Date().getMonth();
    // If it's January to June, the graduation year is the current year
    // If it's July to December, the graduation year is the next year
    const currentYear = new Date().getFullYear() + (currentMonth >= 6 ? 1 : 0);
    return (
        <Flex gap="large" style={{width: "100%"}} vertical align="center" justify="center">
            <p>Select your graduation year.</p>
            <CardSelection
                value={value}
                onChange={onChange}
                options={Array.from({length: 4}, (_, i) => ({
                    label: `${currentYear + i}`,
                    value: `${currentYear + i}`,
                }))}
            />
        </Flex>
    );
};



export default GradYearSelection;
