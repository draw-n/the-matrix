// Description: App settings, only available to admins

import { Space, Form, Tabs, TabsProps } from "antd";
import Categories from "./components/Categories";
import AccessCodes from "./components/AccessCodes";
import OfficeHours from "./components/OfficeHours";

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
        {
            key: "3",
            label: "Office Hours",
            children: <OfficeHours />,
        }
    ];

    return (
        <>
            <Space style={{ width: "100%" }} vertical size="middle">
                <Tabs tabPlacement="start" items={items} />
            </Space>
        </>
    );
};

export default Settings;
