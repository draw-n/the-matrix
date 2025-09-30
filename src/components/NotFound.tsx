import { Button, Result } from "antd";

const NotFound: React.FC = () => {

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, this page does not exist."
            extra={
                <Button href="/">To Dashboard</Button>
            }
        />
    );
};

export default NotFound;
