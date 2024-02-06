import { useState, useEffect } from 'react';  import qs from 'qs';
import { useLocation } from 'react-router-dom';

const CallbackPage = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (location.pathname === "/callback") {
        const codeFromURL = new URLSearchParams(location.search).get("code");

        if (codeFromURL) {
          try {
            // const requestData = {
            //   code: codeFromURL,
            //   redirect_uri: 'https://final-project-eta-ruby.vercel.app/callback',
            //   client_id: 'dBH4CNbDdruZ8qyD3qqubEYdVz5xvpnqsDe7yrQb',
            //   client_secret: 'tYEyZQnjDzQ11j8JQDjdTQh0deHEkAfNKnaqaArf',
            //   grant_type: 'authorization_code',
            // };
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("mode", 'no-cors');
var urlencoded = new URLSearchParams();
urlencoded.append("code", codeFromURL);
urlencoded.append("redirect_uri", "https://final-project-eta-ruby.vercel.app/callback");
urlencoded.append("client_id", "dBH4CNbDdruZ8qyD3qqubEYdVz5xvpnqsDe7yrQb");
urlencoded.append("client_secret", "tYEyZQnjDzQ11j8JQDjdTQh0deHEkAfNKnaqaArf");
urlencoded.append("grant_type", "authorization_code");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://oauth.cmu.ac.th/v1/GetToken.aspx", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

            // const response = await axios.post("https://oauth.cmu.ac.th/v1/GetToken.aspx",requestData,{
              // headers:  { 'content-type': 'application/x-www-form-urlencoded' }
            // });
            // console.log(response.data);
            // setAccessToken(response.data.access_token);
          } catch (error) {
            console.error('Error:', error.message);
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
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserData();
  }, [accessToken]);

  console.log("userData:",userData)

  return null;
}

export default CallbackPage;
