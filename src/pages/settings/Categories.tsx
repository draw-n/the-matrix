// Description: Categories component for managing and editing categories in the settings page.

import React, { useEffect, useRef, useState } from "react";
import { Space, Tabs } from "antd";
import CategoryForm from "../../components/forms/CategoryForm";
import EditCategory from "./EditCategory";

import { useAllCategories } from "../../hooks/category";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
    {
        label: "None",
        children: <p>No categories available.</p>,
        key: "1",
        closable: false,
    },
];

const Categories: React.FC = () => {
    const [activeKey, setActiveKey] = useState("0");
    const [items, setItems] = useState(initialItems);
    const { data: categories, refetch } = useAllCategories();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    useEffect(() => {
        if (!categories || categories.length === 0) {
            setItems(initialItems);
            return;
        }
        const formattedData = categories.map(
            (category: any, index: number) => ({
                label: category.name,
                children: <EditCategory category={category} />,
                key: String(index),
                closable: false,
            }),
        );
        setItems(formattedData);
    }, [categories]);

    const add = () => {
        setIsModalOpen(true);
        // const newActiveKey = `newTab${newTabIndex.current++}`;
        // const newPanes = [...items];
        // newPanes.push({
        //     label: "New Tab",
        //     children: "Content of new Tab",
        //     key: newActiveKey,
        //     closable: false
        // });
        // setItems(newPanes);
        // setActiveKey(newActiveKey);
    };

    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: "add" | "remove",
    ) => {
        if (action === "add") {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <Space size="middle" direction="vertical" style={{ width: "100%" }}>
            <h2>CATEGORIES</h2>
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={items}
            />
            <CategoryForm
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
            />
        </Space>
    );
};

export default Categories;
