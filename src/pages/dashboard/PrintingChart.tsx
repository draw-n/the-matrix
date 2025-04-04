import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { geekblueDark } from "@ant-design/colors";
import { Flex, Radio } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";

const data = [
    {
        name: "Jan 2024",
        amt: 2400,
    },
    {
        name: "Feb 2024",
        amt: 2210,
    },
    {
        name: "Mar 2024",
        amt: 2290,
    },
    {
        name: "Apr 2024",
        amt: 2000,
    },
    {
        name: "May 2024",
        amt: 2181,
    },
    {
        name: "Jun 2024",
        amt: 2500,
    },
    {
        name: "Jul 2024",
        amt: 2100,
    },
];

const options: CheckboxGroupProps<string>["options"] = [
    { label: "Past Month", value: "Past Month" },
    { label: "Past Year", value: "Past Year" },
    { label: "All Time", value: "All Time" },
];

const PrintingChart: React.FC = () => {
    return (
        <>
            <Flex vertical gap="middle">
                <Radio.Group block options={options} defaultValue="Apple" />
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="amt"
                            stroke={geekblueDark[5]}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Flex>
        </>
    );
};

export default PrintingChart;
