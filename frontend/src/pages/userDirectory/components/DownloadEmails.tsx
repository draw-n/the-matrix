// Description: DownloadEmails component for downloading user email addresses as a text file.

import { DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Select, Checkbox, Row, Col } from "antd";
import axios from "axios";
import { useState } from "react";
import { useAllDepartments } from "../../../hooks/useUsers";

const DownloadEmails: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: departments } = useAllDepartments();
    const [form] = Form.useForm();
    const handleDownload = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/emails`,
                { responseType: "blob" },
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
                iconPlacement="end"
                size="middle"
                icon={<DownloadOutlined />}
                onClick={() => setIsModalOpen(true)}
                shape="round"
                type="primary"
                variant="filled"
            >
                Download Emails
            </Button>

            <Modal
                title="Download Emails"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <p>Select the criteria for downloading email addresses:</p>
                <Form
                    initialValues={{
                        roles: [
                            "includeNovice",
                            "includeProficient",
                            "includeExpert",
                            "includeModerator",
                            "includeAdmin",
                        ],
                        status: [
                            "includeUndergraduate",
                            "includeGraduate",
                            "includeFaculty",
                        ],
                        departments: [],
                    }}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item label="Departments/Majors">
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            options={departments?.map((dept) => ({
                                value: dept,
                                label: dept,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item required label="Roles" name="roles">
                        <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeNovice"
                                    >
                                        Novice
                                    </Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeProficient"
                                    >
                                        Proficient
                                    </Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeExpert"
                                    >
                                        Expert
                                    </Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeModerator"
                                    >
                                        Moderator
                                    </Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeAdmin"
                                    >
                                        Admin
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item required label="Status" name="status">
                        <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeUndergraduate"
                                    >
                                        Undergraduate
                                    </Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeGraduate"
                                    >
                                        Graduate
                                    </Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        defaultChecked
                                        value="includeFaculty"
                                    >
                                        Faculty
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DownloadEmails;
