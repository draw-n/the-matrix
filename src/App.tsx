// Description: Main application component that sets up routing and theming.

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
import Settings from "./pages/settings/Settings";

import { useEffect, useState } from "react";
import axios from "axios";
import { Equipment } from "./types/equipment";
import Signup from "./pages/Signup";
import RemotePrint from "./pages/remotePrint/RemotePrint";
import Dashboard from "./pages/dashboard/Dashboard";

import "./App.css";
import FirstTime from "./pages/login/FirstTime";
import NotFound from "./components/NotFound";
import { ConfigProvider } from "antd";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { lightTheme, darkTheme } from "./theme.ts";
import { useAllEquipment } from "./hooks/equipment.ts";
import EquipmentProfileLoader from "./pages/equipmentProfile/EquipmentProfileLoader.tsx";
import UserProfileLoader from "./pages/profile/UserProfileLoader.tsx";

const App: React.FC = () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <>
            <ConfigProvider theme={theme === "light" ? lightTheme : darkTheme}>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path={`/makerspace/:routePath`}
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                title={"Makerspace"}
                                                contentAccess={[
                                                    "novice",
                                                    "proficient",
                                                    "expert",
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                children={
                                                    <EquipmentProfileLoader />
                                                }
                                            />
                                        }
                                    />
                                }
                            />

                            <Route
                                path={`/users/:userId`}
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                themeMode={theme}
                                                toggleTheme={toggleTheme}
                                                title="User Profile"
                                                contentAccess={[
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                children={
                                                    <UserProfileLoader />
                                                }
                                            />
                                        }
                                    />
                                }
                            />

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
                                                children={
                                                    <Profile />
                                                }
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
                                                children={<Makerspace />}
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
