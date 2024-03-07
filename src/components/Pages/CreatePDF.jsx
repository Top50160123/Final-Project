import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPdf, addAction } from "../../firebase";

const CreatePDF = () => {
  const [userInput, setUserInput] = useState("");
  const [fileName, setFileName] = useState("");
  // const location = useLocation();
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
      await createPdf(data.fileName, data.url, "admin");
      await addAction("admin", "create", data.fileName, data.url);
    } catch (error) {
      console.error("Error-ExportPdf:", error);
    }
  };

  return (
    <div>
      <h1>Create Document</h1>
      {/* {location.state && <>{location.state.userId.Name}</>} */}
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          File Name:
          <input type="text" value={fileName} onChange={handleFileNameChange} />
        </label>
        <br />
        <textarea
          rows="4"
          cols="50"
          value={userInput}
          onChange={handleInputChange}
        />
        <br />
        <button type="button" onClick={handleExportPdf}>
          Export PDF
        </button>
      </form>
      <Link to="/Documents">Back to List</Link>
    </div>
  );
};

export default CreatePDF;
