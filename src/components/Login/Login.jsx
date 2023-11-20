import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { Button, Card, Col, Input, Row, Typography } from "antd";

const { Title, Text } = Typography;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div>
      <style>
        {`
          body {
            background-color: rgba(98, 38, 157, 0.7);
          }
        `}
      </style>
      {/* <div>
        <div>
          <h2>Login</h2>
          {error && <div variant="danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div controlid="formBasicEmail">
              <input
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div controlid="formBasicPassword">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button type="submit">Sign In</button>
            </div>
          </form>
          <div className="p-4 box mt-3 text-center">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div> */}
      <form onSubmit={handleSubmit}>
        <Row gutter={[8, 8]} justify={"center"}>
          <Card
            style={{
              width: "1023px",
              height: "700px",
              marginTop: "100px",
            }}
          >
            <Row gutter={[8, 16]} justify={"center"}>
              <Col
                span={24}
                style={{
                  marginTop: "100px",
                }}
              >
                <Title
                  level={2}
                  style={{
                    color: "var(--primary-500, #0277BD)",
                    fontSize: "40px",
                    fontWeight: "600",
                  }}
                >
                  Login User
                </Title>
              </Col>
              <Col span={15}>
                <Input
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    backgroundColor: "#D9D9D9",
                    width: "623px",
                    height: "60px",
                    borderRadius: "20px",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "normal",
                  }}
                />
              </Col>
              <Col span={15}>
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    backgroundColor: "#D9D9D9",
                    width: "623px",
                    height: "60px",
                    borderRadius: "20px",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "normal",
                  }}
                />
              </Col>
              <Col span={24}>
                <Button
                  style={{
                    backgroundColor: "rgba(98, 38, 157, 0.70)",
                    color: "white",
                    width: "623px",
                    height: "45px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  Login with Cmu Account
                </Button>
              </Col>
              <Col span={24}>
                <Button
                  htmlType="submit"
                  style={{
                    backgroundColor: "rgba(98, 38, 157, 0.70)",
                    color: "white",
                    width: "305px",
                    height: "45px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  Login
                </Button>
              </Col>
              <Col span={24}>
                <Text
                  style={{
                    color: "#197AA4",
                    fontSize: "20px",
                  }}
                >
                  Don't have an account? <Link to="/register">Sign up</Link>
                </Text>
              </Col>
            </Row>
          </Card>
        </Row>
      </form>
    </div>
  );
}

export default Login;
