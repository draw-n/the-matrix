import {
    Button,
    Popconfirm,
    Space,
    Table,
    TableProps,
    Tag,
    Tooltip,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Material } from "../../types/Material";
import MaterialForm from "../forms/MaterialForm";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { Category } from "../../types/Category";
import { checkAccess } from "../rbac/HasAccess";

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
    const [categories, setCategories] = useState<Category[]>();
    const deleteMaterial = async (_id: string) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/materials/${_id}`
            );
            setRefresh(refresh + 1);
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
                    key: item._id,
                }));
                setMaterials(formattedData);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }

            try {
                const response = await axios.get<Category[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`
                );
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [refresh]);

    const updateColumns: TableProps["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            responsive: ["md"],
        },
        {
            title: "Short Name",
            dataIndex: "shortName",
            key: "shortName",
        },
        {
            title: "Category",
            key: "category",
            dataIndex: "category",
            filters: categories?.map((category) => ({
                text: category.name,
                value: category._id,
            })),

            onFilter: (value, record) =>
                record.category.indexOf((value as string).toLowerCase()) === 0,
            render: (category) =>
                category && (
                    <Tag
                        style={{ textTransform: "uppercase" }}
                        color={
                            categories?.find(
                                (checkCategory) =>
                                    checkCategory._id === category
                            )?.color || "geekblue"
                        }
                        key={category}
                    >
                        {
                            categories?.find(
                                (checkCategory) =>
                                    checkCategory._id === category
                            )?.name
                        }
                    </Tag>
                ),
        },
        {
            title: "Remote Print?",
            dataIndex: "remotePrintAvailable",
            key: "remotePrintAvailable",

            render: (remotePrintAvailable) => {
                return remotePrintAvailable ? (
                    <CheckOutlined />
                ) : (
                    <CloseOutlined />
                );
            },
        },

        ...(checkAccess(["admin", "moderator"])
            ? [
                  {
                      title: "Actions",
                      key: "action",
                      render: (material: Material) =>
                          material._id && (
                              <Space>
                                  <MaterialForm
                                      onUpdate={() => setRefresh(refresh + 1)}
                                      material={material}
                                  />

                                  <Tooltip title="Delete">
                                      <Popconfirm
                                          title="Delete Material"
                                          description="Are you sure to delete this material?"
                                          onConfirm={() =>
                                              deleteMaterial(material._id)
                                          }
                                          okText="Yes"
                                          cancelText="No"
                                          placement="topRight"
                                      >
                                          <Button
                                              icon={<DeleteOutlined />}
                                              size="small"
                                              danger
                                          />
                                      </Popconfirm>
                                  </Tooltip>
                              </Space>
                          ),
                  },
              ]
            : []),
    ];
    const numRows = 5;
    return (
        <>
            <Table
                pagination={{
                    defaultPageSize: numRows,
                    hideOnSinglePage: true,
                }}
                columns={updateColumns}
                dataSource={materials}
                size="middle"
                expandable={{
                    expandedRowRender: (record) => (
                        <>
                            <p>
                                <b>Properties: </b>
                                {record.properties.join(", ")}
                            </p>
                            <p style={{ margin: 0 }}>
                                <b>Description: </b>
                                {record.description}
                            </p>
                        </>
                    ),
                    rowExpandable: (record) => record.description.length > 0,
                }}
            />
        </>
    );
};

export default MaterialTable;
