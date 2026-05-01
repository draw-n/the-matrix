// Description: A reusable component that provides a help icon with a popover for displaying additional information or guidance.

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";

interface HelpFieldProps {
    content?: React.ReactNode | string;
}

const HelpField: React.FC<HelpFieldProps> = ({ content }) => {
    return (
        <Popover placement="right" content={content}>
            <Button
                color="default"
                shape="circle"
                type="text"
                size="small"
                icon={<QuestionCircleOutlined />}
            />
        </Popover>
    );
};

export default HelpField;
