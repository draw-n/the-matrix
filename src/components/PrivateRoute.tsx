import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

interface PrivateRouteProps {
    element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    /*useEffect(() => {
        setTimeout(() => {
            if (!user) {
                navigate("/login");
            }
        }, 1000);
    });*/

    return <>{element}</>;
};

export default PrivateRoute;
