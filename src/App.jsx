import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link } from "react-router-dom";

import { Button, Card, Col, Image, Row, Typography } from "antd";

const { Title, Text } = Typography;

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <style>
        {`
          body {
            background-color: rgba(98, 38, 157, 0.7);
          }
        `}
      </style>
      <Row justify={"center"}>
        <Card
          style={{
            width: "1023px",
            height: "700px",
            marginTop: "100px",
          }}
        >
          <Row gutter={[8, 16]} justify={"center"}>
            <Col
              span={12}
              style={{
                marginTop: "42px",
              }}
            >
              <Image src="/Logo.svg" />
            </Col>
            <Col span={24}>
              <Title
                level={3}
                style={{
                  color: "#000",
                  textAlign: "center",
                }}
              >
                Welcome To Our Website
              </Title>
            </Col>
            <Col span={24}>
              <Text
                style={{
                  fontSize: "28px",
                  fontWeight: "200",
                }}
              >
                Let's start download documentation
              </Text>
            </Col>
            <Col span={24}>
              <Text
                style={{
                  fontSize: "28px",
                  fontWeight: "200",
                }}
              >
                This website was created to test the theory about Zero - Trust.
              </Text>
            </Col>

            <Col span={8}>
              <Link to={"/login"}>
                <Button
                  style={{
                    backgroundColor: "#14B538",
                    color: "white",
                    width: "200px",
                    height: "45px",
                    border: "20px",
                    marginTop: "130px",
                    borderRadius: "50px",
                    fontSize: "18px",
                  }}
                >
                  Login
                </Button>
              </Link>
            </Col>
            <Col span={8}>
              <Link to={"/register"}>
                <Button
                  style={{
                    backgroundColor: "#F50505",
                    color: "white",
                    width: "200px",
                    height: "45px",
                    border: "20px",
                    marginTop: "130px",
                    borderRadius: "50px",
                    fontSize: "18px",
                  }}
                >
                  Register
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </Row>
    </div>
  );
}

export default App;
