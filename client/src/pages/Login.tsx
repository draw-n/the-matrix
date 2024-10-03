import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { Button } from "antd";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (credentialResponse) =>
            handleLoginSuccess(credentialResponse),
        onError: (error) => console.log("Login Failed:", error),
    });

    const handleLoginSuccess = async (credentialResponse: TokenResponse) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users`,
                {
                    token: credentialResponse.access_token,
                }
            );
            login(response.data);
            navigate(location.state?.from || "/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    useEffect(() => {
        if (user) {
            navigate(location.state?.from || "/");
        }
    });

    return (
        <>
            <div className="login-background">
                <div className="login-banner">
                    <h1>Login</h1>
                    <Button type="primary" onClick={() => loginWithGoogle()}>
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Login;
