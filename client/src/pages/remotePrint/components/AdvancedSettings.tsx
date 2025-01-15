import { Col, Flex, InputNumber, Row, Select, Space } from "antd";
import { FilamentMoreSettings } from "../../../types/Equipment";

interface AdvancedSettingsProps {
    settingDetails: FilamentMoreSettings;
    setSettingDetails: (item: FilamentMoreSettings) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
    settingDetails,
    setSettingDetails,
}: AdvancedSettingsProps) => {
    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="large">
                <Flex gap="25px" align="center" style={{ width: "100%" }}>
                    <h3>Supports</h3>
                    <Select
                        style={{ width: "100%" }}
                        value={settingDetails.supports}
                        onChange={(value) =>
                            setSettingDetails({
                                ...settingDetails,
                                supports: value,
                            })
                        }
                        options={[
                            { value: "none", label: "None" },
                            {
                                value: "plate-only",
                                label: "Support on build plate only",
                            },
                            {
                                value: "enforcers-only",
                                label: "For support enforcers only",
                            },
                            { value: "everywhere", label: "Everywhere" },
                        ]}
                    />
                </Flex>
                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                >
                    <h3>Temperatures</h3>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <p>Extruder</p>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>First layer:</p>
                                <InputNumber
                                    value={
                                        settingDetails.temperatures.extruder
                                            .firstLayer
                                    }
                                    formatter={(value) => `${value} °C`}
                                    parser={(value) =>
                                        value?.replace(
                                            " °C",
                                            ""
                                        ) as unknown as number
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                extruder: {
                                                    ...settingDetails
                                                        .temperatures.extruder,
                                                    firstLayer:
                                                        value ||
                                                        settingDetails
                                                            .temperatures
                                                            .extruder
                                                            .firstLayer,
                                                },
                                            },
                                        })
                                    }
                                />
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>Other layers:</p>
                                <InputNumber
                                    value={
                                        settingDetails.temperatures.extruder
                                            .otherLayers
                                    }
                                    formatter={(value) => `${value} °C`}
                                    parser={(value) =>
                                        value?.replace(
                                            " °C",
                                            ""
                                        ) as unknown as number
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                extruder: {
                                                    ...settingDetails
                                                        .temperatures.extruder,
                                                    otherLayers:
                                                        value ||
                                                        settingDetails
                                                            .temperatures
                                                            .extruder
                                                            .otherLayers,
                                                },
                                            },
                                        })
                                    }
                                />
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <p>Bed</p>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>First layer:</p>
                                <InputNumber
                                    value={
                                        settingDetails.temperatures.bed
                                            .firstLayer
                                    }
                                    formatter={(value) => `${value} °C`}
                                    parser={(value) =>
                                        value?.replace(
                                            " °C",
                                            ""
                                        ) as unknown as number
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                bed: {
                                                    ...settingDetails
                                                        .temperatures.bed,
                                                    firstLayer:
                                                        value ||
                                                        settingDetails
                                                            .temperatures.bed
                                                            .firstLayer,
                                                },
                                            },
                                        })
                                    }
                                />
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>Other layers:</p>
                                <InputNumber
                                    value={
                                        settingDetails.temperatures.bed
                                            .otherLayers
                                    }
                                    formatter={(value) => `${value} °C`}
                                    parser={(value) =>
                                        value?.replace(
                                            " °C",
                                            ""
                                        ) as unknown as number
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                bed: {
                                                    ...settingDetails
                                                        .temperatures.bed,
                                                    otherLayers:
                                                        value ||
                                                        settingDetails
                                                            .temperatures.bed
                                                            .otherLayers,
                                                },
                                            },
                                        })
                                    }
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Space>
                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                >
                    <h3>Shell</h3>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <p>Horizontal Shell</p>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>Top layers: </p>
                                <InputNumber
                                    value={
                                        settingDetails.horizontalShell.topLayers
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            horizontalShell: {
                                                ...settingDetails.horizontalShell,
                                                topLayers:
                                                    value ||
                                                    settingDetails
                                                        .horizontalShell
                                                        .topLayers,
                                            },
                                        })
                                    }
                                />
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>Bottom layers: </p>
                                <InputNumber
                                    value={
                                        settingDetails.horizontalShell
                                            .bottomLayers
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            horizontalShell: {
                                                ...settingDetails.horizontalShell,
                                                bottomLayers:
                                                    value ||
                                                    settingDetails
                                                        .horizontalShell
                                                        .bottomLayers,
                                            },
                                        })
                                    }
                                />
                            </Flex>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <p>Vertical Shell</p>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>Perimeters: </p>
                                <InputNumber
                                    value={
                                        settingDetails.verticalShell.perimeters
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            verticalShell: {
                                                perimeters:
                                                    value ||
                                                    settingDetails.verticalShell
                                                        .perimeters,
                                            },
                                        })
                                    }
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Space>
            </Space>
        </>
    );
};

export default AdvancedSettings;
