import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";

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

const App: React.FC = () => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [refreshEquipment, setRefreshEquipment] = useState<number>(0);

    useEffect(() => {
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
        fetchData();
    }, [refreshEquipment]);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/*Array.isArray(equipments) &&
                        equipments.length > 0 &&
                        equipments.map((equipment) => (
                            <Route
                                key={equipment._id}
                                path={`/makerspace/${equipment.routePath}`}
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                contentAccess={[
                                                    "novice",
                                                    "proficient",
                                                    "expert",
                                                    "moderator",
                                                    "admin",
                                                ]}
                                                children={
                                                    <EquipmentProfile
                                                        equipment={equipment}
                                                        refreshEquipment={
                                                            refreshEquipment
                                                        }
                                                        setRefreshEquipment={() =>
                                                            setRefreshEquipment(
                                                                refreshEquipment +
                                                                    1
                                                            )
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                    />
                                }
                            />
                        ))*/}

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route
                        path="/"
                        element={
                            <PrivateRoute
                                element={
                                    <Shell
                                        contentAccess={[
                                            "novice",
                                            "proficient",
                                            "expert",
                                            "moderator",
                                            "admin",
                                        ]}
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
                                        contentAccess={[
                                            "novice",
                                            "proficient",
                                            "expert",
                                            "moderator",
                                            "admin",
                                        ]}
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
                                        contentAccess={[
                                            "novice",
                                            "proficient",
                                            "expert",
                                            "moderator",
                                            "admin",
                                        ]}
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
                                        contentAccess={[
                                            "novice",
                                            "proficient",
                                            "expert",
                                            "moderator",
                                            "admin",
                                        ]}
                                        children={
                                            <Makerspace
                                                refreshEquipment={
                                                    refreshEquipment
                                                }
                                                setRefreshEquipment={
                                                    setRefreshEquipment
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
                                        contentAccess={["moderator", "admin"]}
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
                                        contentAccess={[
                                            "novice",
                                            "proficient",
                                            "expert",
                                            "moderator",
                                            "admin",
                                        ]}
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
                                        contentAccess={["admin"]}
                                        children={<UserDirectory />}
                                    />
                                }
                            />
                        }
                    />

                    <Route path="/kiosk" element={<Kiosk />} />
                    {/*<Route path="*" element={<NotFound />} />*/}
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
