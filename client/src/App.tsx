import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";

import Shell from "./components/Shell";

import Announcements from "./pages/Announcements";
import Kiosk from "./pages/Kiosk";
import ReportAnIssue from "./pages/ReportAnIssue";
import EditUpdates from "./pages/EditUpdates";
import HistoryLog from "./pages/HistoryLog";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Shell children={<Announcements />} />}
                    />
                    <Route
                        path="/edit"
                        element={<Shell children={<EditUpdates />} />}
                    />
                    <Route
                        path="/history"
                        element={<Shell children={<HistoryLog />} />}
                    />
                    <Route path="/kiosk" element={<Kiosk />} />
                    <Route
                        path="/report"
                        element={<Shell children={<ReportAnIssue />} />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
