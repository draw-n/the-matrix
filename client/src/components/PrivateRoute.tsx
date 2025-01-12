import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

interface PrivateRouteProps {
    element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { user } = useAuth();
    setTimeout(() => {
        if (!user) {
            return <Navigate to="/login" />;
        }
    }, 1000);
   

    return <>{element}</>;
};

export default PrivateRoute;
