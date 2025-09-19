import { Card, Flex, Space } from "antd";
import MaterialForm from "../../components/forms/MaterialForm";
import HasAccess from "../../components/rbac/HasAccess";
import MaterialTable from "../../components/tables/MaterialTable";

const MaterialTab: React.FC = () => {
    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>MATERIALS</h2>
                <HasAccess roles={["admin", "moderator"]}>
                    <MaterialForm onUpdate={() => {}} />
                </HasAccess>
            </Flex>
            <MaterialTable refresh={0} setRefresh={() => {}} />
        </Space>
    );
};

export default MaterialTab;
