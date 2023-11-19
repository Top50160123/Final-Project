import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";

function Home() {
  const { logOut, user } = useUserAuth();

  console.log(user);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <h2>Welcome</h2>
      <p>{user?.email}</p>
      <button onClick={handleLogout} variant="danger">
        Logout
      </button>
    </div>
  );
}

export default Home;
