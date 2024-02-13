import { useState, useEffect, createContext, useContext } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';

const UserContext = createContext(null);

const CallbackPage = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (location.pathname === "/callback") {
        const codeFromURL = new URLSearchParams(location.search).get("code");

        if (codeFromURL) {
          try {
            const response = await fetch(`https://server-node-tau.vercel.app/getToken/${codeFromURL}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const response = await fetch('https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          const userData = await response.json();
          setUser(userData);
          if (userData) {
            console.log("done")
            navigate("/DocumentDownload");
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserData();
  }, [accessToken, navigate]);

  console.log("userData:", user);

  return (
    <UserContext.Provider value={user}>
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};

export default CallbackPage;
