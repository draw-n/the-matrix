// Description: MoreSettings component for configuring additional 3D printing settings such as infill density and layer height.

import HasAccess from "../../components/rbac/HasAccess";

import {
    Button,
    Collapse,
    Flex,
    Slider,
    Space,
    type CollapseProps,
    type InputNumberProps,
} from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

import AdvancedSettings from "./components/AdvancedSettings";
import type { FilamentAdvancedSettings } from "../../types/equipment";
import type { Material, WithMaterial } from "../../types/material";

import InfillSlider from "./components/InfillSlider";

interface MoreSettingsProps extends WithMaterial {
    prev: () => void;
    next: () => void;
    settingDetails: FilamentAdvancedSettings;
    setSettingDetails: (item: FilamentAdvancedSettings) => void;
}

const MoreSettings: React.FC<MoreSettingsProps> = ({
    prev,
    next,
    material,
    settingDetails,
    setSettingDetails,
}: MoreSettingsProps) => {

    const onChange: InputNumberProps["onChange"] = (value) => {
        if (Number.isNaN(value)) {
            return;
        }
        setSettingDetails({ ...settingDetails, infill: value as number });
    };

    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: "Advanced Settings",
            children: (
                <AdvancedSettings
                    material={material}
                    settingDetails={settingDetails}
                    setSettingDetails={setSettingDetails}
                />
            ),
        },
    ];
    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="large">
                <h2>MORE SETTINGS</h2>
                <Space direction="vertical" size="middle">
                    <h3>Density (Infill)</h3>
                    <p>
                        Infill refers to the material used to fill the interior
                        of a 3D printed object. It is typically a lattice or
                        grid structure that provides internal support and
                        strength while reducing the amount of material needed,
                        thus making prints lighter and faster. The density of
                        the infill can vary depending on the desired balance of
                        strength and weight.
                    </p>
                    <InfillSlider
                        value={settingDetails.infill}
                        onChange={onChange}
                    />
                </Space>
                <Space direction="vertical" size="middle">
                    <h3>Detail (Layer Height)</h3>
                    <p>
                        Layer height refers to the thickness of each individual
                        layer of material that is deposited during 3D printing.
                        It determines the level of detail and smoothness of the
                        finished object. A smaller layer height results in finer
                        resolution and smoother surfaces, while a larger layer
                        height speeds up the printing process but may produce a
                        rougher finish.
                    </p>
                    <Slider
                        min={0.15}
                        max={0.40}
                        onChange={(value) =>
                            setSettingDetails({
                                ...settingDetails,
                                layerHeight: value,
                            })
                        }
                        value={
                            typeof settingDetails.layerHeight === "number"
                                ? settingDetails.layerHeight
                                : 0.25
                        }
                        step={0.05}
                    />
                </Space>
                <HasAccess
                    roles={["proficient", "expert", "moderator", "admin"]}
                >
                    <Collapse items={items} defaultActiveKey={["1"]} />
                </HasAccess>

                <Flex gap="10px" style={{ width: "100%" }} justify="center">
                    <Button
                        onClick={prev}
                        icon={<CaretLeftOutlined />}
                        iconPosition="start"
                    >
                        Select Material
                    </Button>
                    <Button
                        type="primary"
                        icon={<CaretRightOutlined />}
                        iconPosition="end"
                        onClick={next}
                    >
                        Review
                    </Button>
                </Flex>
            </Space>
        </>
    );
};

export default MoreSettings;
