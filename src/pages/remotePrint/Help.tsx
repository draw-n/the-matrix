import { CaretRightOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Collapse, CollapseProps, Flex } from "antd";
import { useState } from "react";

interface HelpProps {
    next: () => void;
}

const items: CollapseProps["items"] = [
    {
        key: "1",
        label: "Surface Contact & Stability",
        children: (
            <>
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
            </>
        ),
    },
    {
        key: "2",
        label: "Structural Integrity (Anisotropy)",
        children: (
            <>
                <p>
                    3D prints are Anisotropic, meaning they are not equally
                    strong in all directions. They are significantly weaker
                    along the "layer lines."
                </p>
                <ul>
                    <li>
                        Shear Stress: If your part is a hook or a bracket, never
                        print it so the weight pulls the layers apart (like
                        pulling a stack of Oreos apart). Orient it so the
                        filament "path" wraps around the curve.
                    </li>
                    <li>
                        The Vertical Peg Problem: Never print thin connectors or
                        pins vertically. They will snap at the layer bond.
                        Rotate them so they are printed horizontally along the X
                        or Y axis.
                    </li>
                </ul>
            </>
        ),
    },
    {
        key: "3",
        label: "Overhangs & Support Optimization",
        children: (
            <>
                <p>
                    Supports can create "scarring" along the bottom of
                    overhangs, so keep that in mind for your print orientation
                    and post-processing plans.
                </p>
                <ul>
                    <li>
                        Self-Supporting Geometry: Try to orient the mesh so that
                        steep angles face up. The "top" of a print always looks
                        better than the "bottom" (the side that touched the
                        supports).
                    </li>
                    <li>
                        Bridging: Modern printers can "bridge" a horizontal gap
                        between two pillars for a short distance (usually
                        10–20mm) without support. If your gap is longer than
                        that, you must orient the part to provide a vertical
                        path for the plastic.
                    </li>
                </ul>
            </>
        ),
    },
    {
        key: "4",
        label: "Critical Failures to Avoid",
        children: (
            <>
                <ul>
                    <li>
                        Manifold Errors: Ensure your mesh is "watertight." If
                        there are holes in the geometry, the toolpath will skip
                        those sections, causing structural gaps.
                    </li>
                    <li>
                        Thin-Wall Logic: Avoid geometry thinner than 0.8mm. Most
                        nozzles are 0.4mm wide; if a wall is too thin, the
                        slicer may decide it's "too small to print" and delete
                        that feature entirely.
                    </li>
                    <li>
                        Captive Cavities: If you are printing a hollow object,
                        ensure there is an opening. Completely sealed volumes
                        can trap air/heat, leading to "pillowing" or surface
                        deformities on the top layers.
                    </li>
                </ul>
            </>
        ),
    },
];

const Help: React.FC<HelpProps> = ({ next }: HelpProps) => {
    return (
        <>
            <Flex vertical style={{ width: "100%" }} gap="large">
                <h2>INTRODUCTION</h2>
                <p>
                    Please ready over this guide carefully before proceeding,
                    particularly if you are a beginner in 3D printing.
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

export default Help;
