import { Card, Flex } from "antd";
import MaterialForm from "../../components/forms/MaterialForm";
import HasAccess from "../../components/rbac/HasAccess";
import MaterialTable from "../../components/tables/MaterialTable";

const MaterialTab: React.FC = () => {
    return (
        <Card>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>Materials</h2>
                <HasAccess roles={["admin", "moderator"]}>
                    <MaterialForm onUpdate={() => {}} />
                </HasAccess>
            </Flex>

            <MaterialTable refresh={0} setRefresh={() => {}} />
        </Card>
    );
};

export default MaterialTab;
