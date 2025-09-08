import {
    Button,
    Col,
    Flex,
    InputNumber,
    Row,
    Select,
    Space,
    Switch,
} from "antd";
import { FilamentMoreSettings } from "../../../types/Equipment";
import { Material } from "../../../types/Material";
import { CaretDownFilled, RedoOutlined } from "@ant-design/icons";

interface AdvancedSettingsProps {
    settingDetails: FilamentMoreSettings;
    setSettingDetails: (item: FilamentMoreSettings) => void;
    material: Material | null;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
    settingDetails,
    setSettingDetails,
    material,
}: AdvancedSettingsProps) => {
    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="large">
                <Flex gap="25px" align="center" style={{ width: "100%" }}>
                    <h3>Supports</h3>
                    <Switch
                        checked={settingDetails.supports}
                        onChange={(checked) =>
                            setSettingDetails({
                                ...settingDetails,
                                supports: checked,
                            })
                        }
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
                                    min={
                                        (material?.temperatures?.extruder
                                            .firstLayer || 210) - 10
                                    }
                                    max={
                                        (material?.temperatures?.extruder
                                            .firstLayer || 210) + 10
                                    }
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
                                <Button
                                    onClick={() =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                extruder: {
                                                    ...settingDetails
                                                        .temperatures.extruder,
                                                    firstLayer:
                                                        material?.temperatures
                                                            ?.extruder
                                                            .firstLayer ||
                                                        settingDetails
                                                            .temperatures
                                                            .extruder
                                                            .firstLayer,
                                                },
                                            },
                                        })
                                    }
                                    icon={<RedoOutlined />}
                                />
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end">
                                <p>Other layers:</p>
                                <InputNumber
                                    min={
                                        (material?.temperatures?.extruder
                                            .otherLayers || 210) - 10
                                    }
                                    max={
                                        (material?.temperatures?.extruder
                                            .otherLayers || 210) + 10
                                    }
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
                                <Button
                                    onClick={() =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                extruder: {
                                                    ...settingDetails
                                                        .temperatures.extruder,
                                                    otherLayers:
                                                        material?.temperatures
                                                            ?.extruder
                                                            .otherLayers ||
                                                        settingDetails
                                                            .temperatures
                                                            .extruder
                                                            .otherLayers,
                                                },
                                            },
                                        })
                                    }
                                    icon={<RedoOutlined />}
                                />
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <p>Bed</p>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end" align="center">
                                <p>First layer:</p>
                                <InputNumber
                                    min={
                                        (material?.temperatures?.bed
                                            .firstLayer || 65) - 10
                                    }
                                    max={
                                        (material?.temperatures?.bed
                                            .firstLayer || 65) + 10
                                    }
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
                                <Button
                                    onClick={() =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                bed: {
                                                    ...settingDetails
                                                        .temperatures.bed,
                                                    firstLayer:
                                                        material?.temperatures
                                                            ?.bed.firstLayer ||
                                                        settingDetails
                                                            .temperatures.bed
                                                            .firstLayer,
                                                },
                                            },
                                        })
                                    }
                                    icon={<RedoOutlined />}
                                />
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <Flex gap="10px" justify="end" align="center">
                                <p>Other layers:</p>
                                <InputNumber
                                    min={
                                        (material?.temperatures?.bed
                                            .otherLayers || 65) - 10
                                    }
                                    max={
                                        (material?.temperatures?.bed
                                            .otherLayers || 65) + 10
                                    }
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
                                <Button
                                    onClick={() =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            temperatures: {
                                                ...settingDetails.temperatures,
                                                bed: {
                                                    ...settingDetails
                                                        .temperatures.bed,
                                                    otherLayers:
                                                        material?.temperatures
                                                            ?.bed.otherLayers ||
                                                        settingDetails
                                                            .temperatures.bed
                                                            .otherLayers,
                                                },
                                            },
                                        })
                                    }
                                    icon={<RedoOutlined />}
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
                                <Button
                                    onClick={() =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            horizontalShell: {
                                                ...settingDetails.horizontalShell,
                                                topLayers: 3,
                                            },
                                        })
                                    }
                                    icon={<RedoOutlined />}
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
                                <Button
                                    onClick={() =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            horizontalShell: {
                                                ...settingDetails.horizontalShell,
                                                bottomLayers: 3,
                                            },
                                        })
                                    }
                                    icon={<RedoOutlined />}
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
                                <Button
                                    onClick={() =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            verticalShell: {
                                                ...settingDetails.horizontalShell,
                                                perimeters: 3,
                                            },
                                        })
                                    }
                                    icon={<RedoOutlined />}
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
