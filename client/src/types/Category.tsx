export interface Category {
    _id: string;
    name: string;
    defaultIssues?: string[];
    properties?: string[];
    color: string;
}
