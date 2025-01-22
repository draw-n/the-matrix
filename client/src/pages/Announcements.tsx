import { Flex, Button, Space } from "antd";
import Updates from "../components/Updates";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Announcements: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Space style={{width: "100%"}} direction="vertical" size="middle">
                <Flex justify={"space-between"} align={"center"}>
                    <h1>ANNOUNCEMENTS</h1>
                    <Flex gap="small">
                        {(user?.access == "moderator" ||
                            user?.access == "admin") && (
                            <Button
                                onClick={() => navigate("/edit")}
                                type="primary"
                                className="primary-button-filled"
                            >
                                EDIT
                            </Button>
                        )}

                        <Button
                            onClick={() => navigate("/kiosk")}
                            type="primary"
                            className="secondary-button-filled"
                        >
                            KIOSK MODE
                        </Button>
                    </Flex>
                </Flex>
                <Updates />
            </Space>
        </>
    );
};

export default Announcements;
