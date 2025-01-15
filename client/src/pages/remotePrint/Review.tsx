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
} from "antd";
import { Material } from "../../types/Material";
import { FilamentMoreSettings } from "../../types/Equipment";

interface ReviewProps {
    prev: () => void;
    material: Material | null;
    settingDetails: FilamentMoreSettings | null;
}

const Review: React.FC<ReviewProps> = ({
    prev,
    material,
    settingDetails,
}: ReviewProps) => {
    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: "Advanced Settings",
            children: (
                <Row>
                    <Col span={8}>
                        <h3>Supports</h3>
                        <p>{settingDetails?.supports}</p>
                    </Col>
                    <Col span={8}>
                        <h3>Vertical Shell</h3>
                        <p>
                            Perimeters:{" "}
                            {`${settingDetails?.verticalShell.perimeters}`}
                        </p>
                    </Col>
                    <Col span={8}>
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
                    <Col style={{ height: "100%" }} span={12}>
                        <Card style={{ height: "100%" }}>
                            <h3>File to be printed</h3>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <h3>Estimated Finish Times</h3>
                            <p>test</p>
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
                    <Button type="primary">Submit</Button>
                </Flex>
            </Space>
        </>
    );
};

export default Review;
