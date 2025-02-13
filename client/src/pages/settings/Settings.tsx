import { Input, Space } from "antd";
import Categories from "./Categories";

const Settings: React.FC = () => {
    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <h1>Settings</h1>
                <p>Access Code for Digital Fabrication</p>
                <Input />

                <h2>Categories and Common Issues</h2>
                <Categories />
            </Space>
        </>
    );
};

export default Settings;
