import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
    element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user, navigate]);

    if (loading) {
        return null;
    }

    return <>{element}</>;
};

export default PrivateRoute;
