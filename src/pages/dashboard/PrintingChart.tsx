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
import { Flex, Radio, Segmented } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useAuth } from "../../hooks/AuthContext";
import { useMemo, useState } from "react";
import dayjs from "dayjs";

const PrintingChart: React.FC = () => {
    const { user } = useAuth();

    const [pastDays, setPastDays] = useState(30);

    const chartData = useMemo(() => {
        if (!user?.remotePrints || user.remotePrints.length === 0) return [];

        const today = dayjs().startOf("day");
        const oneMonthAgo = today.subtract(pastDays, "day");

        // 1. Create map of past 31 days (30 days ago through today)
        const dateMap: Record<string, number> = {};
        for (let i = 0; i <= 30; i++) {
            const dateKey = oneMonthAgo.add(i, "day").format("YYYY-MM-DD");
            dateMap[dateKey] = 0;
        }

        // 2. Count remotePrints by date
        user.remotePrints.forEach(({ date }) => {
            const parsed = dayjs(date).startOf("day");

            if (
                (parsed.isAfter(oneMonthAgo) && parsed.isBefore(today)) ||
                parsed.isSame(oneMonthAgo) ||
                parsed.isSame(today)
            ) {
                const key = parsed.format("YYYY-MM-DD");
                if (dateMap[key] !== undefined) {
                    dateMap[key]++;
                }
            }
        });
        console.log(
            Object.entries(dateMap).map(([date, count]) => ({
                date: dayjs(date).format("MMM D"), // e.g., "Apr 15"
                count,
            }))
        );
        // 3. Convert to recharts format
        return Object.entries(dateMap).map(([date, count]) => ({
            date: dayjs(date).format("MMM D"), // e.g., "Apr 15"
            count,
        }));
    }, [user?.remotePrints, pastDays]);

    return (
        <>
            <Flex vertical gap="middle">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="count"
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
