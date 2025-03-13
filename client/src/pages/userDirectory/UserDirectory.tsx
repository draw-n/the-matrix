import { useEffect, useState } from "react";
import { useAuth, type User } from "../../hooks/AuthContext";
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

const UserDirectory: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [filter, setFilter] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (filter) {
                    response = await axios.get<User[]>(
                        `${
                            import.meta.env.VITE_BACKEND_URL
                        }/users?access=${filter}`
                    );
                } else {
                    response = await axios.get<User[]>(
                        `${import.meta.env.VITE_BACKEND_URL}/users`
                    );
                }

                setUsers(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching users failed:", error);
            }
        };

        fetchData();
    }, [filter, refresh]);

    return (
        <>
            <Space style={{ width: "100%" }} direction="vertical" size="middle">
                <Flex
                    style={{ width: "100%" }}
                    justify="space-between"
                    align="center"
                >
                    <h1>USER DIRECTORY</h1>
                    <Flex gap="20px">
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
                                <Col span={8} key={user._id}>
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
