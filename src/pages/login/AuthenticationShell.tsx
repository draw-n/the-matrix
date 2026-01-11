// Description: Parent shell for authentication pages

import { PropsWithChildren } from "react";
import DFLogo from "../../assets/Digital-Fabrication-V.png";
import { theme, Card, Flex, Row, Col } from "antd";
const AuthenticationShell: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const colorPrimary = theme.useToken().token.colorPrimary;
    const colorTextBase = theme.useToken().token.colorTextBase;

    return (
        <>
            <Flex
                style={{
                    padding: 20,
                    color: "white",
                    background: `linear-gradient(0deg, ${colorPrimary}, ${colorTextBase})`,
                    width: "100vw",
                    height: "100vh",
                }}
                align="center"
                justify="center"
            >
                <Row
                    gutter={[100, 100]}
                    style={{ width: "100%", maxWidth: "90vw" }}
                >
                    <Col md={10} span={24}>
                        <Flex
                            justify="center"
                            align="center"
                            style={{ height: "100%" }}
                        >
                            <img
                                src={DFLogo}
                                alt="Digital Fabrication Lab Logo"
                                style={{ maxWidth: "50vw", width: "100%" }}
                            />
                        </Flex>
                    </Col>
                    <Col md={14} span={24}>
                        <Card>{children}</Card>
                    </Col>
                </Row>
            </Flex>
        </>
    );
};

export default AuthenticationShell;
