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
        const fetchData = async (storedUserID: string) => {
            try {
                const response = await axios.get<User>(
                    `${import.meta.env.VITE_BACKEND_URL}/users/${storedUserID}`
                );
                setUser(response.data);
            } catch (error) {
                console.error("Failure to fetch user id", error);
            }
        };

        // Check local storage for user data on app load
        const storedUserID = window.localStorage.getItem("userID");
        if (storedUserID) {
            try {
                fetchData(JSON.parse(storedUserID));
                //const userData: User = JSON.parse(storedUserID);
                //setUser(userData);
                console.log("parsed data: ", user?.firstName);
            } catch (error) {
                console.error("Can't parse user data from local:", error);
            }
        }
    }, []);

    const login = (credentialResponse: any) => {
        const newUser = {
            _id: credentialResponse._id,
            firstName: credentialResponse.firstName,
            email: credentialResponse.email,
            lastName: credentialResponse.lastName,
            access: credentialResponse.access,
        };
        setUser(newUser);
        //window.localStorage.setItem("userID", JSON.stringify(newUser));

        window.localStorage.setItem("userID", JSON.stringify(newUser._id));
    };

    const logout = () => {
        setUser(null);
        window.localStorage.removeItem("userID");
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
