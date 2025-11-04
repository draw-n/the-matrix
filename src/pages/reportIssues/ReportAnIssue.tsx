import { Button, Flex, Form, FormProps, Space } from "antd";
import NotFound from "../../components/NotFound";
import CreateIssueForm from "../../components/forms/CreateIssueForm";
import CategorySelection from "./CategorySelection";
import { useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import EquipmentSelection from "./EquipmentSelection";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext";
import Description from "./Description";
import IssueSelection from "./IssueSelection";
import MoreDetails from "./MoreDetails";
import SubmittedIssue from "./SubmittedIssue";

const ReportAnIssue: React.FC = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [equipment, setEquipment] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [initialDescription, setInitialDescription] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const { user } = useAuth();

    const onFinish = async () => {
        try {
            const newIssue = {
                equipment,
                category,
                description: initialDescription + "\n" + description,
                createdBy: user?._id,
                dateCreated: new Date(),
            };
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/issues`,
                newIssue
            );
            setEquipment("");
            setCategory("");
            setInitialDescription("");
            setDescription("");
            setStepIndex(stepIndex + 1);
        } catch (error) {
            console.error("Problem creating an issue: ", error);
        }
    };

    const renderStep = () => {
        switch (stepIndex) {
            case 0:
                return <Description />;
            case 1:
                return (
                    <CategorySelection
                        value={category}
                        onChange={setCategory}
                    />
                );
            case 2:
                return (
                    <EquipmentSelection
                        category={category}
                        value={equipment}
                        onChange={setEquipment}
                    />
                );
            case 3:
                return (
                    <IssueSelection
                        categoryId={category}
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
                {stepIndex > 0 && stepIndex < 4 && (
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
                        onClick={() => setStepIndex(Math.min(stepIndex + 1, 4))}
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
