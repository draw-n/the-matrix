import { useAuth } from "../../hooks/AuthContext";
import { useMemo } from "react";
import dayjs from "dayjs";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Empty, Flex, Typography, Spin } from "antd";
import { geekblue } from "@ant-design/colors";
import { useJobChartData } from "../../hooks/job";

const PrintingChart: React.FC = () => {
    const { user } = useAuth();
    // Assuming the hook returns { data: Record<string, number>, isLoading: boolean }
    const { data: rawStats, isLoading } = useJobChartData(user?.uuid);

    const chartData = useMemo(() => {
        // If no data yet, return empty
        if (!rawStats) return [];

        const daysToDisplay = 30;
        const data = [];
        const today = dayjs().startOf("day");

        // Fill in every day from 30 days ago until today
        for (let i = daysToDisplay; i >= 0; i--) {
            const dateObj = today.subtract(i, "day");
            const dateKey = dateObj.format("YYYY-MM-DD"); // Matches backend key format
            
            data.push({
                // Format for the X-Axis (e.g., "May 1")
                date: dateObj.format("MMM D"), 
                // Use backend count if exists, otherwise default to 0
                count: rawStats[dateKey] || 0,
            });
        }
        return data;
    }, [rawStats]);

    if (isLoading) {
        return (
            <Flex justify="center" align="center" style={{ height: 200 }}>
                <Spin tip="Loading chart..." />
            </Flex>
        );
    }

    return (
        <Flex vertical gap="middle">
            <ResponsiveContainer width="100%" height={200}>
                {chartData.length === 0 ? (
                    <Empty
                        description={
                            <Typography.Text>
                                No prints found for the selected date range.
                            </Typography.Text>
                        }
                    />
                ) : (
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={geekblue[5]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={geekblue[5]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            axisLine={false}
                            interval={6} // Show a date roughly every week to avoid crowding
                            style={{ fontSize: '12px', fill: '#8c8c8c' }}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                            style={{ fontSize: '12px', fill: '#8c8c8c' }}
                            domain={[0, 'auto']}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            name="Prints"
                            stroke={geekblue[5]}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#countGradient)"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                    </AreaChart>
                )}
            </ResponsiveContainer>
        </Flex>
    );
};

export default PrintingChart;