import axios from "axios";
import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    access: string;
    status: string;
    graduationDate?: Date;
}

interface AuthContextType {
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

    useEffect(() => {
        const storedID = localStorage.getItem("userID");
        if (storedID) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/users/${storedID}`
                    );
                    if (response.data.user) {
                        setUser(response.data.user); // Set user in context state
                    }
                } catch (error) {
                    console.error("Failed to fetch user details", error);
                }
            };

            fetchUser();
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                { email, password }
            );
            if (response.data.user) {
                localStorage.setItem("userID", response.data.user._id);
                setUser(response.data.user);
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("userID");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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
