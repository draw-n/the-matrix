import axios from "axios";
import React, { useEffect, useState } from "react";
import { Category } from "../../types/Category";
import CardSelection, {
    CardSelectionProps,
} from "../../components/CardSelection";
import { Flex, Input } from "antd";

const { TextArea } = Input;

const CategorySelection: React.FC<CardSelectionProps> = ({
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

export default CategorySelection;
