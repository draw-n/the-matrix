import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";

import Shell from "./components/Shell";
import PrivateRoute from "./components/PrivateRoute";

import Announcements from "./pages/Announcements";
import Kiosk from "./pages/Kiosk";
import ReportAnIssue from "./pages/reportIssues/ReportAnIssue";
import EditUpdates from "./pages/editUpdates/EditUpdates";
import HistoryLog from "./pages/HistoryLog";
import Login from "./pages/Login";
import UserDirectory from "./pages/userDirectory/UserDirectory";
import Profile from "./pages/profile/Profile";
import AllEquipment from "./pages/allEquipment/AllEquipment";
import EquipmentProfile from "./pages/equipmentProfile/EquipmentProfile";

import NotFound from "./components/NotFound";
import { useEffect, useState } from "react";
import axios from "axios";
import { Equipment } from "./types/Equipment";

const App: React.FC = () => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                console.log(response.data);
                setEquipments(response.data);
            } catch (error) {
                console.error("Error fetching routes:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {equipments?.map((equipment) => {
                        return (
                            <Route
                                key={equipment._id}
                                path={`/equipment/${equipment.routePath}`}
                                element={
                                    <PrivateRoute
                                        element={
                                            <Shell
                                                contentAccess={[
                                                    "view",
                                                    "edit",
                                                    "admin",
                                                ]}
                                                children={
                                                    <EquipmentProfile
                                                        equipment={equipment}
                                                    />
                                                }
                                            />
                                        }
                                    />
                                }
                            />
                        );
                    })}
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute
                                element={
                                    <Shell
                                        contentAccess={[
                                            "view",
                                            "edit",
                                            "admin",
                                        ]}
                                        children={<Announcements />}
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
                                            "view",
                                            "edit",
                                            "admin",
                                        ]}
                                        children={<Profile />}
                                    />
                                }
                            />
                        }
                    />
                    <Route
                        path="/equipment"
                        element={
                            <PrivateRoute
                                element={
                                    <Shell
                                        contentAccess={["admin"]}
                                        children={<AllEquipment />}
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
                                        contentAccess={["edit", "admin"]}
                                        children={<EditUpdates />}
                                    />
                                }
                            />
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <PrivateRoute
                                element={
                                    <Shell
                                        contentAccess={["edit", "admin"]}
                                        children={<HistoryLog />}
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
                                            "view",
                                            "edit",
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
