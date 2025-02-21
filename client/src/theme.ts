import { ThemeConfig } from "antd";
import { geekblue, geekblueDark } from "@ant-design/colors";

const theme: ThemeConfig = {
    token: {
        colorPrimary: geekblue[5],
        colorBgBase: "#ededef",
        colorTextBase: geekblueDark[0],
    },
    components: {
        Layout: {
            headerBg: geekblueDark[2],
            siderBg: geekblueDark[1],
        },
        Menu: {
            darkItemBg: geekblueDark[1],
            darkItemHoverBg: geekblueDark[3],
            itemBorderRadius: 0,
            itemMarginInline: 0,
        }
    },
};

export default theme;
