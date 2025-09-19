import { ThemeConfig } from "antd";
import { geekblue, geekblueDark } from "@ant-design/colors";

const theme: ThemeConfig = {
    token: {
        colorPrimary: geekblueDark[4],
        colorBgContainer: "#f8f9fa",
        colorBgBase: "#f8f9fa",
        colorBorder: "#a9a9a9",
        colorBorderBg: "#a9a9a9",
        colorBorderSecondary: "#a9a9a9",
        colorTextBase: geekblueDark[0],
    },
    components: {
        Layout: {
            headerBg: "#f8f9fa",
            bodyBg: "#f8f9fa",
            lightSiderBg: "#eef3f8",
        },
        Menu: {
            itemBg: "#eef3f8",

            darkItemBg: geekblueDark[1],
            darkItemHoverBg: geekblueDark[3],
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

export default theme;
