import { CaretLeftFilled, CaretLeftOutlined } from "@ant-design/icons";
import {
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
import { useEffect } from "react";
import { Material } from "../../types/Material";
import { FilamentMoreSettings } from "../../types/Equipment";
import ConfirmAction from "../../components/ConfirmAction";
import ViewModel from "./components/ViewModel";

interface ReviewProps {
    prev: () => void;
    uploadedFile: UploadFile[];
    material: Material | null;
    settingDetails: FilamentMoreSettings | null;
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
                        <h3>Supports</h3>
                        <p>{settingDetails?.supports}</p>
                    </Col>
                    <Col xs={24} lg={8}>
                        <h3>Vertical Shell</h3>
                        <p>
                            Perimeters:{" "}
                            {`${settingDetails?.verticalShell.perimeters}`}
                        </p>
                    </Col>
                    <Col xs={24} lg={8}>
                        <h3>Horizontal Shell</h3>
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
                        <h3>Temperatures</h3>
                        <Table
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
    return (
        <>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                    >
                        <Flex style={{ width: "100%" }} justify="space-between">
                            <div>
                                <h3>Material</h3>
                                <p>
                                    {material &&
                                        `${material.name} (${material.shortName})`}
                                </p>
                            </div>
                            <div>
                                <h3>Density (Infill)</h3>
                                <p>{`${settingDetails?.infill}%`}</p>
                            </div>
                            <div>
                                <h3>Detail (Layer Height)</h3>
                                <p>{`${settingDetails?.layerHeight} mm`}</p>
                            </div>
                        </Flex>
                        <Collapse items={items} />
                    </Space>
                </Card>

                <Row gutter={20}>
                    <Col style={{ height: "100%" }} span={24}>
                        <Card style={{ height: "100%" }}>
                            <h3>File to be printed</h3>
                            <Upload
                                fileList={uploadedFile}
                                showUploadList={{
                                    showRemoveIcon: false,
                                    showPreviewIcon: true,
                                }}
                                customRequest={({ file, onSuccess }) => {
                                    // Simulating file upload
                                }}
                            >
                                {/* The button won't be visible, and the upload list will still be shown */}
                            </Upload>
                        </Card>
                    </Col>
                </Row>

                <Flex justify="center" gap="10px">
                    <Button
                        onClick={prev}
                        icon={<CaretLeftOutlined />}
                        iconPosition="start"
                    >
                        More Settings
                    </Button>
                    <ConfirmAction
                        actionSuccess={handleSubmit}
                        title="Confirm Bed Clear"
                        headlineText="Check the live webcam below."
                        confirmText="Is the bed clear? If not, please select cancel and try again at another time."
                        target={<Button type="primary">Submit</Button>}
                    >
                        <div id="camera-iframe-container">
                            <iframe
                                id="camera-iframe"
                                src={import.meta.env.VITE_CAMERA_URL}
                            />
                        </div>
                    </ConfirmAction>
                </Flex>
            </Space>
        </>
    );
};

export default Review;
