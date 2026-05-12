// Description: UserCard component for displaying and editing user information in the user directory.

import {
    Button,
    Card,
    Flex,
    Popconfirm,
    Select,
    Space,
    Tag,
    Typography,
} from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import { UserAccess, WithUser } from "../../../types/user";
import { useState } from "react";
import {
    ArrowRightOutlined,
    CaretDownFilled,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDeleteUserById, useEditUserById } from "../../../hooks/useUsers";
import AutoAvatar from "../../../components/common/AutoAvatar";

const UserCard: React.FC<WithUser> = ({ user: cardUser }) => {
    const [editAccess, setEditAccess] = useState<string>(
        cardUser?.access || "novice",
    );
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <>
            <Card style={{ height: "100%" }}>
                {/* <Card.Meta
                    description={
                        <Flex flex={1} justify="space-between" align="end">
                            <p
                                style={{
                                    textTransform: "capitalize",
                                    color: "#a9a9a9",
                                    fontSize: "0.85em",
                                }}
                            >
                                {`${cardUser?.access} • ${cardUser?.status}`}
                            </p>
                            <Button
                                size="small"
                                icon={<ArrowRightOutlined />}
                                variant="text"
                                type="text"
                                onClick={() =>
                                    navigate(`/users/${cardUser?.uuid || ""}`)
                                }
                            />
                        </Flex>
                    }
                    title={
                        <Flex vertical gap="large">
                            <Flex gap="middle" align="center" wrap>
                                <a href={`mailto:${cardUser?.email}`}>
                                    <AutoAvatar
                                        text={
                                            `${cardUser?.firstName?.charAt(0) || ""}${cardUser?.lastName?.charAt(0) || ""}` ||
                                            "?"
                                        }
                                    />
                                </a>
                                <Typography.Text
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        whiteSpace: "normal", // 👈 allow wrapping
                                        overflowWrap: "anywhere", // 👈 break long words if needed
                                    }}
                                >
                                    {`${cardUser?.firstName} ${cardUser?.lastName}`}
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    }
                /> */}
                <Flex vertical gap="small" style={{ flex: 1, height: "100%" }}>
                    {/* Top content */}
                    <Flex vertical gap="small">
                        <Flex gap="middle" align="center" wrap>
                            <a href={`mailto:${cardUser?.email}`}>
                                <AutoAvatar
                                    text={
                                        `${cardUser?.firstName?.charAt(0) || ""}${cardUser?.lastName?.charAt(0) || ""}` ||
                                        "?"
                                    }
                                />
                            </a>

                            <Typography.Text
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    whiteSpace: "normal",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {`${cardUser?.firstName} ${cardUser?.lastName}`}
                            </Typography.Text>
                        </Flex>
                    </Flex>

                    <Flex
                        justify="space-between"
                        align="center"
                        style={{ marginTop: "auto" }} // 👈 THIS pins it to bottom
                    >
                        <Typography.Text
                            style={{
                                textTransform: "capitalize",
                                color: "#a9a9a9",
                                fontSize: "0.85em",
                            }}
                        >
                            {`${cardUser?.access} • ${cardUser?.status}`}
                        </Typography.Text>

                        <Button
                            size="small"
                            icon={<ArrowRightOutlined />}
                            type="text"
                            onClick={() =>
                                navigate(`/directory/${cardUser?.uuid || ""}`)
                            }
                        />
                    </Flex>
                </Flex>
            </Card>
        </>
    );
};

export default UserCard;
