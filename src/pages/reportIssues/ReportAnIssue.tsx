// Description: ReportAnIssue component for guiding users through the multi-step issue reporting process.

import { useAuth } from "../../contexts/AuthContext";

import { Button, Flex } from "antd";
import CategorySelection from "./components/CategorySelection";
import { useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import EquipmentSelection from "./components/EquipmentSelection";
import Description from "./components/Description";
import IssueSelection from "./components/IssueSelection";
import MoreDetails from "./components/MoreDetails";
import SubmittedIssue from "./components/SubmittedIssue";
import { useCreateIssue } from "../../hooks/useIssues";

const ReportAnIssue: React.FC = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [equipmentId, setEquipmentId] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [initialDescription, setInitialDescription] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const { mutateAsync: createIssue } = useCreateIssue();

    const { user } = useAuth();

    const onFinish = async () => {
        const newIssue = {
            equipmentId,
            categoryId,
            description: initialDescription + "\n" + description,
            createdBy: user?.uuid,
            dateCreated: new Date(),
        };
        await createIssue({ newIssue });

        setEquipmentId("");
        setCategoryId("");
        setInitialDescription("");
        setDescription("");
        setStepIndex(stepIndex + 1);
    };

    const renderStep = () => {
        switch (stepIndex) {
            case 0:
                return <Description />;
            case 1:
                return (
                    <CategorySelection
                        value={categoryId}
                        onChange={setCategoryId}
                    />
                );
            case 2:
                return (
                    <EquipmentSelection
                        categoryId={categoryId}
                        value={equipmentId}
                        onChange={setEquipmentId}
                    />
                );
            case 3:
                return (
                    <IssueSelection
                        categoryId={categoryId}
                        value={initialDescription}
                        onChange={setInitialDescription}
                    />
                );
            case 4:
                return (
                    <MoreDetails
                        value={description}
                        onChange={setDescription}
                    />
                );
            case 5:
                return <SubmittedIssue refreshForm={() => setStepIndex(0)} />;

            default:
                return null;
        }
    };

    return (
        <Flex
            justify="center"
            align="center"
            vertical
            style={{ height: "80vh" }}
        >
            {renderStep()}
            <Flex
                style={{ marginTop: 20 }}
                justify="center"
                align="center"
                gap="small"
            >
                {stepIndex > 0 && stepIndex < 5 && (
                    <Button
                        variant="filled"
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        iconPosition="start"
                        onClick={() => setStepIndex(Math.max(stepIndex - 1, 0))}
                    >
                        Back
                    </Button>
                )}
                {stepIndex < 4 && (
                    <Button
                        variant="filled"
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        onClick={() => setStepIndex(Math.min(stepIndex + 1, 5))}
                    >
                        Next
                    </Button>
                )}
                {stepIndex === 4 && (
                    <Button
                        variant="filled"
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        onClick={onFinish}
                    >
                        Submit
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

export default ReportAnIssue;
