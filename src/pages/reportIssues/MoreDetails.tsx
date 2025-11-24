// Description: MoreDetails component for providing additional information about the reported issue.

import React from "react";
import  {
    CardSelectionProps,
} from "../../components/CardSelection";
import { Flex, Input } from "antd";

const { TextArea } = Input;

const MoreDetails: React.FC<CardSelectionProps> = ({
    value,
    onChange,
}: CardSelectionProps) => {

    return (
        <Flex gap="large" vertical align="center" justify="center">
            <p>Please provide more details about the issue.</p>
            <TextArea
                rows={7}
                value={value}
                onChange={(e) =>
                    onChange ? onChange(e.target.value ?? "") : null
                }
            />
        </Flex>
    );
};

export default MoreDetails;
