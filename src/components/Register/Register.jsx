import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSubmit } from "../../functions/register";
import { DataContext } from "../../context/OTContext";
import { Button, Card, Col, Input, Row } from "antd";
import { useUserAuth } from "../../context/UserAuthContext";
import { checkAdmin } from "../../firebase";

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
      {/* <div>
        <div>
          <h2>Register</h2>
          {error && <p>{error}</p>}
          <form onSubmit={handleSend}>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={data.email}
                onChange={setData}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setData(e);
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button type="submit">Register</button>
            </div>
          </form>
          <div>
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div> */}
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
                Sign Up
              </Col>
              {error && <p>{error}</p>}
              <Col span={15}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={data.email}
                  onChange={setData}
                />
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
                />
              </Col>
              <Col span={15}>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Col>
              <Col span={24}>
                <Button htmlType="submit"> Create Account</Button>
              </Col>
              <Col span={24}>
                Already have an account? <Link to="/login">Log in</Link>
              </Col>
            </Row>
          </Card>
        </Row>
      </form>
    </div>
  );
}

export default Register;
