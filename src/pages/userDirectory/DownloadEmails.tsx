import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";

const DownloadEmails: React.FC = () => {
    const handleDownload = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/emails`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "emails.txt");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading emails:", error);
        }
    };
    return (
        <>
            <Button
                iconPosition="end"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                shape="round"
                type="primary"
                variant="filled"
            >
                Download Emails
            </Button>
        </>
    );
};

export default DownloadEmails;
