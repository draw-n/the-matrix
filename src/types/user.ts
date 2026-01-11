export interface User {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    access: UserAccess;
    status: UserStatus;
    graduationDate?: Date;
}

export interface WithUser {
    user?: User;
}

export interface WithUsers {
    users?: User[];
}

export interface WithUserId {
    userId?: string;
}

export type UserStatus = "undergraduate" | "graduate" | "faculty";

export type UserAccess = "novice" | "proficient" | "expert" | "moderator" | "admin";