export interface Issue {
    _id: string;
    equipment: string;
    status: IssueStatus;
    description: string;
    createdBy: string;
    dateCreated: Date;
    assignedTo?: string[];
}

export type IssueStatus = "open" | "in-progress" | "completed";