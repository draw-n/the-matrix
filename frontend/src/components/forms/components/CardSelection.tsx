// Description: A card selection component that allows users to select from multiple options displayed as cards in a carousel format, with a fade-in effect on mount.

import { Card, Carousel, Flex, theme, Grid } from "antd";
import { useState, useEffect } from "react";
import { ControlledValueProps } from "../../../types/common";

export interface CardSelectionProps extends ControlledValueProps<string>{
    options?: { label: string; value: string }[];
}

const CardSelection: React.FC<CardSelectionProps> = ({
    options,
    value,
    onChange,
}: CardSelectionProps) => {

    const screens = Grid.useBreakpoint();

    const isMobile = !screens.md; // Consider mobile if screen width is less than 768px
    const slidesToShow = isMobile ? 1 : Math.min(3, options?.length ?? 0);
    const handleSelect = (value: string) => {
        if (onChange) {
            onChange(value);
        }
    };
    const colorPrimary = theme.useToken().token.colorPrimary;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 250);
        return () => clearTimeout(timeout);
    }, []);



    return (
        <div
            style={{
                width: "100%",
                maxWidth: 800,
                margin: "0 auto",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.25s ease", // fade in over 0.5s
            }}
        >
            <Carousel
                className="card-selection"
                infinite={(options?.length ?? 0) > slidesToShow}
                key={options?.length}
                dots={false}
                slidesToShow={slidesToShow}
                arrows={(options?.length || 0) > slidesToShow}
            >
                {options?.map((opt) => (
                    <Flex
                        justify="center"
                        align="center"
                        flex="1"
                        style={{ padding: 10, height: "100%" }}
                        key={opt.value}
                    >
                        <Card
                            hoverable
                            onClick={() => handleSelect(opt.value)}
                            style={{
                                margin: 10,
                                height: 175,
                                color:
                                    value === opt.value
                                        ? colorPrimary
                                        : "#797979",
                                backgroundColor:
                                    value === opt.value
                                        ? "#d6e4ff"
                                        : "white",
                                textAlign: "center",
                                borderColor:
                                    value === opt.value
                                        ? colorPrimary
                                        : "#797979",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            <Flex
                                justify="center"
                                align="center"
                                style={{ height: "100%" }}
                                flex="1"
                            >
                                {opt.label}
                            </Flex>
                        </Card>
                    </Flex>
                ))}
            </Carousel>
        </div>
    );
};
export default CardSelection;
