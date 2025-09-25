import { Card, Flex, Space } from "antd";
import MaterialForm from "../../components/forms/MaterialForm";
import HasAccess from "../../components/rbac/HasAccess";
import IssueTable from "../../components/tables/IssueTable";
import CreateIssueForm from "../../components/forms/CreateIssueForm";

const IssueTab: React.FC = () => {
    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>ISSUES</h2>
                <CreateIssueForm />
            </Flex>
            <IssueTable refresh={0} setRefresh={() => {}} />
        </Space>
    );
};

export default IssueTab;
