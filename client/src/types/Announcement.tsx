export interface Announcement {
    _id: string;
    title?: string;
    type: string;
    status?: string;
    description: string;
    createdBy: string;
    dateCreated: Date;
    lastUpdatedBy: string;
    dateLastUpdated: Date;
}
