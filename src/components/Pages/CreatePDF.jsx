import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPdf, addAction } from "../../firebase";
import { Input, Button, Row, Col } from "antd";

const { TextArea } = Input;

const CreatePDF = () => {
  const [userInput, setUserInput] = useState("");
  const [fileName, setFileName] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleExportPdf = async () => {
    try {
      const response = await fetch(
        `https://server-node-tau.vercel.app/generate-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput, fileName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const data = await response.json();
      if (data) {
        alert("Create Success");
      }
      await createPdf(data.fileName, data.url, "admin");
      await addAction("admin", "create", data.fileName, data.url);
    } catch (error) {
      console.error("Error-ExportPdf:", error);
    }
  };

  return (
    <div>
      <h1>Create Document</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <Row justify={"center"}>
          <Col span={2}>File Name:</Col>
          <Col>
            <Input value={fileName} onChange={handleFileNameChange} />
          </Col>
        </Row>
        <br />
        <TextArea
          style={{
            marginBottom: "10px",
          }}
          rows={8}
          value={userInput}
          onChange={handleInputChange}
        />
        <br />
        <Button type="primary" onClick={handleExportPdf}>
          Export PDF
        </Button>
      </form>
      <Link to="/Documents">Back to List</Link>
    </div>
  );
};

export default CreatePDF;
