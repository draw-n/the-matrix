import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios";

interface PrivateRouteProps {
    element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching user failed:", error);
                navigate("/login");
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
