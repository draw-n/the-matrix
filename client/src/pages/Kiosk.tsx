import React, { useEffect } from "react";
import Updates from "../components/Updates";

const Kiosk: React.FC = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 3600000);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, []);
    return <Updates kioskMode />;
};

export default Kiosk;
