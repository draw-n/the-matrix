import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import { ReactNode } from "react";
import { useAuth } from "./hooks/AuthContext";

import Shell from "./components/Shell";
import PrivateRoute from "./components/PrivateRoute";

import Announcements from "./pages/Announcements";
import Kiosk from "./pages/Kiosk";
import ReportAnIssue from "./pages/ReportAnIssue";
import EditUpdates from "./pages/EditUpdates";
import HistoryLog from "./pages/HistoryLog";
import Login from "./pages/Login";
import UserDirectory from "./pages/UserDirectory";

const App: React.FC = () => {
    const { user } = useAuth();

    return (
        <>
            <BrowserRouter>
                <Routes>
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
