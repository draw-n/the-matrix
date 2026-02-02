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
