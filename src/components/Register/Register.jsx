import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { Button, Card, Col, Form, Input, Row, Typography } from "antd";

const { Title, Text } = Typography;

function Register() {
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSend = async (values) => {
    try {
      const { email, password } = values;
      await signUp(email, password);
      navigate("/login"); // Redirect to login page after successful registration
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
      <Form
        form={form}
        onFinish={handleSend}
        layout="vertical"
        style={{ maxWidth: "600px", margin: "0 auto", marginTop: "100px" }}
      >
        <Card>
          <Row gutter={[8, 16]} justify={"center"}>
            <Col span={24}>
              <Title level={2}>Sign Up</Title>
            </Col>
            {error && <p>{error}</p>}
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email address"
                rules={[
                  {
                    required: true,
                    message: "Please input your email address",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: "Password cannot contain special characters",
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Button type="primary" htmlType="submit">
                Create Account
              </Button>
            </Col>
            <Col span={24}>
              <Text>
                Already have an account? <Link to="/login">Log in</Link>
              </Text>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}

export default Register;
