import { Button, Space, Steps, message } from "antd";
import UploadFile from "./UploadFile";
import SelectMaterial from "./SelectMaterial";
import MoreSettings from "./MoreSettings";
import Review from "./Review";
import { useEffect, useState } from "react";
import { Material } from "../../types/Material";
import { FilamentMoreSettings } from "../../types/Equipment";

const RemotePrint: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<UploadFile[]>([]);
    const [material, setMaterial] = useState<Material | null>(null);
    const [settingDetails, setSettingDetails] = useState<FilamentMoreSettings>({
        infill: 20,
        layerHeight: 0.1,
        supports: "everywhere",
        temperatures: {
            extruder: {
                firstLayer: 240,
                otherLayers: 240,
            },
            bed: {
                firstLayer: 65,
                otherLayers: 65,
            },
        },
        horizontalShell: {
            topLayers: 3,
            bottomLayers: 3,
        },
        verticalShell: {
            perimeters: 3,
        },
    });

    useEffect(() => {
        setSettingDetails({
            ...settingDetails,
            temperatures: material?.temperatures || {
                extruder: {
                    firstLayer: 240,
                    otherLayers: 240,
                },
                bed: {
                    firstLayer: 65,
                    otherLayers: 65,
                },
            },
        });
    }, [material]);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: "Upload File",
            content: (
                <UploadFile
                    uploadedFile={uploadedFile}
                    setUploadedFile={setUploadedFile}
                    next={next}
                />
            ),
        },
        {
            title: "Select Material",
            content: (
                <SelectMaterial
                    next={next}
                    prev={prev}
                    setMaterial={setMaterial}
                />
            ),
        },
        {
            title: "More Settings",
            content: (
                <MoreSettings
                    next={next}
                    prev={prev}
                    material={material}
                    settingDetails={settingDetails}
                    setSettingDetails={setSettingDetails}
                />
            ),
        },
        {
            title: "Review",
            content: (
                <Review

                    prev={prev}
                    settingDetails={settingDetails}
                    material={material}
                    uploadedFile={uploadedFile}
                />
            ),
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            <h1>Remote Printing</h1>
            {`${JSON.stringify(settingDetails)}`}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Steps current={current} items={items} />
                <div style={{ width: "100%" }}>{steps[current].content}</div>
            </Space>
        </>
    );
};

export default RemotePrint;
