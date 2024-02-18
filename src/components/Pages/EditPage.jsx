import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteRelatedDocumentsByUrl,
  deleteDocumentsByUrl,
  UrlSign,
  addAction,
} from "../../firebase";

const DocumentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, user } = location.state;

  const timestampDate = new Date(
    fileName.timestamp.seconds * 1000 + fileName.timestamp.nanoseconds / 1000000
  );

  const signPDF = async () => {
    console.log("sign pdf");
  };

  const handleDelete = async (fileName, url) => {
    try {
      await deleteRelatedDocumentsByUrl(url);
      await deleteDocumentsByUrl(url);
      await addAction("admin", "edit", fileName, url);
      const response = await fetch(
        `http://localhost:5004/api/delete-pdf/${fileName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete PDF");
      }

      const data = await response.json();
      if (data) {
        navigate("/CreateDocuments");
      }
    } catch (error) {
      console.error("Delete fail:", error);
    }
  };

  const handleDeletes = async (fileName, url) => {
    try {
      await deleteRelatedDocumentsByUrl(url);
      await deleteDocumentsByUrl(url);
      await addAction("admin", "delete", fileName, url);
      const response = await fetch(
        `http://localhost:5004/api/delete-pdf/${fileName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete PDF");
      }

      const data = await response.json();
      if (data) {
        navigate("/Documents");
      }
    } catch (error) {
      console.error("Delete fail:", error);
    }
  };

  const rejectPDF = async ({ user, fileName, date, url, action }) => {
    try {
      await addAction("admin", action, fileName, url);
      await UrlSign(user, fileName, date, url, action);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <h1>Detail Page</h1>
        <p>User: {user}</p>
        <p>Type: {fileName.type}</p>
        <p>Date: {timestampDate.toLocaleString()}</p>
        <a href={fileName.Url[0]}>asdasd</a>
        <button
          onClick={() =>
            rejectPDF({
              user: user,
              fileName: fileName,
              date: timestampDate.toLocaleString(),
              url: "",
              action: "reject",
            })
          }
        >
          Reject
        </button>
        <button
          onClick={() =>
            rejectPDF({
              user: user,
              fileName: fileName,
              date: timestampDate.toLocaleString(),
              url: fileName.Url[0],
              action: "sign",
            })
          }
        >
          Sign
        </button>
        <button onClick={() => handleDelete(fileName.type, fileName.Url[0])}>
          Edit
        </button>
        <button onClick={() => handleDeletes(fileName.type, fileName.Url[0])}>
          Delete
        </button>
      </div>
    </>
  );
};

export default DocumentDetail;
