import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { Button, Card, Col, Input, Row } from "antd";

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
      if (email === "admin@admin.com") {
        await logIn(email, password);
        alert("admin");
        navigate("/Documents");
      } else {
        await logIn(email, password);
        navigate("/DocumentDownload");
      }
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div>
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
                Login User
              </Col>
              <Col span={15}>
                <Input
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
              <Col span={15}>
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
              <Col span={24}>
                <Button onClick={() => {
                  window.location = "https://oauth.cmu.ac.th/v1/Authorize.aspx?response_type=code&client_id=dBH4CNbDdruZ8qyD3qqubEYdVz5xvpnqsDe7yrQb&redirect_uri=https://final-project-eta-ruby.vercel.app/callback&scope=cmuitaccount.basicinfo&state=xyz"
                }}>Login with Cmu Account</Button>
              </Col>
              <Col span={24}>
                <Button htmlType="submit">Login</Button>
              </Col>
              <Col span={24}>
                Don't have an account? <Link to="/register">Sign up</Link>
              </Col>
            </Row>
          </Card>
        </Row>
      </form>
    </div>
  );
}

export default Login;
