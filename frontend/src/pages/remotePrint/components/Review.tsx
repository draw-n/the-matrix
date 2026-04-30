// Description: Review component for summarizing and confirming 3D print job details before submission.
import { CaretLeftOutlined } from "@ant-design/icons";
import {
    Alert,
    Button,
    Card,
    Col,
    Collapse,
    CollapseProps,
    Flex,
    Row,
    Space,
    Table,
    Upload,
    UploadFile,
} from "antd";
import { WithMaterial } from "../../../types/material";
import { FilamentAdvancedSettings } from "../../../types/equipment";
import MeshViewer from "../../../components/meshViewer/MeshViewer";

interface ReviewProps extends WithMaterial {
    prev: () => void;
    uploadedFile: UploadFile[];
    settingDetails: FilamentAdvancedSettings | null;
    handleSubmit: () => void;
}

const Review: React.FC<ReviewProps> = ({
    prev,
    material,
    uploadedFile,
    settingDetails,
    handleSubmit,
}: ReviewProps) => {
    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: "Advanced Settings",
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8}>
                        <h2>Supports</h2>
                        <p>{settingDetails?.supports ? "Yes" : "No"}</p>
                    </Col>
                    <Col xs={24} lg={8}>
                        <h2>Vertical Shell</h2>
                        <p>
                            Perimeters:{" "}
                            {`${settingDetails?.verticalShell.perimeters}`}
                        </p>
                    </Col>
                    <Col xs={24} lg={8}>
                        <h2>Horizontal Shell</h2>
                        <Flex gap="10px">
                            <p>
                                Top Layers:{" "}
                                {`${settingDetails?.horizontalShell.topLayers},`}
                            </p>
                            <p>
                                Bottom Layers:{" "}
                                {`${settingDetails?.horizontalShell.bottomLayers}`}
                            </p>
                        </Flex>
                    </Col>
                    <Col span={24}>
                        <h2>Temperatures</h2>
                        <Table
                            style={{ overflow: "auto" }}
                            pagination={false}
                            dataSource={[
                                {
                                    key: "1",
                                    category: "Extruder",
                                    firstLayer: `${settingDetails?.temperatures.extruder.firstLayer} °C`,
                                    otherLayers: `${settingDetails?.temperatures.extruder.otherLayers} °C`,
                                },
                                {
                                    key: "2",
                                    category: "Bed",
                                    firstLayer: `${settingDetails?.temperatures.bed.firstLayer} °C`,
                                    otherLayers: `${settingDetails?.temperatures.bed.otherLayers} °C`,
                                },
                            ]}
                            columns={[
                                {
                                    title: "",
                                    dataIndex: "category",
                                    key: "category",
                                },
                                {
                                    title: "First Layer",
                                    dataIndex: "firstLayer",
                                    key: "firstLayer",
                                },
                                {
                                    title: "Other Layers",
                                    dataIndex: "otherLayers",
                                    key: "otherLayers",
                                },
                            ]}
                        />
                    </Col>
                </Row>
            ),
        },
    ];

    console.log("Review - Uploaded File:", uploadedFile);
    return (
        <>
            <Space vertical size="large" style={{ width: "100%" }}>
                <Alert
                    showIcon
                    title={
                        <span>
                            <span style={{ fontWeight: "bold" }}>Note:</span>{" "}
                            When your print is submitted, it will be added to
                            the print queue. We plan to eventually automate the
                            printing process, but for now, a staff member will
                            need to start your print manually, even if you are
                            first on the queue. Therefore, please allow some
                            time for your print to start after submission.
                        </span>
                    }
                    type="info"
                />
                <Card>
                    <Space vertical size="middle" style={{ width: "100%" }}>
                        <Flex style={{ width: "100%" }} justify="space-between">
                            <div>
                                <h2>Material</h2>
                                <p>
                                    {material &&
                                        `${material.name} (${material.shortName})`}
                                </p>
                            </div>
                            <div>
                                <h2>Density (Infill)</h2>
                                <p>{`${settingDetails?.infill}%`}</p>
                            </div>
                            <div>
                                <h2>Detail (Layer Height)</h2>
                                <p>{`${settingDetails?.layerHeight} mm`}</p>
                            </div>
                        </Flex>
                        <Collapse items={items} />
                    </Space>
                </Card>

                <Row gutter={20}>
                    <Col style={{ height: "100%" }} span={24}>
                        <Card style={{ height: "100%" }}>
                            <h2>File to be printed</h2>
                            <Upload
                                fileList={uploadedFile}
                                showUploadList={{
                                    showRemoveIcon: false,
                                    showPreviewIcon: true,
                                }}
                            />
                            <MeshViewer
                                file={uploadedFile[0]}
                                allowFaceSelection={false}
                            />
                        </Card>
                    </Col>
                </Row>

                <Flex justify="center" gap="10px">
                    <Button
                        onClick={prev}
                        icon={<CaretLeftOutlined />}
                        iconPlacement="start"
                    >
                        More Settings
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Flex>
            </Space>
        </>
    );
};

export default Review;
