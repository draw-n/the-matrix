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
import ManageEquipment from "./pages/manageEquipment/ManageEquipment";

import NotFound from "./components/NotFound";

const App: React.FC = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<NotFound />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute
                                element={<Shell children={<Announcements />} />}
                            />
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute
                                element={<Shell children={<Profile />} />}
                            />
                        }
                    />
                    <Route
                        path="/equipment"
                        element={
                            <PrivateRoute
                                element={
                                    <Shell children={<ManageEquipment />} />
                                }
                            />
                        }
                    />
                    <Route
                        path="/edit"
                        element={
                            <PrivateRoute
                                element={<Shell children={<EditUpdates />} />}
                            />
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <PrivateRoute
                                element={<Shell children={<HistoryLog />} />}
                            />
                        }
                    />
                    <Route
                        path="/report"
                        element={
                            <PrivateRoute
                                element={<Shell children={<ReportAnIssue />} />}
                            />
                        }
                    />
                    <Route
                        path="/directory"
                        element={
                            <PrivateRoute
                                element={<Shell children={<UserDirectory />} />}
                            />
                        }
                    />

                    <Route path="/kiosk" element={<Kiosk />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
