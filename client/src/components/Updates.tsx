import { Carousel, Empty, Flex, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "100vh",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};

interface Announcement {
    dateCreated: Date;
    type: string;
    description: string;
}

/*interface UpdatesProps {
    height?: string | number | undefined;
    width?: string | number | undefined;
}*/

const Updates: React.FC = ({}) => {
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
    }, []);
    return (
        <>
            <Carousel autoplay arrows>
                {isLoading ? (
                    <div style={{ padding: 0 }}>
                        <div style={contentStyle}>
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
                            <div style={{ padding: 0 }}>
                                <div style={contentStyle}>
                                    <p>{announcement.type}</p>
                                    <p>
                                        {new Date(
                                            announcement.dateCreated
                                        ).toLocaleString()}
                                    </p>
                                    <p>{announcement.description}</p>
                                </div>
                            </div>
                        );
                    })
                )}
                {announcements?.length == 0 && (
                    <div style={{ padding: 0 }}>
                        <div style={contentStyle}>
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
                                        <Typography.Text>
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
