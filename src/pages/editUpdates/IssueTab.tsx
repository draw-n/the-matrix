// Description: IssueTab component for managing and displaying issues.

import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Flex, Space } from "antd";

import { Issue } from "../../types/issue";
import IssueTable from "../../components/tables/IssueTable";
import { useAllIssues } from "../../hooks/issue";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { useNavigate } from "react-router-dom";

const IssueTab: React.FC = () => {
    const [equipmentFilter, setEquipmentFilter] = useState<string>("");
    const { data: issues, refetch } = useAllIssues(
        equipmentFilter ? ["open", "in-progress", "completed"] : undefined,
        equipmentFilter ? equipmentFilter : undefined,
    );

    const navigate = useNavigate();

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ISSUES</h2>
                <Button
                    type="primary"
                    size="middle"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/report")}
                    iconPosition="end"
                    shape={"round"}
                >
                    Add New Issue
                </Button>
            </Flex>
            <IssueTable refresh={refetch} issues={issues} />
        </Space>
    );
};

export default IssueTab;
