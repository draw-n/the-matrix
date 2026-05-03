// Description: Event form component for creating and editing announcements.

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import {
    Input,
    Form,
    Button,
    Select,
    Modal,
    Tooltip,
    FormProps,
    Flex,
    TimePicker,
    Checkbox,
    message,
    DatePicker,
} from "antd";
import {
    CaretDownFilled,
    EditOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";

import type { Event, EventStatus, WithEvent } from "../../types/event";
import { useEditEventById, useCreateEvent } from "../../hooks/useEvents";
import { useCreateAnnouncement } from "../../hooks/useAnnouncements";
import dayjs from "dayjs";

const EventForm: React.FC<WithEvent> = ({ event }: WithEvent) => {
    const [form] = Form.useForm();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { mutateAsync: editEventById } = useEditEventById();
    const { mutateAsync: createEvent } = useCreateEvent();
    const { mutateAsync: createAnnouncement } = useCreateAnnouncement();
    const [isRecurring, setIsRecurring] = useState<boolean>(
        event?.isRecurring || false,
    );

    const onFinish: FormProps["onFinish"] = async (values) => {
        if (!["print session", "lab closed", "other"].includes(values.type)) {
            message.error(
                "Only print sessions, lab closures, and other events can be created or edited through this form. Please contact an administrator to manage office hours events.",
            );
            return;
        }

        if (event) {
            if (values.createAnnouncement && !event.announcementId) {
                createAnnouncement({
                    newAnnouncement: {
                        title: values.title,
                        type: "event",
                        description: values.description,
                        createdBy: user?.uuid,
                        dateCreated: new Date(),
                    },
                });
            }
            const editedEvent: Event = {
                ...event,
                title: values.title,
                type: values.type,
                date: values.date,
                dayOfWeek: values.dayOfWeek,
                isRecurring: values.isRecurring,
                description: values.description,
                startTime: values.time
                    ? values.time[0].format("h:mma")
                    : undefined,
                endTime: values.time
                    ? values.time[1].format("h:mma")
                    : undefined,

                lastUpdatedBy: user?.uuid || event.createdBy,
                dateLastUpdated: new Date(),
            };
            await editEventById({
                eventId: event.uuid,
                updatedEvent: editedEvent,
            });
        } else {
            if (values.createAnnouncement) {
                createAnnouncement({
                    newAnnouncement: {
                        title: values.title,
                        type: "event",
                        description: values.description,
                        createdBy: user?.uuid,
                        dateCreated: new Date(),
                    },
                });
            }
            const newEvent = {
                title: values.title,
                type: values.type,
                date: values.date,
                dayOfWeek: values.dayOfWeek,
                isRecurring: values.isRecurring,
                description: values.description,
                startTime: values.time
                    ? values.time[0].format("h:mma")
                    : undefined,
                endTime: values.time
                    ? values.time[1].format("h:mma")
                    : undefined,
                createdBy: user?.uuid,
                dateCreated: new Date(),
                status: isRecurring
                    ? ("recurring" as EventStatus)
                    : ("upcoming" as EventStatus),
            };
            await createEvent({
                newEvent: newEvent,
            });
            form.resetFields();
        }
        setIsModalOpen(false);
    };

    const onCheckboxChange = (e: { target: { checked: boolean } }) => {
        setIsRecurring(e.target.checked);
    };

    return (
        <>
            <Tooltip
                title={event ? "Edit Event" : "Add Event"}
                placement="topLeft"
            >
                <Button
                    type="primary"
                    size="middle"
                    icon={event ? <EditOutlined /> : <PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    iconPlacement="end"
                    shape={event ? "circle" : "round"}
                >
                    {event ? null : "Add New Event"}
                </Button>
            </Tooltip>
            <Modal
                styles={{
                    body: {
                        scrollbarGutter: "stable && both-edges",
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 200px)",
                    },
                }}
                title={event ? "Edit Event" : "Add Event"}
                open={isModalOpen}
                centered
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                    style={{ width: "100%" }}
                    autoComplete="off"
                    preserve={false}
                    initialValues={
                        event
                            ? {
                                  type: event.type,
                                  title: event.title,
                                  description: event.description,
                                  dayOfWeek: event.dayOfWeek,
                                  date: dayjs(event.date),
                                  time:
                                      event.startTime && event.endTime
                                          ? [
                                                dayjs(event.startTime, "h:mma"),
                                                dayjs(event.endTime, "h:mma"),
                                            ]
                                          : undefined,
                                  isRecurring: event.isRecurring,
                              }
                            : {
                                  type: null,
                                  title: "",
                                  description: "",
                              }
                    }
                >
                    <Flex justify="space-between" gap="small">
                        <Form.Item<Event>
                            style={{ width: "50%" }}
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter a title for the event.",
                                },
                            ]}
                        >
                            <Input size="small" />
                        </Form.Item>
                        <Form.Item<Event>
                            style={{ width: "50%" }}
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select an event type.",
                                },
                            ]}
                        >
                            <Select
                                size="small"
                                suffixIcon={<CaretDownFilled />}
                                options={[
                                    {
                                        value: "print session",
                                        label: "Print Session",
                                    },
                                    {
                                        value: "lab closed",
                                        label: "Lab Closed",
                                    },
                                    { value: "other", label: "Other" },
                                    {
                                        value: "office hours",
                                        label: "Office Hours",
                                        disabled: true,
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Flex>
                    <Flex justify="space-between" align="center" gap="small">
                        <Form.Item
                            validateTrigger={["onChange", "onBlur"]}
                            name="isRecurring"
                            valuePropName="checked"
                        >
                            <Checkbox
                                checked={isRecurring}
                                onChange={onCheckboxChange}
                            >
                                Recurring Weekly?
                            </Checkbox>
                        </Form.Item>
                        {isRecurring ? (
                            <Form.Item
                                style={{ width: "100%" }}
                                validateTrigger={["onChange", "onBlur"]}
                                name="dayOfWeek"
                                label="Day of Week"
                                rules={[
                                    {
                                        required: isRecurring,
                                        message:
                                            "Please select a day of the week for the recurring event.",
                                    },
                                ]}
                            >
                                <Select
                                    size="small"
                                    suffixIcon={<CaretDownFilled />}
                                    placeholder="Select day of week"
                                    options={[
                                        { value: "Monday", label: "Monday" },
                                        { value: "Tuesday", label: "Tuesday" },
                                        {
                                            value: "Wednesday",
                                            label: "Wednesday",
                                        },
                                        {
                                            value: "Thursday",
                                            label: "Thursday",
                                        },
                                        { value: "Friday", label: "Friday" },
                                        {
                                            value: "Saturday",
                                            label: "Saturday",
                                        },
                                        { value: "Sunday", label: "Sunday" },
                                    ]}
                                />
                            </Form.Item>
                        ) : (
                            <Form.Item
                                validateTrigger={["onChange", "onBlur"]}
                                name="date"
                                label="Date"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: !isRecurring,
                                        message:
                                            "Please select a date for the event.",
                                    },
                                ]}
                            >
                                <DatePicker size="small" style={{ width: "100%" }} />
                            </Form.Item>
                        )}
                    </Flex>
                    <Flex justify="space-between" align="center" gap="small">
                        <Form.Item
                            validateTrigger={["onChange", "onBlur"]}
                            name="time"
                            label="Time"
                            required
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select a time for this event.",
                                },
                            ]}
                        >
                            <TimePicker.RangePicker
                                size="small"
                                use12Hours
                                style={{ width: "100%" }}
                                format="h:mm a"
                            />
                        </Form.Item>
                    </Flex>

                    <Form.Item<Event> label="Description" name="description">
                        <Input.TextArea size="small" rows={6} />
                    </Form.Item>

                    <Form.Item
                        name="createAnnouncement"
                        valuePropName="checked"
                    >
                        <Checkbox>Create Announcement?</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EventForm;
