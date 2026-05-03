// Description: A React component that renders a table of materials with features such as filtering by category, displaying properties and descriptions in expandable rows, and providing actions for editing and deleting materials based on user access levels. It uses Ant Design components for the UI and integrates with API calls to manage materials.
import {
    Button,
    Flex,
    Popconfirm,
    Space,
    Table,
    TableProps,
    Tag,
    Tooltip,
} from "antd";

import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import type { Material, WithMaterials } from "../../types/material";
import MaterialForm from "../forms/MaterialForm";

import { useDeleteMaterialById } from "../../hooks/useMaterials";
import { checkAccess } from "../routing/HasAccess";
import { useAllCategories } from "../../hooks/useCategories";

const MaterialTable: React.FC<WithMaterials> = ({
    materials,
}: WithMaterials) => {
    const { data: categories } = useAllCategories();
    const { mutateAsync: deleteMaterialById } = useDeleteMaterialById();

    const updateColumns: TableProps["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            responsive: ["md"],
            width: "30%",
        },
        {
            title: "Short Name",
            dataIndex: "shortName",
            key: "shortName",
            width: "20%",
        },
        {
            title: "Category",
            key: "categoryId",
            dataIndex: "categoryId",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
            filters: categories?.map((category) => ({
                text: category.name,
                value: category.uuid,
            })),
            width: "20%",
            onFilter: (value, record) =>
                record.categoryId.indexOf((value as string).toLowerCase()) ===
                0,
            render: (category) =>
                category && (
                    <Flex justify="center">
                        <Tag
                            style={{ textTransform: "uppercase" }}
                            color={
                                categories?.find(
                                    (checkCategory) =>
                                        checkCategory.uuid === category,
                                )?.color || "geekblue"
                            }
                            key={category}
                        >
                            {
                                categories?.find(
                                    (checkCategory) =>
                                        checkCategory.uuid === category,
                                )?.name
                            }
                        </Tag>
                    </Flex>
                ),
        },
        {
            title: "Remote Print?",
            dataIndex: "remotePrintAvailable",
            key: "remotePrintAvailable",
            onHeaderCell: () => ({ style: { textAlign: "center" } }),
            width: "20%",
            render: (remotePrintAvailable) => {
                return (
                    <Flex justify="center">
                        {remotePrintAvailable ? (
                            <CheckOutlined />
                        ) : (
                            <CloseOutlined />
                        )}
                    </Flex>
                );
            },
        },

        ...(checkAccess(["admin", "moderator"])
            ? [
                  {
                      title: "Actions",
                      key: "action",
                      onHeaderCell: () => ({
                          style: { textAlign: "center" as const },
                      }),
                      width: "20%",
                      render: (material: Material) =>
                          material.uuid && (
                              <Flex justify="center" align="center" gap="small">
                                  <MaterialForm material={material} />

                                  <Tooltip title="Delete">
                                      <Popconfirm
                                          title="Delete Material"
                                          description="Are you sure to delete this material?"
                                          onConfirm={async () => {
                                              await deleteMaterialById({
                                                  materialId:
                                                      material.uuid || "",
                                              });
                                          }}
                                          okText="Yes"
                                          cancelText="No"
                                          placement="topRight"
                                      >
                                          <Button
                                              icon={<DeleteOutlined />}
                                              size="middle"
                                              shape="circle"
                                              danger
                                          />
                                      </Popconfirm>
                                  </Tooltip>
                              </Flex>
                          ),
                  },
              ]
            : []),
    ];
    const numRows = 5;
    return (
        <>
            <Table
                style={{ overflow: "auto" }}
                pagination={{
                    defaultPageSize: numRows,
                    hideOnSinglePage: true,
                }}
                columns={updateColumns}
                dataSource={materials}
                rowKey="uuid"
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
