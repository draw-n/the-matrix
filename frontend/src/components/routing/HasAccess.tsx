// Description: A component that conditionally renders its children based on user roles

import React, { PropsWithChildren } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface HasAccessProps extends PropsWithChildren {
    roles?: string[];
}

export const checkAccess = (roles: string[] | undefined) => {
    const { user } = useAuth();
    return user?.access && roles?.includes(user?.access);
};

const HasAccess: React.FC<HasAccessProps> = ({
    children,
    roles,
}: HasAccessProps) => {
    return checkAccess(roles) ? children : null;
};

export default HasAccess;
