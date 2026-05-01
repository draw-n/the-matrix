import { blue, green, orange, red } from "@ant-design/colors";

export interface Event {
    uuid: string; // unique identifier for the event
    title: string;
    type: EventType;
    date?: Date;
    announcementId?: string; // optional uuid of the associated announcement    
    dayOfWeek?: string; // for recurring events
    isRecurring: boolean;
    description: string;
    createdBy: string; // uuid of the user who created the event
    dateCreated: Date;
    status: EventStatus;
    lastUpdatedBy: string; // uuid of the user who last updated the event
    dateLastUpdated: Date;
    startTime: string; // in HH:mm format
    endTime: string; // in HH:mm format
}

export type EventType = "print session" | "office hours" | "lab closed" | "other";

export type EventStatus = "upcoming" | "recurring";

export interface WithEvent {
    event?: Event;
}

export interface WithEvents {
    events?: Event[];
}

export const eventTypeColors: Record<EventType, string> = {
    "lab closed": red[5],
    "print session": blue[5],
    "office hours": green[5],
    "other": orange[5],
};