import axios from "axios";
import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    access: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentialResponse: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children?: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check local storage for user data on app load
        const storedUser = window.localStorage.getItem("user");
        if (storedUser) {
            try {
                const userData: User = JSON.parse(storedUser);
                setUser(userData);
                console.log("parsed data: ", userData.firstName);
            } catch (error) {
                console.error("Can't parse user data from local:", error);
            }
        }
    }, []);

    const login = (credentialResponse: any) => {
        const newUser = {
            id: credentialResponse._id,
            firstName: credentialResponse.firstName,
            email: credentialResponse.email,
            lastName: credentialResponse.lastName,
            access: credentialResponse.access,
        };
        setUser(newUser);
        window.localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        window.localStorage.removeItem("user");
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

