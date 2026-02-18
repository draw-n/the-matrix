import { CaretRightOutlined } from "@ant-design/icons";
import { Button, Collapse, CollapseProps, Flex } from "antd";
import orientation from "../../../assets/images/orientation.svg";
import infill from "../../../assets/images/infill.svg";
import featureSize from "../../../assets/images/minimum-feature.svg";

interface IntroductionProps {
    next: () => void;
}

const items: CollapseProps["items"] = [
    {
        key: "1",
        label: "Surface Contact & Stability",
        children: (
            <Flex vertical flex={1}>
                <p>
                    The "floor" of your workspace is the{" "}
                    <span style={{ fontWeight: "bold" }}>Build Plate</span>.
                    Since filament is a hot liquid being squished onto a
                    surface, your first layer determines everything.
                </p>
                <ul>
                    <li>
                        Base Footprint: Look for the orientation that offers the
                        most surface area on the Z-zero (floor) plane. A small
                        footprint leads to Leverage Failure, where the nozzle’s
                        movement knocks the print over mid-way.
                    </li>
                    <li>
                        Z-Height vs. Stability: Tall, thin parts act like a
                        lever. As the printer gets higher, the "wobble"
                        increases, leading to visible lines or the part snapping
                        off the base. If it’s tall and skinny, lay it down.
                    </li>
                </ul>
                <Flex justify="center">
                    <img style={{ width: 400 }} src={orientation} alt="Orientation" />
                </Flex>
            </Flex>
        ),
    },
    {
        key: "2",
        label: "Infill and Cavities",
        children: (
            <Flex vertical flex={1} gap="large">
                <div>
                    <p>
                        If printing a large part use a low infill percent{" "}
                        {"(<15%)"} to increase the speed of the print and
                        decrease the material needed.
                    </p>
                    <p>
                        If you are printing a hollow object, ensure there is an
                        opening. Completely sealed volumes can trap air/heat,
                        leading to "pillowing" or surface deformities on the top
                        layers.
                    </p>
                </div>
                <Flex justify="center">
                    <img
                        style={{ width: 400 }}
                        src={infill}
                        alt="Infill and Cavities"
                    />
                </Flex>
            </Flex>
        ),
    },
    {
        key: "3",
        label: "Minimum Feature Size",
        children: (
            <Flex vertical flex={1} gap="large">
                <p>
                    Avoid geometry thinner than 0.8mm. Most nozzles are 0.6mm
                    wide; if a wall is too thin, the slicer may decide it's "too
                    small to print" and delete that feature entirely.
                </p>
                <Flex justify="center">
                    <img
                        style={{ width: 400 }}
                        src={featureSize}
                        alt="Minimum Feature Size"
                    />
                </Flex>
            </Flex>
        ),
    },
];

const Introduction: React.FC<IntroductionProps> = ({
    next,
}: IntroductionProps) => {
    return (
        <>
            <Flex vertical style={{ width: "100%" }} gap="large">
                <h2>INTRODUCTION</h2>
                <p>
                    By uploading a file to this server, you acknowledge and
                    agree to the following terms:
                </p>
                <ul>
                    <li>
                        Prohibited Content: The upload of inappropriate,
                        offensive, or malicious 3D models—including but not
                        limited to weapons, controlled items, or sexually
                        explicit material—is strictly prohibited.
                    </li>
                    <li>
                        Identity Association: For security and accountability,
                        all uploads are permanently logged and associated with
                        your user account.
                    </li>
                    <li>
                        Data Integrity: Please ensure your files are free of
                        malicious code or corrupt geometry. We reserve the right
                        to flag or remove any content that violates our safety
                        guidelines or operational standards.
                    </li>
                </ul>
                <p>
                    Be mindful of your contributions to the print queue. Misuse
                    of this service may result in the suspension of your
                    printing privileges. Please read over this guide carefully
                    before proceeding, particularly if you are a beginner in 3D
                    printing.
                </p>
                <Collapse items={items} />
                <Flex justify="center" style={{ width: "100%" }}>
                    <Button
                        type="primary"
                        icon={<CaretRightOutlined />}
                        iconPosition="end"
                        onClick={next}
                    >
                        Upload File
                    </Button>
                </Flex>
            </Flex>
        </>
    );
};

export default Introduction;
