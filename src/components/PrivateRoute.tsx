// Description: A higher-order component that protects routes by checking user authentication status and redirects unauthenticated users to the login page.
import React, { useEffect } from "react";
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

        if (
            !loading &&
            user &&
            !(
                user.graduationDate &&
                user.departments &&
                user.departments.length > 0 &&
                user.status
            )
        ) {
            navigate("/first-time");
        }
    }, [loading, user, navigate]);

    if (loading) {
        return null;
    }

    return <>{element}</>;
};

export default PrivateRoute;
