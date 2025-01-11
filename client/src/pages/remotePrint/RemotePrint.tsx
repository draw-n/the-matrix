import { Button, Steps, message } from "antd";
import UploadFile from "./UploadFile";
import { useState } from "react";

const steps = [
    {
        title: "Upload File",
        content: <UploadFile />,
    },
    {
        title: "Select Material",
        content: "Second-content",
    },
    {
        title: "More Settings",
        content: "Last-content",
    },
    {
        title: "Review",
        content: "dfd",
    },
];

const RemotePrint: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [material, setMaterial] = useState("");
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            <Steps current={current} items={items} />
            <div>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => message.success("Processing complete!")}
                    >
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
        </>
    );
};

export default RemotePrint;
