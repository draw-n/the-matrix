// Description: CategorySelection component for selecting equipment categories when reporting issues.

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Category } from "../../types/category";
import CardSelection, {
    CardSelectionProps,
} from "../../components/CardSelection";
import { Flex } from "antd";

const CategorySelection: React.FC<CardSelectionProps> = ({
    value,
    onChange,
}: CardSelectionProps) => {
    const [categories, setCategories] = useState<Category[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Category[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`
                );
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <Flex gap="large" style={{width: "100%"}} vertical align="center" justify="center">
            <p>What category does the equipment fit into?</p>
            <CardSelection
                value={value}
                onChange={onChange}
                options={
                    categories?.map((c) => ({ label: c.name, value: c._id })) ||
                    []
                }
            />
        </Flex>
    );
};

export default CategorySelection;
