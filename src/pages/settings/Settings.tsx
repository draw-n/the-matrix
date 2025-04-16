import { Input, Space, Form } from "antd";
import Categories from "./Categories";
import AccessCodes from "./AccessCodes";

const Settings: React.FC = () => {
    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <h1>Settings</h1>
                <h2>Edit Access Codes</h2>
                <AccessCodes />

                <h2>Categories and Common Issues</h2>
                <Categories />
            </Space>
        </>
    );
};

export default Settings;
