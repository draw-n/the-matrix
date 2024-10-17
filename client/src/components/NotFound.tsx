import { Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return <Result status="404" title="404" subTitle="" />;
};

export default NotFound;
