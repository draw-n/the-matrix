import { Carousel, Empty, Flex, Tag, Typography } from "antd";
import { CarouselRef } from "antd/es/carousel";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import type { Announcement } from "../types/Announcement";
import { geekblueDark } from "@ant-design/colors";

interface AnnouncementCarouselProps {
    kioskMode?: boolean;
}

const AnnouncementCarousel: React.FC<AnnouncementCarouselProps> = ({
    kioskMode,
}: AnnouncementCarouselProps) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const carouselRef = useRef<CarouselRef | null>(null); // Ref for the Carousel component

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Announcement[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/announcements?status=posted`
                );
                const formattedData = response.data.map((item) => ({
                    ...item,
                    key: item._id, // or item.id if you have a unique identifier
                }));
                setAnnouncements(formattedData);
                setIsLoading(false);
            } catch (error) {
                console.error("Internal Server Error: ", error);
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
                <Carousel
                    ref={carouselRef}
                    style={{ background: geekblueDark[4], color: "white" }}
                >
                    {announcements?.map((announcement: Announcement) => {
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
                    })}
                    {announcements?.length == 0 && (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                                className="updates-carousel"
                            >
                                <Empty
                                    style={{
                                        alignContent: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: kioskMode ? "100vh" : 300,
                                    }}
                                    description={
                                        <Typography.Text
                                            style={{
                                                color: "white",
                                            }}
                                        >
                                            There are no announcements.
                                        </Typography.Text>
                                    }
                                />
                            </div>
                        </div>
                    )}
                </Carousel>
            )}
        </>
    );
};

export default AnnouncementCarousel;
