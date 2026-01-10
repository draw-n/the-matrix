// Description: IssueTab component for managing and displaying issues.

import { useEffect, useState } from "react";
import axios from "axios";
import { Flex, Space } from "antd";

import { Issue } from "../../types/issue";
import IssueTable from "../../components/tables/IssueTable";
import CreateIssueForm from "../../components/forms/CreateIssueForm";
import { useAllIssues } from "../../hooks/issue";

const IssueTab: React.FC = () => {
    const [equipmentFilter, setEquipmentFilter] = useState<string>("");
    const {data: issues, refetch} = useAllIssues(
        equipmentFilter ? ["open", "in-progress", "completed"] : undefined,
        equipmentFilter ? equipmentFilter : undefined
    );

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ISSUES</h2>
                <CreateIssueForm onUpdate={refetch} />
            </Flex>
            <IssueTable refreshTable={refetch} issues={issues} />
        </Space>
    );
};

export default IssueTab;
