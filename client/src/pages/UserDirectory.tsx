import { useState } from "react";
import type { User } from "../hooks/AuthContext";
import { Radio, Input, Flex, Card, Row, Col, Button } from "antd";
import type { GetProps } from "antd";

const { Search } = Input;

type SearchProps = GetProps<typeof Input.Search>;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

const UserDirectory: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    return (
        <>
            <h1>USER DIRECTORY</h1>
            <Flex gap="20px">
                <Search
                    placeholder="ex. David Florian"
                    onSearch={onSearch}
                    enterButton
                    style={{ width: "20vw" }}
                />
                <Radio.Group defaultValue="" buttonStyle="solid">
                    <Radio.Button value="">All</Radio.Button>
                    <Radio.Button value="view">View</Radio.Button>
                    <Radio.Button value="edit">Edit</Radio.Button>
                    <Radio.Button value="admin">Admin</Radio.Button>
                </Radio.Group>
            </Flex>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Helen Wu" bordered={false}>
                        <p>Email: helen.wu@vanderbilt.edu</p>
                        <p>Access: View</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default UserDirectory;
