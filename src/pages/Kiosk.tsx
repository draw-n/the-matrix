// Description: Kiosk page component that displays an announcement carousel and auto-refreshes every hour.

import React, { useEffect, useRef, useState } from "react";
import { Carousel, Empty, Flex, Tag, theme, Typography } from "antd";
import Loading from "../components/routing/Loading";
import { Announcement } from "../types/announcement";
import { CarouselRef } from "antd/es/carousel";
import { useAllAnnouncements } from "../hooks/useAnnouncements";

const Kiosk: React.FC = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 3600000);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, []);
    return <AnnouncementCarousel />;
};

const AnnouncementCarousel: React.FC = () => {
    const { data: announcements, isLoading } = useAllAnnouncements(["posted"]);

    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const carouselRef = useRef<CarouselRef | null>(null); // Ref for the Carousel component
    const colorPrimary = theme.useToken().token.colorPrimary;

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
                    style={{ background: colorPrimary, color: "white" }}
                >
                    {announcements?.map((announcement: Announcement) => {
                        return (
                            <div
                                className={`updates-carousel updates-kiosk-mode`}
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
                                                announcement.dateCreated,
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
                                        height: "100vh",
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

export default Kiosk;
