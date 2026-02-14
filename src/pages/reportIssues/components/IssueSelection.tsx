// Description: IssueSelection component for selecting specific issues related to a chosen category when reporting problems.

import { WithCategoryId } from "../../../types/category";
import CardSelection, {
    CardSelectionProps,
} from "../../../components/forms/components/CardSelection";
import { Flex } from "antd";
import { useCategoryById } from "../../../hooks/useCategories";

type IssueSelectionProps = CardSelectionProps & WithCategoryId;

const IssueSelection: React.FC<IssueSelectionProps> = ({
    categoryId,
    value,
    onChange,
}: IssueSelectionProps) => {
    const { data: category, isLoading } = useCategoryById(
        categoryId ? categoryId : "",
    );

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
