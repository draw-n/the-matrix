import { Flex, Button } from "antd";
import Updates from "../components/Updates";
import { useNavigate } from "react-router-dom";

const Announcements: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Flex justify={"space-between"} align={"center"}>
                <h1>Announcements</h1>
                <Flex gap="small">
                    <Button onClick={() => navigate("/edit")} type="primary">
                        EDIT
                    </Button>
                    <Button onClick={() => navigate("/kiosk")} type="primary">
                        KIOSK MODE
                    </Button>
                </Flex>
            </Flex>
            <Updates />
        </>
    );
};

export default Announcements;
