export interface User {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    access: UserAccess;
    status: UserStatus;
    graduationDate?: Date;
    departments: string[];
    officeHours?: {
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        eventId: string; // calendar event id for office hours
    }[];
    imageName?: string; // filename of the user's profile picture
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