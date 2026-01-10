// Description: UserDirectory component for displaying and managing the user directory with filtering and deletion capabilities.
import { useEffect, useState } from "react";
import { User } from "../../types/user";
import {
    Flex,
    Row,
    Col,
    Space,
    Empty,
    Typography,
    Segmented,
    message,
} from "antd";
import axios from "axios";
import UserCard from "./UserCard";
import Loading from "../../components/Loading";
import DownloadEmails from "./DownloadEmails";
import { useAllUsers } from "../../hooks/user";

const UserDirectory: React.FC = () => {
    const [refresh, setRefresh] = useState<number>(0);
    const [filter, setFilter] = useState<string>("");
    const {data: users, isLoading} = useAllUsers(filter ? [filter] : undefined);
    const [search, setSearch] = useState<string>("");

    const deleteUser = async (id: string) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/users/${id}`
            );
            message.success(response.data.message);
            setRefresh(refresh + 1);
        } catch (error) {
            console.error("Deleting user failed: ", error);
        }
    };


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
                            onChange={(value) => setFilter(value)}
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
                                <Col xs={24} lg={8} key={user._id}>
                                    <UserCard
                                        deleteUser={deleteUser}
                                        cardUser={user}
                                    />
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
