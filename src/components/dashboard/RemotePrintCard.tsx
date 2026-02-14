// Description: RemotePrintCard component displaying remote printing occurrences with a button to initiate a new print.
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import { PlusOutlined } from "@ant-design/icons";
import {
    Card,
    Space,
    Flex,
    Button,
    Typography,
    Spin,
    Radio,
    Empty,
} from "antd";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { geekblue } from "@ant-design/colors";

import dayjs from "dayjs";

import { WithUserId } from "../../types/user";
import { useJobChartData } from "../../hooks/useJobs";

const RemotePrintCard: React.FC<WithUserId> = ({ userId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [days, setDays] = useState(30);

    const { data: rawStats, isLoading } = useJobChartData(
        userId ? userId : user?.uuid,
        days,
    );

    const totalDays = days === 0 ? 365 : days;

    const chartData = useMemo(() => {
        // If no data yet, return empty
        if (!rawStats) return [];

        const data = [];
        const today = dayjs().startOf("day");

        for (let i = totalDays; i >= 0; i--) {
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
    }, [rawStats, days]);

    if (isLoading) {
        return (
            <Flex justify="center" align="center" style={{ height: 200 }}>
                <Spin tip="Loading chart..." />
            </Flex>
        );
    }

    return (
        <Card>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Flex justify="space-between" align="center">
                    <Typography.Title level={2} style={{ margin: 0 }}>
                        REMOTE PRINTING OCCURRENCES
                    </Typography.Title>
                    {user?.uuid === userId && (
                        <Button
                            variant="filled"
                            type="primary"
                            size="middle"
                            shape="round"
                            iconPosition="end"
                            icon={<PlusOutlined />}
                            onClick={() => navigate("/upload")}
                        >
                            New Print
                        </Button>
                    )}
                </Flex>
                <Flex gap="middle" align="center">
                    <ResponsiveContainer width="100%" height={200}>
                        {chartData.length === 0 ? (
                            <Empty
                                description={
                                    <Typography.Text>
                                        No prints found for the selected date
                                        range.
                                    </Typography.Text>
                                }
                            />
                        ) : (
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="countGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={geekblue[5]}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={geekblue[5]}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f0f0f0"
                                />
                                JavaScript
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    // "preserveStartEnd" ensures the first and last dates always show
                                    // minTickGap prevents labels from showing if they are within 30px of each other
                                    interval="preserveStartEnd"
                                    minTickGap={5}
                                    style={{
                                        fontSize: "12px",
                                        fill: "#8c8c8c",
                                    }}
                                    // Optional: Format the date differently if it's a long range
                                    tickFormatter={(value) => {
                                        // If it's a year view, maybe you only want the month name
                                        return totalDays > 30
                                            ? dayjs(value, "MMM D").format(
                                                  "MMM",
                                              )
                                            : value;
                                    }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={false}
                                    style={{
                                        fontSize: "12px",
                                        fill: "#8c8c8c",
                                    }}
                                    domain={[0, "auto"]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    }}
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
                    <Radio.Group
                        onChange={(e) => setDays(e.target.value)}
                        value={days}
                    >
                        <Space direction="vertical">
                            <Radio value={30}>Past Month</Radio>
                            <Radio value={365}>Past Year</Radio>
                            <Radio value={0}>All Time</Radio>
                        </Space>
                    </Radio.Group>
                </Flex>
            </Space>
        </Card>
    );
};

export default RemotePrintCard;
