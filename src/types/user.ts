export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    access: UserAccess;
    status: UserStatus;
    graduationDate?: Date;
    remotePrints?: RemotePrint[];
}

export type UserStatus = "undergraduate" | "graduate" | "faculty";

export type UserAccess = "novice" | "proficient" | "expert" | "moderator" | "admin";

export interface RemotePrint {
    date: Date,
    fileName: string
}