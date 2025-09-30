import axios from "axios";
import React, { useEffect, useState } from "react";
import { Category } from "../../types/Category";
import CardSelection from "../../components/CardSelection";
import { Flex } from "antd";

const Description: React.FC = () => {
    return (
        <Flex gap="large"vertical align="center" justify="center">
            <p>
                This form is NOT for class or personal usage. It is only to
                report any equipment malfunction in the Digital Fabrication Lab.
                For any other inquiries, please contact Dr. David Florian
                directly.
            </p>
        </Flex>
    );
};

export default Description;
