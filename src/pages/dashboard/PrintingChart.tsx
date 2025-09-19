import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { geekblueDark, red } from "@ant-design/colors";
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
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="count"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={red[5]}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={red[5]}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} />
                        <YAxis
                            width={5}
                            allowDecimals={false}
                            type="number"
                            interval="preserveStartEnd"
                            domain={[0, "dataMax + 5"]}
                        />
                        <Tooltip />
                        <Area
                            fill="url(#count)"
                            type="monotone"
                            dataKey="count"
                            name="Number of Prints"
                            stroke={red[5]}
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Flex>
        </>
    );
};

export default PrintingChart;
