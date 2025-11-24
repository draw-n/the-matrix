export interface Category {
    _id: string;
    name: string;
    defaultIssues?: string[];
    properties?: CategoryProperties[];
    color: string;
}

export type CategoryProperties = "temperature";