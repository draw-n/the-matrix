import NotFound from "../../components/NotFound";
import IssueForm from "./IssueForm";

const ReportAnIssue: React.FC = () => {
    return (
        <>
            <h1>REPORT AN ISSUE</h1>
            <p>
                This form is NOT for class or personal usage. It is only to
                report any equipment malfunction in the Digital Fabrication Lab.
                For any other inquiries, please contact Dr. David Florian
                directly.
            </p>
            <IssueForm />
        </>
    );
};

export default ReportAnIssue;
