import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import axios from "axios";
import { useState } from "react";

import { Button, Flex } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import StatusSelection from "./components/StatusSelection";
import GradYearSelection from "./components/GradYearSelection";
import DepartmentSelect from "./components/DepartmentSelect";


const FirstTime: React.FC = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [status, setStatus] = useState<string>();
    const [graduationYear, setGraduationYear] = useState<string | undefined>();
    const [departments, setDepartments] = useState<string[]>([]);

    const navigate = useNavigate();

    const { user, refreshUser } = useAuth();

    if (
        user &&
        user.status &&
        user.departments &&
        user.departments.length > 0
    ) {
        navigate("/");
    }

    const renderStep = () => {
        switch (stepIndex) {
            case 0:
                return <StatusSelection value={status} onChange={setStatus} />;
            case 1:
                if (status === "faculty") {
                    setStepIndex(2);
                    return null;
                }
                return (
                    <GradYearSelection
                        value={graduationYear}
                        onChange={setGraduationYear}
                    />
                );
            case 2:
                return (
                    <DepartmentSelect
                        value={departments}
                        onChange={setDepartments}
                    />
                );

            default:
                return null;
        }
    };

    const onFinish = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/first-time`,
                { status, graduationYear, departments },
            );
            await refreshUser();
            navigate("/");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: "100vh", width: "100%" }}
            flex="1"
            vertical
        >
            {renderStep()}
            <Flex
                style={{ marginTop: 20 }}
                justify="center"
                align="center"
                gap="small"
            >
                {stepIndex > 0 && (
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
                {stepIndex < 2 && (
                    <Button
                        variant="filled"
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        onClick={() => setStepIndex(Math.min(stepIndex + 1, 2))}
                    >
                        Next
                    </Button>
                )}
                {stepIndex === 2 && (
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

export default FirstTime;
