export interface Issue {
    _id: string;
    equipment: string;
    status: string;
    description: string;
    createdBy: string;
    dateCreated: Date;
    assignedTo?: string;
}
