import { Carousel } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

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

    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<Announcement[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/updates`
                );
                setAnnouncements(responseUpdates.data);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <Carousel autoplay arrows afterChange={onChange}>
                {announcements?.map((announcement: Announcement) => {
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
                })}
            </Carousel>
        </>
    );
};

export default Updates;
