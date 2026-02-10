// Description: RemotePrint page for managing the remote 3D printing workflow including file upload, material selection, settings configuration, and review.

import { useEffect, useState } from "react";
import axios from "axios";

import { Button, Flex, Result, Space, Steps, message } from "antd";

import UploadFile from "./UploadFile";
import SelectMaterial from "./SelectMaterial";
import MoreSettings from "./MoreSettings";
import Review from "./Review";

import { Material } from "../../types/material";
import type { FilamentAdvancedSettings } from "../../types/equipment";
import { useAuth } from "../../hooks/AuthContext";
import { User } from "../../types/user";

import Loading from "../../components/Loading";
import Help from "./Help";
import CameraCard from "../equipmentProfile/CameraCard";

const RemotePrint: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allowPrint, setAllowPrint] = useState(true);
    const [current, setCurrent] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<UploadFile[]>([]);
    const [material, setMaterial] = useState<Material>();
    const [settingDetails, setSettingDetails] =
        useState<FilamentAdvancedSettings>({
            infill: 20,
            layerHeight: 0.2,
            supports: true,
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
        const handleBeforeUnload = (event: {
            preventDefault: () => void;
            returnValue: string;
        }) => {
            if (isLoading) {
                event.preventDefault(); // Standard for browsers
                event.returnValue = ""; // For older browsers
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isLoading]);

    const { user} = useAuth();

    useEffect(() => {
        setSettingDetails({
            ...settingDetails,
            temperatures: material?.temperatures || {
                extruder: {
                    firstLayer: 200,
                    otherLayers: 200,
                },
                bed: {
                    firstLayer: 60,
                    otherLayers: 60,
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

    const handleSubmit = async () => {
        try {
            if (user) {
                // CALL SLICING API
                setIsLoading(true);
                console.log(user);
                console.log(user.uuid);
                const printResponse = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/jobs`,
                    {
                        fileName: uploadedFile[0].name,
                        material,
                        options: settingDetails,
                        userId: user.uuid,
                    },
                );

                const userResponse = await axios.put<User>(
                    `${import.meta.env.VITE_BACKEND_URL}/users/${user?.uuid}`,
                );
                setSubmitted(true);
                setIsLoading(false);
                setAllowPrint(false);
            }
        } catch (err: any) {
            message.error(
                err.response?.data?.message ||
                    "Unable to print at this time. Please try again later.",
            );
            console.error(err);
        }
    };

    const steps = [
        {
            title: "Introduction",
            content: <Help next={next} />,
        },
        {
            title: "Upload File",
            content: (
                <UploadFile
                    uploadedFile={uploadedFile}
                    setUploadedFile={setUploadedFile}
                    next={next}
                    prev={prev}
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
                    handleSubmit={handleSubmit}
                />
            ),
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            {submitted ? (
                <Result
                    status="success"
                    title="Successfully Sliced and Uploaded Your Print!"
                    subTitle="Please pick up your print between 10 am to 6 pm on the nearest weekday you are available. Pick up location is Olin Hall, 4th Floor, Room 414."
                    extra={[
                        <>
                            <Button href="/" type="primary" key="dashboard">
                                To Dashboard
                            </Button>
                            ,
                        </>,
                    ]}
                />
            ) : isLoading ? (
                <Flex
                    justify="center"
                    align="center"
                    vertical
                    style={{ height: "60vh" }}
                >
                    <p>Uploading your print. Please don't close this page.</p>
                    <Loading />
                </Flex>
            ) : allowPrint ? (
                <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                >
                    <Steps current={current} items={items} />
                    <div style={{ width: "100%" }}>
                        {steps[current].content}
                    </div>
                </Space>
            ) : (
                <Result
                    status="warning"
                    title="Please wait after 24 hours from your last print."
                    extra={
                        <Button type="primary" href="/">
                            To Dashboard
                        </Button>
                    }
                />
            )}
        </>
    );
};

export default RemotePrint;
