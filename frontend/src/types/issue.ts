import {green, red, yellow} from "@ant-design/colors";

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

export const issueStatusColors: Record<IssueStatus, string> = {
    "open": red[5],
    "in-progress": yellow[5],
    "completed": green[5]
};