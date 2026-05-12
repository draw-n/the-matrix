import { Card, Flex } from "antd";
import React from "react";
import { WithEquipment } from "../../../types/equipment";
import { WithUser } from "../../../types/user";

const ImageCard: React.FC<
    WithUser & { height?: string | number; width?: string | number }
> = ({ user, height, width }) => {
    return (
        <Card
            style={{
                minHeight:
                    typeof height === "number"
                        ? `${height}px`
                        : height || "300px",
                width: width || "100%",
                backgroundImage: user?.imageName
                    ? `url(${import.meta.env.VITE_BACKEND_URL}/images/users/${user.imageName})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        />
    );
};

export default ImageCard;
