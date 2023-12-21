import React, { useState, useEffect } from "react";
import { generatePDF } from "../../functions/createpdf";
import { useLocation, Link } from "react-router-dom";
import { createPdf, addAction } from "../../firebase";

const CreatePDF = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [userInput, setUserInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleExportPdf = async () => {
    const result = await generatePDF(userInput, fileName);

    if (result.success) {
      const pdfUrl = result.fileUrl;
      setGeneratedPdfUrl(pdfUrl);

      try {
        if (userId) {
          await addAction(
            "admin",
            userId,
            "create",
            "English Transcript",
            fileName,
            userInput,
            pdfUrl
          );
          await createPdf(
            "create",
            "English Transcript",
            fileName,
            userInput,
            pdfUrl
          );
        } else {
          console.error("userId is undefined");
        }
      } catch (error) {
        console.error("Error saving PDF to database:", error);
      }
    }
  };

  useEffect(() => {
    console.log("generatedPdfUrl:", generatedPdfUrl);
  }, [generatedPdfUrl]);

  return (
    <div>
      <h1>Create Document</h1>
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
