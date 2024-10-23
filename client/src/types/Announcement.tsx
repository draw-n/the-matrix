export interface Announcement {
    _id: string;
    type: string;
    status?: string;
    description: string;
    createdBy: string;
    dateCreated: string;
    lastUpdatedBy: string;
    dateLastUpdated: string;
}
