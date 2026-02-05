import { useParams } from "react-router-dom";
import { useAllUsers } from "../../hooks/user";
import Profile from "./Profile";
import NotFound from "../../components/NotFound";

const UserProfileLoader: React.FC = () => {
    const { userId } = useParams();
    const { data: users, isLoading } = useAllUsers();

    if (isLoading) {
        return null;
    }

    const user = users?.find(u => u.uuid === userId);

    if (!user) {
        return  <NotFound />;
    }

    return <Profile user={user} />
}

export default UserProfileLoader;