// Description: Kiosk page component that displays an announcement carousel and auto-refreshes every hour.

import React, { useEffect } from "react";
import AnnouncementCarousel from "../components/AnnouncementCarousel";

const Kiosk: React.FC = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 3600000);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, []);
    return <AnnouncementCarousel kioskMode />;
};

export default Kiosk;
