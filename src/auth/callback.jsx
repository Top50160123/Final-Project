import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userCMU } from "../firebase";

const CallbackPage = () => {
  const location = useLocation();
  const [userCmu, setUserCmu] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

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
          } catch (error) {
            console.error("Wrong to Sign", error.message || "Wrong to Sign");
          }
        }
      }
    };

    fetchData();
  }, [location]);

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
          // const uid = uuidv4();
          setUserCmu(userData);
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
          if (
            userCmu.student_id === "630615023" ||
            userCmu.student_id === "630615045" ||
            userCmu.organization_code === "52"
          ) {
            const userCMUObject = {
              name: userCmu.firstname_TH,
              lastName: userCmu.lastname_TH,
              studentId: userCmu.student_id,
              email: userCmu.cmuitaccount,
            };
            navigate("/Documents", { state: userCMUObject });
          } else {
            const userCMUObject = {
              name: userCmu.firstname_TH,
              lastName: userCmu.lastname_TH,
              studentId: userCmu.student_id,
              email: userCmu.cmuitaccount,
            };
            navigate("/DocumentDownload", { state: userCMUObject });
          }
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    };

    updateUserCmu();
  }, [navigate, userCmu]);

  return <>loading...</>;
};

export default CallbackPage;
