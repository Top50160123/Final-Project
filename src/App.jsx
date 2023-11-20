import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link } from "react-router-dom";
import { Button, Col, Image, Row ,Typography} from "antd";

const { Title } = Typography;

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Row gutter={[8,16]} justify={'center'}>
        <Col span={12}>
        <Image
      src="/Logo.svg"
      />
        </Col>
      <Col span={24}>
        <Title level={3}
        style={{
          color:"#000",
          textAlign:"center",
          
        }}
        >
        Welcome To Our Website
        </Title>
      
      </Col>
      <Col span={24}>
      Let start for download documentation
      </Col>
      <Col span={24}>
      This website was created to test the theory about Zero - Trust.
      </Col>
      <Col span={4}>
      <Button
      style={{
        backgroundColor:"#14B538",
        color:"white",
        width:"150px",
        border:"20px"
        
      }}
      >
        <Link to={"/login"}>Login</Link>
      </Button>
      </Col>
      <Col span={4}>
      <Button
      style={{
        backgroundColor:"#F50505",
        color:"white",
        width:"150px",
        border:"20px"
        
      }}
      >
        <Link to={"/register"}>Register</Link>
      </Button>
      </Col>
      </Row>
      
    </>
  );
}

export default App;
