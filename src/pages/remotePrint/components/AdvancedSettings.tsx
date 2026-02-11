// Description: Advanced settings component for remote printing, allowing users to configure filament settings.

import { Button, Col, Flex, InputNumber, Row, Space, Switch } from "antd";

import { RedoOutlined } from "@ant-design/icons";

import type { FilamentAdvancedSettings } from "../../../types/equipment";
import type {  WithMaterial } from "../../../types/material";

interface AdvancedSettingsProps extends WithMaterial {
    settingDetails: FilamentAdvancedSettings;
    setSettingDetails: (item: FilamentAdvancedSettings) => void;
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

                    {/**
                     * Render temperature groups (extruder, bed) using a small descriptor array.
                     * Each group renders three columns: label, first layer input, other layers input.
                     */}
                    <Row gutter={[16, 16]}>
                        {[
                            {
                                key: "extruder",
                                label: "Extruder",
                                defaults: {
                                    firstLayer:
                                        material?.temperatures?.extruder
                                            ?.firstLayer ?? 210,
                                    otherLayers:
                                        material?.temperatures?.extruder
                                            ?.otherLayers ?? 210,
                                },
                            },
                            {
                                key: "bed",
                                label: "Bed",
                                defaults: {
                                    firstLayer:
                                        material?.temperatures?.bed
                                            ?.firstLayer ?? 65,
                                    otherLayers:
                                        material?.temperatures?.bed
                                            ?.otherLayers ?? 65,
                                },
                            },
                        ].map((group) => {
                            const key = group.key as "extruder" | "bed";
                            const typedKey =
                                key as keyof typeof settingDetails.temperatures;
                            const values = settingDetails.temperatures[
                                typedKey
                            ] as any;

                            return (
                                <>
                                    <Col xs={24} lg={8} key={`${key}-label`}>
                                        <p>{group.label}</p>
                                    </Col>

                                    <Col xs={24} lg={8} key={`${key}-first`}>
                                        <Flex gap="10px" justify="end">
                                            <p>First layer:</p>
                                            <InputNumber
                                                min={
                                                    group.defaults.firstLayer -
                                                    10
                                                }
                                                max={
                                                    group.defaults.firstLayer +
                                                    10
                                                }
                                                value={values.firstLayer}
                                                formatter={(value) =>
                                                    `${value} °C`
                                                }
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
                                                            [typedKey]: {
                                                                ...settingDetails
                                                                    .temperatures[
                                                                    typedKey
                                                                ],
                                                                firstLayer:
                                                                    (value as number) ??
                                                                    settingDetails
                                                                        .temperatures[
                                                                        typedKey
                                                                    ]
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
                                                            [typedKey]: {
                                                                ...settingDetails
                                                                    .temperatures[
                                                                    typedKey
                                                                ],
                                                                firstLayer:
                                                                    group
                                                                        .defaults
                                                                        .firstLayer ||
                                                                    settingDetails
                                                                        .temperatures[
                                                                        typedKey
                                                                    ]
                                                                        .firstLayer,
                                                            },
                                                        },
                                                    })
                                                }
                                                icon={<RedoOutlined />}
                                            />
                                        </Flex>
                                    </Col>

                                    <Col span={8} key={`${key}-other`}>
                                        <Flex gap="10px" justify="end">
                                            <p>Other layers:</p>
                                            <InputNumber
                                                min={
                                                    group.defaults.otherLayers -
                                                    10
                                                }
                                                max={
                                                    group.defaults.otherLayers +
                                                    10
                                                }
                                                value={values.otherLayers}
                                                formatter={(value) =>
                                                    `${value} °C`
                                                }
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
                                                            [typedKey]: {
                                                                ...settingDetails
                                                                    .temperatures[
                                                                    typedKey
                                                                ],
                                                                otherLayers:
                                                                    (value as number) ??
                                                                    settingDetails
                                                                        .temperatures[
                                                                        typedKey
                                                                    ]
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
                                                            [typedKey]: {
                                                                ...settingDetails
                                                                    .temperatures[
                                                                    typedKey
                                                                ],
                                                                otherLayers:
                                                                    group
                                                                        .defaults
                                                                        .otherLayers ||
                                                                    settingDetails
                                                                        .temperatures[
                                                                        typedKey
                                                                    ]
                                                                        .otherLayers,
                                                            },
                                                        },
                                                    })
                                                }
                                                icon={<RedoOutlined />}
                                            />
                                        </Flex>
                                    </Col>
                                </>
                            );
                        })}
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
                                    min={0}
                                    value={
                                        settingDetails.horizontalShell.topLayers
                                    }
                                    onChange={(value) =>
                                        setSettingDetails({
                                            ...settingDetails,
                                            horizontalShell: {
                                                ...settingDetails.horizontalShell,
                                                topLayers:
                                                    value ??
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
                                    min={0}
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
                                                    value ??
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
