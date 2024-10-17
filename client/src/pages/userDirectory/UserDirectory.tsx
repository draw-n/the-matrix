import { useEffect, useState } from "react";
import { useAuth, type User } from "../../hooks/AuthContext";
import { Radio, Input, Flex, Row, Col } from "antd";
import type { GetProps } from "antd";
import axios from "axios";
import UserCard from "./UserCard";
import NoAccess from "../../components/NoAccess";

const { Search } = Input;

type SearchProps = GetProps<typeof Input.Search>;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

const UserDirectory: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>("");

    const { user } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<User[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/users`
                );
                const filterUsers: User[] = response.data.filter(
                    (item: User) => user?.access == item.access
                );
                setUsers(filterUsers);
            } catch (error) {
                console.error("Fetching users failed:", error);
            }
        };

        fetchData();
    }, [filter]);

    return (
        <>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h1>USER DIRECTORY</h1>
                <Flex gap="20px">
                    <Search
                        placeholder="ex. David Florian"
                        onSearch={onSearch}
                        enterButton
                        style={{ width: "20vw" }}
                    />
                    <Radio.Group
                        onChange={(e) => setFilter(e.target.value)}
                        defaultValue=""
                        buttonStyle="solid"
                    >
                        <Radio.Button value="">All</Radio.Button>
                        <Radio.Button value="view">View</Radio.Button>
                        <Radio.Button value="edit">Edit</Radio.Button>
                        <Radio.Button value="admin">Admin</Radio.Button>
                    </Radio.Group>
                </Flex>
            </Flex>

            <Row gutter={16}>
                {users?.map((user: User) => {
                    return (
                        <Col span={8}>
                            <UserCard cardUser={user} />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default UserDirectory;
