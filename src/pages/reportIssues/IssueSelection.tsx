import axios from "axios";
import React, { useEffect, useState } from "react";
import { Category } from "../../types/Category";
import CardSelection, {
    CardSelectionProps,
} from "../../components/CardSelection";
import { Flex } from "antd";
import { Equipment } from "../../types/Equipment";

interface IssueSelectionProps extends CardSelectionProps {
    categoryId: string;
}

const IssueSelection: React.FC<IssueSelectionProps> = ({
    categoryId,
    value,
    onChange,
}: IssueSelectionProps) => {
    const [category, setCategory] = useState<Category>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Category>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/categories/${categoryId}`
                );
                setCategory(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };
        if (onChange) {
            onChange("");
        }
        if (categoryId) {
            fetchData();
        }
    }, [categoryId]);

    return (
        <Flex
            gap="large"
            style={{ width: "100%" }}
            vertical
            align="center"
            justify="center"
        >
            <p>Select the issue that is most applicable.</p>
            <CardSelection
                value={value}
                onChange={onChange}
                options={[
                    ...(category?.defaultIssues?.map((issue) => ({
                        label: issue,
                        value: issue,
                    })) ?? []),
                    {
                        label: "The issue isn't covered by the other options. Please elaborate in the upcoming text box.",
                        value: "other",
                    },
                ]}
            />
        </Flex>
    );
};

export default IssueSelection;
