import { useEffect, useState } from "react";
import { useAuth, type User } from "../../hooks/AuthContext";
import {
    Radio,
    Input,
    Flex,
    Row,
    Col,
    Space,
    Empty,
    Typography,
    Select,
} from "antd";
import axios from "axios";
import UserCard from "./UserCard";
import NoAccess from "../../components/NoAccess";
import Loading from "../../components/Loading";

const UserDirectory: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");

    const handleSearch = () => {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<User[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/users`
                );
                const filterUsers: User[] = response.data.filter(
                    (item: User) => filter == item.access || filter == ""
                );
                setUsers(filterUsers);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching users failed:", error);
            }
        };

        fetchData();
    }, [filter]);

    let timeout: ReturnType<typeof setTimeout> | null;
    let currentValue: string;

    /*const fetch = (
        value: string,
        callback: (data: { value: string; text: string }[]) => void
    ) => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        const fake = () => {
            (d: any) => {
                if (currentValue === value) {
                    const { result } = d;
                    const data = result.map((item: any) => ({
                        value: item[0],
                        text: item[0],
                    }));
                    callback(data);
                }
            };
        };
        if (value) {
            timeout = setTimeout(fake, 300);
        } else {
            callback([]);
        }
    };*/

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
                                <Col span={8}>
                                    <UserCard cardUser={user} />
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
