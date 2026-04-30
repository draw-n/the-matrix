export interface Issue {
    uuid: string;
    equipmentId: string;
    status: IssueStatus;
    initialDescription: string;
    description: string;
    createdBy: string;
    dateCreated: Date;
    assignedTo?: string[];
}

export interface WithIssue {
    issue?: Issue;
}

export interface WithIssues {
    issues?: Issue[];
}

export interface WithIssueId {
    issueId?: string;
}

export type IssueStatus = "open" | "in-progress" | "completed";