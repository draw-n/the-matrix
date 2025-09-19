import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import theme from "./theme.ts";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./hooks/AuthContext.tsx";
import { ConfigProvider } from "antd";
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ConfigProvider theme={theme}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ConfigProvider>
    </StrictMode>
);
