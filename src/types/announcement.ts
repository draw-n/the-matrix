export interface Announcement {
    uuid: string;
    title?: string;
    type: AnnouncementType;
    status?: AnnouncementStatus;
    description: string;
    createdBy: string;
    dateCreated: Date;
    lastUpdatedBy: string;
    dateLastUpdated: Date;
}

export interface WithAnnouncement {
    announcement?: Announcement;
}

export interface WithAnnouncements {
    announcements?: Announcement[];
}

export interface WithAnnouncementId {
    announcementId?: string;
}

export type AnnouncementType = "event" | "classes" | "other";

export type AnnouncementStatus = "scheduled" | "posted";
