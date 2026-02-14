// Description: UserDirectory component for displaying and managing the user directory with filtering and deletion capabilities.
import { useState } from "react";
import { User, UserAccess } from "../../types/user";
import { Flex, Row, Col, Space, Empty, Typography, Segmented } from "antd";
import UserCard from "./components/UserCard";
import Loading from "../../components/routing/Loading";
import DownloadEmails from "./components/DownloadEmails";
import { useAllUsers } from "../../hooks/useUsers";

const UserDirectory: React.FC = () => {
    const [filter, setFilter] = useState<UserAccess | "">("");
    const { data: users, isLoading } = useAllUsers(
        filter ? [filter] : undefined,
    );
    const [search, setSearch] = useState<string>("");

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Flex
                    style={{ width: "100%" }}
                    justify="space-between"
                    align="center"
                >
                    <Flex gap="20px">
                        <DownloadEmails />
                        <Segmented
                            options={[
                                { label: "All", value: "" },
                                { label: "Novice", value: "novice" },
                                { label: "Proficient", value: "proficient" },
                                { label: "Expert", value: "expert" },
                                { label: "Moderator", value: "moderator" },
                                { label: "Admin", value: "admin" },
                            ]}
                            onChange={(value) =>
                                setFilter(value as UserAccess | "")
                            }
                            defaultValue=""
                        />

                        {/*
                            <Select
                            showSearch
                            value={value}
                            placeholder={props.placeholder}
                            defaultActiveFirstOption={false}
                            suffixIcon={null}
                            filterOption={false}
                            onSearch={handleSearch}
                            onChange={handleChange}
                            notFoundContent={null}
                            options={(data || []).map((d) => ({
                                value: d.value,
                                label: d.text,
                            }))}
                        />
                        
                        
                        */}
                    </Flex>
                </Flex>
                {isLoading ? (
                    <Loading />
                ) : (
                    <Row gutter={[16, 16]}>
                        {users?.map((user: User) => {
                            return (
                                <Col xs={24} lg={8} key={user.uuid}>
                                    <UserCard user={user} />
                                </Col>
                            );
                        })}
                        {users?.length == 0 && (
                            <Flex
                                align="center"
                                justify="center"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Empty
                                    description={
                                        <Typography.Text>
                                            No users under this type.
                                        </Typography.Text>
                                    }
                                />
                            </Flex>
                        )}
                    </Row>
                )}
            </Space>
        </>
    );
};

export default UserDirectory;
