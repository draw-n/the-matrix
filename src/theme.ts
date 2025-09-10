import { ThemeConfig } from "antd";
import { geekblue, geekblueDark } from "@ant-design/colors";

const theme: ThemeConfig = {
    token: {
        colorPrimary: geekblueDark[4],
        colorBgContainer: "#fafafa",
        colorBgBase: "#fafafa",
        colorBorder: "#a9a9a9",
        colorBorderBg: "#a9a9a9",
        colorBorderSecondary: "#a9a9a9",
        colorTextBase: geekblueDark[0],
    },
    components: {
        Layout: {
            headerBg: "#fafafa",
            bodyBg: "#fafafa",
            lightSiderBg: "#f5f7f9",
        },
        Menu: {
            itemBg: "#f5f7f9",

            darkItemBg: geekblueDark[1],
            darkItemHoverBg: geekblueDark[3],
            itemSelectedBg: geekblue[1],
            darkItemSelectedBg: geekblue[5],
            itemBorderRadius: 0,
            activeBarBorderWidth: 0,
            itemMarginInline: 0,
        },
        Card: {
            lineWidth: 1,
            colorBorder: "#a9a9a9",
            colorBorderBg: "#a9a9a9",
            fontSizeHeading2: 20,
            colorTextHeading: "#a9a9a9"
        
        },
        Divider: {
            colorBorder: "#797979",
            lineWidth: 1,
        },
        Table: {
            lineWidth: 1
        },
        Modal: {
            lineWidth: 1
        }
    },
};

export default theme;
