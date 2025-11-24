export interface Announcement {
    _id: string;
    title?: string;
    type: AnnouncementType;
    status?: AnnouncementStatus;
    description: string;
    createdBy: string;
    dateCreated: Date;
    lastUpdatedBy: string;
    dateLastUpdated: Date;
}

export type AnnouncementType = "event" | "classes" | "other";

export type AnnouncementStatus = "scheduled" | "posted";
