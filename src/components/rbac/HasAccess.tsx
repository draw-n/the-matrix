// Description: A component that conditionally renders its children based on user roles

import React from "react";
import { useAuth } from "../../hooks/AuthContext";

interface HasAccessProps {
    children?: React.ReactNode;
    roles?: string[];
}

export const checkAccess = (roles: string[] | undefined) => {
    const {user} = useAuth();
    return user?.access && roles?.includes(user?.access) ;
}

const HasAccess: React.FC<HasAccessProps> = ({
    children,
    roles,
}: HasAccessProps) => {

    return checkAccess(roles)? children : null;
};



export default HasAccess;
