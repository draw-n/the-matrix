import { Carousel, Empty, Flex, Tag, Typography } from "antd";
import { CarouselRef } from "antd/es/carousel";

import axios from "axios";
import { useEffect, useRef, useState, createRef } from "react";
import Loading from "./Loading";
import type { Announcement } from "../types/Announcement";

interface UpdatesProps {
    kioskMode?: boolean;
}

const Updates: React.FC<UpdatesProps> = ({ kioskMode }: UpdatesProps) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const carouselRef = useRef<CarouselRef | null>(null); // Ref for the Carousel component

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Announcement[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/announcements`
                );
                const formattedData = response.data
                    .filter((item) => item.status != "archived")
                    .map((item) => ({
                        ...item,
                        key: item._id, // or item.id if you have a unique identifier
                    }));
                setAnnouncements(formattedData);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide(); // Update the slide every 10 seconds
        }, 10000); // Change slide every 10 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [announcements, currentSlide]);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.goTo(currentSlide); // Move the carousel to the current slide
        }
    }, [currentSlide]); // Update the carousel when currentSlide changes

    const nextSlide = () => {
        const length = announcements?.length;
        if (length) {
            const nextIndex = (currentSlide + 1) % length; // Loop back to the first slide
            setCurrentSlide(nextIndex);
        }
    };

    return (
        <>
            <Carousel arrows ref={carouselRef}>
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
                                    gap="8rem"
                                    justify="flex-end"
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
