import axios from "axios";
import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";
import { RemotePrint } from "../types/Equipment";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    access: string;
    status: string;
    graduationDate?: Date;
    remotePrints?: RemotePrint[];
}

interface AuthContextType {
    setUser: (item: User) => void;
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children?: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    axios.defaults.withCredentials = true;

   useEffect(() => {
        // Fetch current user from session
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/users/me`
                );
                if (response.data.user) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                { email, password }
            );
            if (response.data.user) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/logout`
            );
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ setUser, user, login, logout }}>
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
