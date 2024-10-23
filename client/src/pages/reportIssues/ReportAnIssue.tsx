import { Space } from "antd";
import NotFound from "../../components/NotFound";
import IssueForm from "./IssueForm";
import "./issues.css";
const ReportAnIssue: React.FC = () => {
    return (
        <>
            <Space direction="vertical" size="large">
                <h1>REPORT AN ISSUE</h1>
                <p>
                    This form is NOT for class or personal usage. It is only to
                    report any equipment malfunction in the Digital Fabrication
                    Lab. For any other inquiries, please contact Dr. David
                    Florian directly.
                </p>
                <IssueForm />
            </Space>
        </>
    );
};

export default ReportAnIssue;
