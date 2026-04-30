// Description: Description component providing information about the issue reporting form for the Digital Fabrication Lab.
import { Flex } from "antd";

const Description: React.FC = () => {
    return (
        <Flex gap="large"vertical align="center" justify="center" style={{ maxWidth: 600, textAlign: "center" }}>
            <h2>REPORT AN ISSUE</h2>
            <p>
                This form is NOT for class or personal usage. It is only to
                report any equipment malfunction in the Digital Fabrication Lab.
                For any other inquiries, please contact Dr. David Florian
                directly.
            </p>
        </Flex>
    );
};

export default Description;
