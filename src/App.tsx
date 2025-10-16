import { Route, Routes, BrowserRouter } from "react-router-dom";

import Shell from "./components/Shell";
import PrivateRoute from "./components/PrivateRoute";

import Kiosk from "./pages/Kiosk";
import ReportAnIssue from "./pages/reportIssues/ReportAnIssue";
import EditUpdates from "./pages/editUpdates/EditUpdates";
import Login from "./pages/Login";
import UserDirectory from "./pages/userDirectory/UserDirectory";
import Profile from "./pages/profile/Profile";
import Makerspace from "./pages/makerspace/Makerspace";
import EquipmentProfile from "./pages/equipmentProfile/EquipmentProfile";
import Settings from "./pages/settings/Settings";

import { useEffect, useState } from "react";
import axios from "axios";
import { Equipment } from "./types/Equipment";
import Signup from "./pages/Signup";
import RemotePrint from "./pages/remotePrint/RemotePrint";
import Dashboard from "./pages/dashboard/Dashboard";

import "./App.css";
import FirstTime from "./pages/login/FirstTime";
import NotFound from "./components/NotFound";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./hooks/AuthContext";
import { lightTheme, darkTheme } from "./theme.ts";

const App: React.FC = () => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };
    const fetchData = async () => {
        try {
            const response = await axios.get<Equipment[]>(
                `${import.meta.env.VITE_BACKEND_URL}/equipment`
            );
            setEquipments(response.data as Equipment[]);
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <ConfigProvider theme={theme === "light" ? lightTheme : darkTheme}>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {Array.isArray(equipments) &&
                                equipments.length > 0 &&
                                equipments.map((equipment) => (
                                    <Route
                                        key={equipment._id}
                                        path={`/makerspace/${equipment.routePath}`}
                                        element={
                                            <PrivateRoute
                                                element={
                                                    <Shell
                                                        themeMode={theme}
                                                        toggleTheme={
                                                            toggleTheme
                                                        }
                                                        title={equipment.name}
                                                        contentAccess={[
                                                            "novice",
                                                            "proficient",
                                                            "expert",
                                                            "moderator",
                                                            "admin",
                                                        ]}
                                                        children={
                                                            <EquipmentProfile
                                                                equipment={
                                                                    equipment
                                                                }
                                                                refreshTable={
                                                                    fetchData
                                                                }
                                                            />
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                    />
                                ))}

                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            <Route path="/first-time" element={<FirstTime />} />
                            <Route
                                index
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                contentAccess={[
                                                    "novice",
                                                    "proficient",
                                                    "expert",
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                title="Dashboard"
                                                children={<Dashboard />}
                                            />
                                        }
                                    />
                                }
                            />

                            <Route
                                path="/settings"
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                title="Settings"
                                                contentAccess={["admin"]}
                                                children={<Settings />}
                                            />
                                        }
                                    />
                                }
                            />

                            <Route
                                path="/upload"
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                contentAccess={[
                                                    "novice",
                                                    "proficient",
                                                    "expert",
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                title="Remote Print"
                                                children={<RemotePrint />}
                                            />
                                        }
                                    />
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                contentAccess={[
                                                    "novice",
                                                    "proficient",
                                                    "expert",
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                title="User Profile"
                                                children={<Profile />}
                                            />
                                        }
                                    />
                                }
                            />
                            <Route
                                path="/makerspace"
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                contentAccess={[
                                                    "novice",
                                                    "proficient",
                                                    "expert",
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                title="Makerspace"
                                                children={
                                                    <Makerspace
                                                        refreshEquipment={
                                                            fetchData
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                    />
                                }
                            />
                            <Route
                                path="/edit"
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                title="Edit Updates"
                                                contentAccess={[
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                children={<EditUpdates />}
                                            />
                                        }
                                    />
                                }
                            />

                            <Route
                                path="/report"
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                contentAccess={[
                                                    "novice",
                                                    "proficient",
                                                    "expert",
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                title="Report an Issue"
                                                children={<ReportAnIssue />}
                                            />
                                        }
                                    />
                                }
                            />
                            <Route
                                path="/directory"
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                contentAccess={["admin"]}
                                                children={<UserDirectory />}
                                                title="User Directory"
                                            />
                                        }
                                    />
                                }
                            />

                            <Route path="/kiosk" element={<Kiosk />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ConfigProvider>
        </>
    );
};

export default App;
