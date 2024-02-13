import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { userCMU } from "../firebase";
import { getUserCMU } from "../firebase";

const CallbackPage = () => {
  const location = useLocation();
  const [userCmu, setUserCmu] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (location.pathname === "/callback") {
        const codeFromURL = new URLSearchParams(location.search).get("code");

        if (codeFromURL) {
          try {
            const response = await fetch(
              `https://server-node-tau.vercel.app/getToken/${codeFromURL}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setAccessToken(result.access_token);
            console.log("result :", result.access_token);
          } catch (error) {
            console.error("Wrong to Sign", error.message || "Wrong to Sign");
          }
        }
      }
    };

    fetchData();
  }, [location]);
  console.log("Token หน้าบ้าน:", accessToken);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const response = await fetch(
            "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const userData = await response.json();
          const uid = uuidv4();
          setUserCmu({ ...userData, uid });
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    const updateUserCmu = async () => {
      try {
        if (userCmu) {
          console.log("userData:", userData);
          const userCMUObject = {
            firstname_TH: userCmu.firstname_TH,
            lastname_TH: userCmu.lastname_TH,
            student_id: userCmu.student_id,
            uid: userCmu.uid,
          };
          await userCMU(userCMUObject);
          navigate("/DocumentDownload");
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    };

    updateUserCmu();
  }, [navigate, userCmu]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserCMU();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return null;
};

export default CallbackPage;
