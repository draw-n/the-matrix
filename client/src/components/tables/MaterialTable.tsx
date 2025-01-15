import { Button, Space, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Material } from "../../types/Material";
import EditMaterialForm from "../forms/EditMaterialForm";

interface TableMaterial extends Material {
    key: string;
}

interface MaterialTableProps {
    refresh: number;
    setRefresh: (numValue: number) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
    refresh,
    setRefresh,
}: MaterialTableProps) => {
    const [materials, setMaterials] = useState<TableMaterial[]>([]);

    const deleteMaterial = async (_id: string) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/materials/${_id}`
            );
            // Update the state to remove the deleted equipment
            setMaterials(materials.filter((material) => material._id !== _id));
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<Material[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/materials`
                );

                const formattedData = responseUpdates.data.map((item) => ({
                    ...item,
                    key: item._id, // or item.id if you have a unique identifier
                }));
                setMaterials(formattedData);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };
        fetchData();
    }, [refresh]);

    const updateColumns: TableProps["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Short Name",
            dataIndex: "shortName",
            key: "shortName",
        },
        {
            title: "Properties",
            dataIndex: "properties",
            key: "properties",
        },
        {
            title: "Remote Print?",
            dataIndex: "remotePrintAvailable",
            key: "remotePrintAvailable",
        },
        {
            title: "Type",
            key: "type",
            dataIndex: "type",
            filters: [
                {
                    text: "Filament",
                    value: "filament",
                },
                {
                    text: "Resin",
                    value: "resin",
                },
                {
                    text: "Powder",
                    value: "powder",
                },
            ],
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value, record) =>
                record.type.indexOf(value as string) === 0,
            render: (type) =>
                type && (
                    <Tag color={"blue"} key={type}>
                        {type.toUpperCase()}
                    </Tag>
                ),
        },
        {
            title: "Action",
            key: "action",
            render: (material) =>
                material._id && (
                    <Space>
                        <EditMaterialForm
                            onUpdate={() => setRefresh(refresh + 1)}
                            material={material}
                        />
                        <Button
                            className="secondary-button-outlined"
                            onClick={() => deleteMaterial(material._id)}
                        >
                            Delete
                        </Button>
                    </Space>
                ),
        },
    ];
    const numRows = 5;
    return (
        <>
            <Table
                pagination={{
                    pageSize: numRows, // Set the number of rows per page
                }}
                columns={updateColumns}
                dataSource={materials}
                size="middle"
                expandable={{
                    expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                    ),
                    rowExpandable: (record) => record.description.length > 0,
                }}
            />
        </>
    );
};

export default MaterialTable;
