import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSubmit } from "../../functions/register";
import { DataContext } from "../../context/OTContext";

import { useUserAuth } from "../../context/UserAuthContext";
import { checkAdmin } from "../../firebase";

import { updateUser } from "../../firebase";
import { Button, Card, Col, Input, Row, Typography } from "antd";
import { MailFilled } from "@ant-design/icons";

const { Title, Text } = Typography;


function Register() {
  const { data, setData } = useContext(DataContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault();
    handleSubmit(
      e,
      data.email,
      password,
      confirmPassword,
      setError,
      navigate,
      signUp,
      checkAdmin,
      data
    );
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
      <form onSubmit={handleSend}>
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
                  Sign Up
                </Title>
              </Col>
              {error && <p>{error}</p>}
              <Col span={15}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={data.email}
                  onChange={setData}
                  style={{
                    backgroundColor: "#D9D9D9",
                    width: "623px",
                    height: "60px",
                    borderRadius: "20px",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "normal",
                  }}
                ></Input>
              </Col>
              <Col span={15}>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setData(e);
                    setPassword(e.target.value);
                  }}
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
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  htmlType="submit"
                  style={{
                    backgroundColor: "#14B538",
                    color: "white",
                    width: "305px",
                    height: "45px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "600",
                    marginTop: "60px",
                  }}
                >
                  {" "}
                  Create Account
                </Button>
              </Col>
              <Col span={24}>
                <Text
                  style={{
                    color: "#197AA4",
                    fontSize: "20px",
                  }}
                >
                  Already have an account?{" "}
                  <Link to="/login" style={{ textDecorationLine: "underline" }}>
                    Log in
                  </Link>
                </Text>
              </Col>
            </Row>
          </Card>
        </Row>
      </form>
    </div>
  );
}

export default Register;
