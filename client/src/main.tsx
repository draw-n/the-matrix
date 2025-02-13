import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import theme from "./theme.ts";
import "./index.css";
import { AuthProvider } from "./hooks/AuthContext.tsx";
import { ConfigProvider } from "antd";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ConfigProvider
            theme={theme}
        >
            <AuthProvider>
                <App />
            </AuthProvider>
        </ConfigProvider>
    </StrictMode>
);
