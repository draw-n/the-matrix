import { ThemeConfig, theme } from "antd";
import { geekblue, geekblueDark } from "@ant-design/colors";

const { darkAlgorithm, defaultAlgorithm } = theme;

const lightTheme: ThemeConfig = {
    token: {
        colorPrimary: geekblueDark[4],
        colorBgContainer: "#f8f9fa",
        colorBgBase: "#f8f9fa",
        colorBorder: "#a9a9a9",
        colorBorderBg: "#a9a9a9",
        colorBorderSecondary: "#a9a9a9",
        colorTextBase: geekblueDark[0],
    },
    algorithm: defaultAlgorithm,
    components: {
        Layout: {
            headerBg: "#f8f9fa",
            bodyBg: "#f8f9fa",
            lightSiderBg: "#eef3f8",
        },
        Drawer: {
            colorBgElevated: "#eef3f8",
        },
        Menu: {
            itemBg: "#eef3f8",
            itemSelectedBg: geekblue[1],
            darkItemSelectedBg: geekblue[5],
            itemBorderRadius: 0,
            activeBarBorderWidth: 0,
            itemMarginInline: 0,
        },
        Typography: {
            titleMarginTop: 0,
        },
        Card: {
            lineWidth: 1,
            colorBorder: "#a9a9a9",
            colorBorderBg: "#a9a9a9",
        },
        Divider: {
            colorBorder: "#797979",
            lineWidth: 1,
        },
        Table: {
            lineWidth: 1,
            headerBg: "#eef3f8",
            bodySortBg: "#f8f9fa",
            headerSortActiveBg: "#eef3f8",
            headerSortHoverBg: "#e1e6eb",
            headerSplitColor: "#eef3f8",
        },
        Modal: {
            lineWidth: 1,
        },
    },
};

const darkTheme: ThemeConfig = {
    token: {
        colorPrimary: geekblue[4],
        colorBgContainer: "#1f2228", // Slightly blue hue added to dark container background
        colorBgBase: "#141a1f", // Slightly blue hue added to dark background
        colorBorder: "#434343",
        colorBorderBg: "#434343",
        colorBorderSecondary: "#595959",
        colorTextBase: geekblue[0],
    },
    algorithm: darkAlgorithm,
    components: {
        Layout: {
            headerBg: "#1f2228",
            bodyBg: "#1f2228",
            lightSiderBg: "#141a1f",
        },
        Drawer: {
            colorBgBase: "#141a1f",
        },
        Menu: {
            itemBg: "#141a1f",
            darkItemBg: "#141a1f",
            itemSelectedBg: geekblue[1],
            darkItemSelectedBg: geekblue[5],
            itemBorderRadius: 0,
            activeBarBorderWidth: 0,
            itemMarginInline: 0,
        },
        Typography: {
            titleMarginTop: 0,
        },
        Card: {
            lineWidth: 1,
            colorBorder: "#434343",
            colorBorderBg: "#434343",
        },
        Divider: {
            colorBorder: "#595959",
            lineWidth: 1,
        },
        Table: {
            lineWidth: 1,
            headerBg: "#1f1f1f",
            bodySortBg: "#141414",
            headerSortActiveBg: "#1f1f1f",
            headerSortHoverBg: "#262626",
            headerSplitColor: "#1f1f1f",
        },
        Modal: {
            lineWidth: 1,
        },
    },
};

export { lightTheme, darkTheme };
