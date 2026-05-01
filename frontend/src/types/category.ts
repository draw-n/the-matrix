export interface Category {
    uuid: string;
    name: string;
    defaultIssues?: string[];
    properties?: CategoryProperties[];
    color: string;
}

export interface WithCategory {
    category?: Category;
}

export interface WithCategories {
    categories?: Category[];
}

export interface WithCategoryId {
    categoryId?: string;
}


export type CategoryProperties = "temperature";