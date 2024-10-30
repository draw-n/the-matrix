import { Carousel, Empty, Flex, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import type { Announcement } from "../types/Announcement";

interface UpdatesProps {
    kioskMode?: boolean;
}

const Updates: React.FC<UpdatesProps> = ({ kioskMode }: UpdatesProps) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Announcement[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/announcements`
                );
                setAnnouncements(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        fetchData();
        if (kioskMode) {
            const interval = setInterval(() => {
                window.location.reload();
            }, 3600000); // 20 seconds in milliseconds

            // Cleanup the interval on component unmount
            return () => clearInterval(interval);
        }
    }, []);
    return (
        <>
            <Carousel arrows>
                {isLoading ? (
                    <div style={{ padding: 0 }}>
                        <div className="updates-carousel">
                            <Flex
                                style={{ width: "100%", height: "100%" }}
                                justify="center"
                                align="center"
                            >
                                <Loading />
                            </Flex>
                        </div>
                    </div>
                ) : (
                    announcements?.map((announcement: Announcement) => {
                        return (
                            <div
                                className={`updates-carousel ${
                                    kioskMode && "updates-kiosk-mode"
                                }`}
                            >
                                <Flex
                                    className="updates-slide"
                                    vertical
                                    gap="5rem"
                                    justify="space-between"
                                >
                                    <div>
                                        <h2>{announcement.title}</h2>
                                        <p className="updates-description">
                                            {announcement.description}
                                        </p>
                                    </div>

                                    <Flex>
                                        <Tag
                                            style={{
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {announcement.type}
                                        </Tag>
                                        <p>
                                            {new Date(
                                                announcement.dateCreated
                                            ).toLocaleString()}
                                        </p>
                                    </Flex>
                                </Flex>
                            </div>
                        );
                    })
                )}
                {announcements?.length == 0 && (
                    <div style={{ padding: 0 }}>
                        <div className="updates-carousel">
                            <Flex
                                align="center"
                                justify="center"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Empty
                                    description={
                                        <Typography.Text className="updates-description">
                                            There are no announcements.
                                        </Typography.Text>
                                    }
                                />
                            </Flex>
                        </div>
                    </div>
                )}
            </Carousel>
        </>
    );
};

export default Updates;
