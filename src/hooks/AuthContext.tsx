// Description: A React context for managing user authentication state, including login, logout, and fetching the current user.

import axios from "axios";
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    PropsWithChildren,
} from "react";
import { User } from "../types/user";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = PropsWithChildren<{}>;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    axios.defaults.withCredentials = true;

    const refreshUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/me`,
            );
            if (response.data.user) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                { email, password },
                {
                    withCredentials: true,
                },
            );

            if (response.data.user) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
            );
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ loading, user, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
