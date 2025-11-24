// Description: A 404 Not Found page component that informs users when they navigate to a non-existent route and provides a button to return to the dashboard.

import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, this page does not exist."
            extra={
                <Button onClick={() => navigate("/")}>To Dashboard</Button>
            }
        />
    );
};

export default NotFound;
