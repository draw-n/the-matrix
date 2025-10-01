import { Card, Flex, Space } from "antd";
import MaterialForm from "../../components/forms/MaterialForm";
import HasAccess from "../../components/rbac/HasAccess";
import IssueTable from "../../components/tables/IssueTable";
import CreateIssueForm from "../../components/forms/CreateIssueForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { Issue } from "../../types/Issue";

const IssueTab: React.FC = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [equipmentFilter, setEquipmentFilter] = useState<string>("");
    const fetchData = async () => {
        try {
            let response;

            if (equipmentFilter) {
                response = await axios.get<Issue[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/issues?status=open,in-progress,completed&equipment=${equipmentFilter}`
                );
            } else {
                response = await axios.get<Issue[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/issues`
                );
            }

            let formattedData = response.data.map((item) => ({
                ...item,
                key: item._id, // or item.id if you have a unique identifier
            }));

            setIssues(formattedData);
        } catch (error) {
            console.error("Fetching updates or issues failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [equipmentFilter]);

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ISSUES</h2>
                <CreateIssueForm onUpdate={fetchData} />
            </Flex>
            <IssueTable refreshTable={fetchData} issues={issues} />
        </Space>
    );
};

export default IssueTab;
