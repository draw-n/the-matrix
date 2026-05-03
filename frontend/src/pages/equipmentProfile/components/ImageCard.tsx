import { Card, Flex } from "antd";
import React from "react";
import { WithEquipment } from "../../../types/equipment";

const ImageCard: React.FC<
    WithEquipment & { height?: string | number; width?: string | number }
> = ({ equipment, height, width }) => {
    return (
        <Card
            style={{
                height: height || "100%",
                width: width || "100%",
                backgroundImage: equipment?.imageName
                    ? `url(${import.meta.env.VITE_BACKEND_URL}/images/equipment/${equipment.imageName})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        />
    );
};

export default ImageCard;
