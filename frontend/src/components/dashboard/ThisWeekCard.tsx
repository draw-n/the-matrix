import {
    Card,
    Col,
    Flex,
    Popover,
    Row,
    Table,
    TableProps,
    Tag,
    Typography,
} from "antd";
import { useAllEvents } from "../../hooks/useEvents";
import dayjs from "dayjs";
import { IssueStatus, issueStatusColors } from "../../types/issue";
import { red } from "@ant-design/colors";
import { eventTypeColors } from "../../types/event";

const ThisWeekCard: React.FC = () => {
    const { data: events } = useAllEvents();
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    return (
        <Card style={{ height: "100%" }}>
            <Typography.Title level={2}>This Week's Events</Typography.Title>
            <div
                style={{
                    minHeight: 250,
                    maxHeight: 400,
                    flex: 1,
                    overflow: "auto",
                }}
            >
                <Flex
                    justify="space-between"
                    style={{
                        height: "100%",
                    }}
                >
                    {days.map((day) => (
                        <Flex
                            vertical
                            style={{
                                flex: 1,
                                minWidth: 120, // 🔑 THIS is the fix
                                padding: "12px 5px", // 👈 creates breathing room
                            }}
                            key={day}
                        >
                            {/* Day header */}
                            <Typography.Title
                                level={5}
                                style={{
                                    textAlign: "center",
                                    color: "#a9a9a9",
                                    fontSize: 12,
                                }}
                            >
                                {day.slice(0, 3)}
                            </Typography.Title>

                            {/* Events */}
                            {events
                                ?.filter((e) =>
                                    e.isRecurring
                                        ? e.dayOfWeek === day
                                        : dayjs(e.date).format("dddd") === day,
                                )
                                .map((event) => (
                                    <Popover
                                        content={
                                            <Flex style={{height: "100%"}} align="center" justify="center">
                                                <p>
                                                    {event.description.trim()}
                                                </p>
                                            </Flex>
                                        }
                                        key={event.uuid}
                                        placement="bottom"
                                    >
                                        <Card
                                            size="small"
                                            style={{
                                                padding: "0",
                                                marginBottom: "8px",
                                                borderColor:
                                                    eventTypeColors[
                                                        event.type
                                                    ] || red[5],
                                            }}
                                        >
                                            <Flex vertical align="center">
                                                <Tag
                                                    color={
                                                        eventTypeColors[
                                                            event.type
                                                        ] || red[5]
                                                    }
                                                    style={{
                                                        textTransform:
                                                            "uppercase",
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {event.type}
                                                </Tag>

                                                <Typography.Title
                                                    level={5}
                                                    style={{
                                                        margin: 0,
                                                        textAlign: "center",
                                                        textDecoration:
                                                            "underline",
                                                        color:
                                                            eventTypeColors[
                                                                event.type
                                                            ] || red[5],
                                                    }}
                                                >
                                                    {event.title}
                                                </Typography.Title>

                                                <Typography.Paragraph
                                                    style={{
                                                        margin: 0,
                                                        textAlign: "center",
                                                        color:
                                                            eventTypeColors[
                                                                event.type
                                                            ] || red[5],
                                                    }}
                                                >
                                                    {event.startTime} to{" "}
                                                    {event.endTime}
                                                </Typography.Paragraph>
                                            </Flex>
                                        </Card>
                                    </Popover>
                                ))}
                        </Flex>
                    ))}
                </Flex>
            </div>
        </Card>
    );
};

export default ThisWeekCard;
