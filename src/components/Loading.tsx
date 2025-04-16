import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

interface LoadingProps {
    size?: string | number;
    padding?: string | number 
}

const Loading: React.FC<LoadingProps> = ({ size }: LoadingProps) => {
    return (
        <Flex style={{ width: "100%", padding: "20px" }} justify="center">
            <Spin indicator={<LoadingOutlined spin />} />
        </Flex>
    );
};

export default Loading;
