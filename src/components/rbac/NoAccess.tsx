import { Result, Button } from "antd";

const NoAccess: React.FC = () => {
    
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
                <Button
                    type="primary"
                    href="/"
                >
                    To Dashboard
                </Button>
            }
        />
    );
};

export default NoAccess;
