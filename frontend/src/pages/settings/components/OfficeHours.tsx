import {
    EditOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Button, Flex, Form, Radio, Select, Space, TimePicker } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAllUsers, useEditUserById } from "../../../hooks/useUsers";
import {
    useAllEvents,
    useCreateEvent,
    useDeleteEventById,
    useEditEventById,
} from "../../../hooks/useEvents";

const OfficeHours: React.FC = () => {
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const { data: users } = useAllUsers(["admin", "moderator"]);
    const { data: events } = useAllEvents(["office hours"]);
    const { mutateAsync: createEvent } = useCreateEvent();
    const { mutateAsync: editEventById } = useEditEventById();
    const { mutateAsync: deleteEventById } = useDeleteEventById();
    const { mutateAsync: editUserById } = useEditUserById();

    const eventMap = new Map((events || []).map((e: any) => [e.uuid, e]));
    const onFinish = async (values: any) => {
        const newOHs = values.officeHours || [];

        for (const user of users || []) {
            const originalOHs = user.officeHours || [];

            const updatedOHs = newOHs.filter(
                (oh: any) => oh.userId === user.uuid,
            );

            // --- DELETE events (exist before, missing now) ---
            for (const oldOH of originalOHs) {
                const stillExists = updatedOHs.find(
                    (oh: any) => oh.eventId === oldOH.eventId,
                );

                if (!stillExists && oldOH.eventId) {
                    await deleteEventById({ eventId: oldOH.eventId });
                }
            }

            // --- CREATE or UPDATE events ---
            const finalOfficeHours = [];

            for (const oh of updatedOHs) {
                const startTime = oh.time[0].format("h:mm a");
                const endTime = oh.time[1].format("h:mm a");

                if (oh.eventId) {
                    const existingEvent = eventMap.get(oh.eventId);

                    if (!existingEvent) {
                        throw new Error(`Missing event ${oh.eventId}`);
                    }
                    await editEventById({
                        eventId: oh.eventId,
                        updatedEvent: {
                            ...existingEvent, // ✅ preserve everything
                            title: `${user.firstName} ${user.lastName}`,
                            description: `Weekly office hours for ${user.firstName} ${user.lastName}`,
                            lastUpdatedBy: user.uuid,
                            dateLastUpdated: new Date(),
                            dayOfWeek: oh.day,
                            startTime,
                            endTime,
                        },
                    });

                    finalOfficeHours.push({
                        dayOfWeek: oh.day,
                        startTime,
                        endTime,
                        eventId: oh.eventId,
                    });
                } else {
                    // CREATE new event
                    const created = await createEvent({
                        newEvent: {
                            title: `${user.firstName} ${user.lastName}`,
                            type: "office hours",
                            isRecurring: true,
                            description: `Weekly office hours for ${user.firstName} ${user.lastName}`,
                            createdBy: user.uuid,
                            dateCreated: new Date(),
                            lastUpdatedBy: user.uuid,
                            status: "recurring",
                            dateLastUpdated: new Date(),
                            dayOfWeek: oh.day,
                            startTime,
                            endTime,
                        },
                    });

                    finalOfficeHours.push({
                        dayOfWeek: oh.day,
                        startTime,
                        endTime,
                        eventId: created.uuid, // adjust if your API differs
                    });
                }
            }

            // --- UPDATE USER ---
            await editUserById({
                userId: user.uuid,
                editedUser: {
                    officeHours: finalOfficeHours,
                },
            });
        }
    };

    useEffect(() => {
        if (!users) return;
        const defaults = users.flatMap((user) =>
            (user.officeHours || []).map((oh: any) => ({
                userId: user.uuid,
                day: oh.dayOfWeek,
                time: [
                    dayjs(oh.startTime, "h:mm a"),
                    dayjs(oh.endTime, "h:mm a"),
                ],
                eventId: oh.eventId,
            })),
        );

        if (defaults.length) {
            form.setFieldsValue({ officeHours: defaults });
        }
    }, [users, form]);

    return (
        <Flex vertical gap="small">
            <Flex justify="space-between" align="center">
                <h2>OFFICE HOURS</h2>
                <Button
                    type="primary"
                    shape="circle"
                    onClick={async () => {
                        if (editMode) {
                            try {
                                await form.validateFields();
                                await form.submit();
                                setEditMode(false);
                            } catch (err) {
                                // validation or save error - keep editMode true
                            }
                        } else {
                            setEditMode(true);
                        }
                    }}
                    icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                />
            </Flex>
            <Form form={form} onFinish={onFinish}>
                <Form.List name="officeHours">
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field) => (
                                <Form.Item required={false} key={field.key}>
                                    <Space vertical size="small">
                                        <Flex justify="space-between">
                                            <Form.Item
                                                name={[field.name, "userId"]}
                                                validateTrigger={[
                                                    "onChange",
                                                    "onBlur",
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please select a user or delete this instance of office hours.",
                                                    },
                                                ]}
                                                noStyle
                                            >
                                                <Select
                                                    disabled={!editMode}
                                                    options={users?.map(
                                                        (user) => ({
                                                            label: `${user.firstName} ${user.lastName}`,
                                                            value: user.uuid,
                                                        }),
                                                    )}
                                                />
                                            </Form.Item>
                                            {editMode ? (
                                                <Button
                                                    color="red"
                                                    variant="text"
                                                    shape="circle"
                                                    icon={
                                                        <MinusCircleOutlined />
                                                    }
                                                    onClick={() =>
                                                        remove(field.name)
                                                    }
                                                />
                                            ) : null}
                                        </Flex>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                        >
                                            <Form.Item
                                                validateTrigger={[
                                                    "onChange",
                                                    "onBlur",
                                                ]}
                                                name={[field.name, "day"]}
                                                noStyle
                                                required
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please select a day or delete this instance of office hours.",
                                                    },
                                                ]}
                                            >
                                                <Radio.Group
                                                    options={[
                                                        {
                                                            label: "Sunday",
                                                            value: "Sunday",
                                                        },
                                                        {
                                                            label: "Monday",
                                                            value: "Monday",
                                                        },
                                                        {
                                                            label: "Tuesday",
                                                            value: "Tuesday",
                                                        },
                                                        {
                                                            label: "Wednesday",
                                                            value: "Wednesday",
                                                        },
                                                        {
                                                            label: "Thursday",
                                                            value: "Thursday",
                                                        },
                                                        {
                                                            label: "Friday",
                                                            value: "Friday",
                                                        },
                                                        {
                                                            label: "Saturday",
                                                            value: "Saturday",
                                                        },
                                                    ]}
                                                    disabled={!editMode}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                validateTrigger={[
                                                    "onChange",
                                                    "onBlur",
                                                ]}
                                                name={[field.name, "time"]}
                                                noStyle
                                                required
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please select a time or delete this instance of office hours.",
                                                    },
                                                ]}
                                            >
                                                <TimePicker.RangePicker
                                                    use12Hours
                                                    format="h:mm a"
                                                    disabled={!editMode}
                                                />
                                            </Form.Item>
                                        </Flex>
                                    </Space>
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Flex justify="center">
                                    <Button
                                        disabled={!editMode}
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Office Hours
                                    </Button>
                                </Flex>

                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Flex>
    );
};

export default OfficeHours;
