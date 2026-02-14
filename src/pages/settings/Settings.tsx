// Description: App settings, only available to admins

import { Space, Form, Tabs, TabsProps } from "antd";
import Categories from "./components/Categories";
import AccessCodes from "./components/AccessCodes";

const Settings: React.FC = () => {

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Access Codes",
            children: <AccessCodes />,
        },
        {
            key: "2",
            label: "Categories",
            children: <Categories />,
        },
    ];

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Tabs tabPosition="left" items={items} />
            </Space>
        </>
    );
};

export default Settings;
