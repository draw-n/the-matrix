// Description: App settings, only available to admins

import { Space, Form, Tabs, TabsProps } from "antd";
import Categories from "./components/Categories";
import AccessCodes from "./components/AccessCodes";
import OfficeHours from "./components/OfficeHours";
import { useEffect, useState } from "react";

const Settings: React.FC = () => {
    const [activeKey, setActiveKey] = useState("access-codes");

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");

        if (hash) {
            setActiveKey(hash);
        }
    }, []);

    const handleChange = (key: string) => {
        setActiveKey(key);

        window.history.replaceState(null, "", `#${key}`);
    };

    const items: TabsProps["items"] = [
        {
            key: "access-codes",
            label: "Access Codes",
            children: <AccessCodes />,
        },
        {
            key: "categories",
            label: "Categories",
            children: <Categories />,
        },
        {
            key: "office-hours",
            label: "Office Hours",
            children: <OfficeHours />,
        },
    ];

    return (
        <>
            <Space style={{ width: "100%" }} vertical size="middle">
                <Tabs
                    activeKey={activeKey}
                    onChange={handleChange}
                    tabPlacement="start"
                    items={items}
                />
            </Space>
        </>
    );
};

export default Settings;
