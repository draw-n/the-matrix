import { Alert, Card, Descriptions, Flex, Space } from "antd";
import { WithUser } from "../../../types/user";

const PersonalInfoCard: React.FC<WithUser> = ({ user }) => {
    const descriptionsItems = [
        {
            key: "1",
            label: "First Name",
            children: (
                <p style={{ textTransform: "capitalize" }}>
                    {user?.firstName ? user.firstName : "N/A"}
                </p>
            ),
        },
        {
            key: "2",
            label: "Last Name",
            children: <p>{user?.lastName ? user.lastName : "N/A"}</p>,
        },
        {
            key: "3",
            label: "Email",
            children: <p>{user?.email ? user.email : "N/A"}</p>,
        },
        {
            key: "4",
            label: "Status",
            children: (
                <p
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {user?.status ? user.status : "N/A"}
                </p>
            ),
        },
        {
            key: "5",
            label: "Graduation Year",
            children: (
                <p
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {user?.graduationDate
                        ? new Date(user.graduationDate).getFullYear()
                        : "N/A"}
                </p>
            ),
        },
        {
            key: "6",
            label: "Department(s)",
            children: (
                <p
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {user?.departments?.join(", ") || "N/A"}
                </p>
            ),
        },
    ];

    return (
        <Card>
            <Space style={{ width: "100%" }} vertical size="large">
                <Alert
                    message="To have your access role changed, contact Dr. David Florian by email directly."
                    type="info"
                    style={{ width: "100%", textAlign: "center" }}
                />
                <Flex justify="space-between" style={{ width: "100%" }}>
                    <h2>Personal Information</h2>
                    {/* <Button
                                    onClick={handleClick}
                                    shape="circle"
                                    variant="filled"
                                    type="primary"
                                    icon={
                                        editMode ? (
                                            <SaveOutlined />
                                        ) : (
                                            <EditOutlined />
                                        )
                                    }
                                /> */}
                </Flex>
                <Descriptions
                    layout="vertical"
                    colon={false}
                    items={descriptionsItems}
                />
            </Space>
        </Card>
    );
};

export default PersonalInfoCard;