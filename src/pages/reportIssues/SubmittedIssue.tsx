// Description: SubmittedIssue component to display a success message after issue submission.

import { Button, Result } from "antd";
import React from "react";

interface SubmittedIssueProps {
    refreshForm: () => void;
}

const SubmittedIssue: React.FC<SubmittedIssueProps> = ({
    refreshForm,
}: SubmittedIssueProps) => {
    return (
        <Result
            status="success"
            title="Successfully Submitted an Issue!"
            subTitle="Thank you for letting us know about the problem. We will fix it as soon as possible."
            extra={[
                <Button onClick={refreshForm} key="resubmit" type="primary">
                    Submit Another
                </Button>,
            ]}
        />
    );
};

export default SubmittedIssue;
