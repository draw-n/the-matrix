import {
    DesktopOutlined,
    MailOutlined,
    YoutubeFilled,
} from "@ant-design/icons";
import { Button, Card, Flex } from "antd";

const socials = [
    { icon: <MailOutlined />, link: "mailto:david.c.florian@vanderbilt.edu" },
    { icon: <YoutubeFilled />, link: "https://www.youtube.com/c/drdflo" },
    {
        icon: <DesktopOutlined />,
        link: "https://www.digitalfabricationlab.com/",
    },
];

const SocialsCard: React.FC = () => {
    return (
        <Card>
            <Flex vertical gap="middle">
                <h2>Contact Dr. Florian</h2>
                <Flex gap="small" justify="center" align="center">
                    {socials.map((social, index) => (
                        <Button
                            key={index}
                            type="primary"
                            variant="filled"
                            shape="circle"
                            icon={social.icon}
                            href={social.link}
                        />
                    ))}
                </Flex>
            </Flex>
        </Card>
    );
};

export default SocialsCard;
