import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { getCreatedDocuments, SignDoc, getUrl } from "../../firebase";
import { getUserCMU } from "../../firebase";
import { saveUserCMU } from "../../firebase";
import { v4 as uuidv4 } from "uuid";


function UserPage() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [latestFile, setLatestFile] = useState("");
  const [latestUrl, setLatestUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [userData, setUserData] = useState("");
  const [userDataEmail ,setUserDataEmail] = useState("");

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.uid) {
          const documentUrl = await getUrl(user.uid);
          setLatestFile(documentUrl.FileName);
          setLatestUrl(documentUrl.latestUrl);
          console.log("Latest URL:", documentUrl.latestUrl);
          console.log("File Name:", documentUrl.FileName);
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    fetchData();
  }, [user?.uid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documents = await getCreatedDocuments();
        setPdfData(documents);
        console.log("documents : ", documents);
        documents.forEach((document) => {
          console.log("document file name : ", document.fileName);
          setFileName(document.fileName);
        });
        const typesSet = new Set(documents.map((document) => document.type));
        const uniqueTypesArray = Array.from(typesSet);
        setUniqueTypes(uniqueTypesArray);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserCMU();
        console.log("data", data);
        setUserDataEmail(data.email)
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const exportGeneratedPDF = () => {
    if (latestUrl) {
      const link = document.createElement("a");
      link.href = latestUrl;
      link.download = latestFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn("Cannot generate PDF file");
    }
  };


  const handleSignDocument = async () => {
    if (selectedType) {
      try {
        const document = pdfData.find((doc) => doc.type === selectedType);
        const { fileName, content, url } = document || {};
        const CMUUid = uuidv4();
        if(userData){
          console.log("userData?.email -2:",userDataEmail)
          await SignDoc(
            userDataEmail,
            CMUUid,
            selectedType,
            fileName,
            content,
            url
          );
        } else {
          console.log("Email");
          await SignDoc(
            user?.email,
            user?.uid,
            selectedType,
            fileName,
            content,
            url
          );
        }
        console.log("Document signed successfully!");
      } catch (error) {
        console.error("Error signing document:", error);
      }
    }
  };

  return (
    <div>
      <h2>Welcome</h2>
      {userData ? (
        <>
          {userData.map((s) => (
            <div key={s.id}>
              {s.name} {s.lastName} : {s.studentId}
            </div>
          ))}
        </>
      ) : (
        <>{user?.email}</>
      )}

      <button onClick={handleLogout} variant="danger">
        Logout
      </button>

      <div>
        <h3>PDF Data</h3>
        <label>Select Type:</label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
          }}
        >
          <option value="">Select Type</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {selectedType && (
          <div>
            <button onClick={handleSignDocument}>Confirm Sign</button>
          </div>
        )}
      </div>
      <div>Name: {fileName}</div>
      <div>download : {latestUrl}</div>
      <button onClick={exportGeneratedPDF}>Download Doc</button>
    </div>
  );
}

export default UserPage;
