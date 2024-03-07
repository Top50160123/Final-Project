import React, { useState, useEffect } from "react";
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

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [openQr, setOpenQr] = useState(false);
  const [qr, setQr] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleDelete = async (fileName, url) => {
    try {
      await deleteRelatedDocumentsByUrl(url);
      await deleteDocumentsByUrl(url);
      await addAction("admin", "edit", fileName, url);
      const response = await fetch(
        `https://server-node-tau.vercel.app/api/delete-pdf/${fileName}`,
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
        `https://server-node-tau.vercel.app/api/delete-pdf/${fileName}`,
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

  const handleConfirmQr = async ({ user, fileName, date, url, action }) => {
    try {
      rejectPDF({
        user: user,
        fileName: fileName,
        date: date,
        url: url,
        action: action,
      });
      const response = await fetch(`https://server-node-tau.vercel.app/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: qr,
          secret: secretKey,
        }),
      });
      const data = await response.json();
      console.log("confirm to sign",data);
    } catch (error) {
      console.error("Error confirming QR:", error);
    }
  };

  const fetchSecretKey = async () => {
    try {
      const response = await fetch(`https://server-node-tau.vercel.app/api/get-secret-key`);
      const data = await response.json();
      const secretKey = data.secretKey;
      setSecretKey(secretKey);
    } catch (error) {
      console.error("Error fetching secret key:", error);
    }
  };

  useEffect(() => {
    fetchSecretKey();
  }, []);

  useEffect(() => {
    const fetchQrCodeUrl = async () => {
      try {
        const response = await fetch(
          `https://server-node-tau.vercel.app/api/generate-otp-and-qrcode`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("have qr- code");
        setQrCodeUrl(data.qrcode);
      } catch (error) {
        console.error("Error fetching QR code URL:", error);
      }
    };

    fetchQrCodeUrl();
  }, []);

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
          onClick={() => {
            setOpenQr(true);
          }}
        >
          Sign
        </button>
        {openQr ? (
          <>
            {qrCodeUrl && <img src={qrCodeUrl} />}
            <input value={qr} onChange={(e) => setQr(e.target.value)} />
            <button
              onClick={() =>
                handleConfirmQr({
                  user: user,
                  fileName: fileName,
                  date: timestampDate.toLocaleString(),
                  url: fileName.Url[0],
                  action: "sign",
                })
              }
            >
              Confirm to sign
            </button>
          </>
        ) : null}
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
