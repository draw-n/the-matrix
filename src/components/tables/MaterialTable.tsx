import axios from "axios";
import { useEffect, useState } from "react";

import {
    Button,
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

import { deleteMaterial } from "../../api/material";
import { checkAccess } from "../rbac/HasAccess";
import { useAllCategories } from "../../hooks/category";
import { CommonTableProps } from "../../types/common";

type MaterialTableProps = WithMaterials & CommonTableProps;

const MaterialTable: React.FC<MaterialTableProps> = ({
    refresh,
    materials,
}: MaterialTableProps) => {
    const { data: categories } = useAllCategories();

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
            key: "categoryId",
            dataIndex: "categoryId",
            filters: categories?.map((category) => ({
                text: category.name,
                value: category.uuid,
            })),

            onFilter: (value, record) =>
                record.categoryId.indexOf((value as string).toLowerCase()) === 0,
            render: (category) =>
                category && (
                    <Tag
                        style={{ textTransform: "uppercase" }}
                        color={
                            categories?.find(
                                (checkCategory) =>
                                    checkCategory.uuid === category
                            )?.color || "geekblue"
                        }
                        key={category}
                    >
                        {
                            categories?.find(
                                (checkCategory) =>
                                    checkCategory.uuid === category
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
                          material.uuid && (
                              <Space>
                                  <MaterialForm
                                      onSubmit={refresh}
                                      material={material}
                                  />

                                  <Tooltip title="Delete">
                                      <Popconfirm
                                          title="Delete Material"
                                          description="Are you sure to delete this material?"
                                          onConfirm={() => {
                                              deleteMaterial(
                                                  material.uuid
                                              ).then(() => {
                                                  refresh && refresh();
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
