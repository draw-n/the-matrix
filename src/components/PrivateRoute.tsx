import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios";

interface PrivateRouteProps {
    element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`);
                setIsLoading(false);
                if (!response.data.user) {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error("Fetching user failed:", error);
                window.location.href = '/login';
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (isLoading || !user) {
        return null;
    }

    return <>{element}</>;
};

export default PrivateRoute;
