import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSubmit } from "./FunctionRegister";
import { DataContext } from "../../context/OTContext";
import { updateUser } from "../../firebase";

function Register() {
  const { data, setData } = useContext(DataContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault();
    handleSubmit(e, data.email, password, confirmPassword, setError, navigate);
  };

  return (
    <div>
      <div>
        <div>
          <h2>Register</h2>
          {error && <p>{error}</p>}
          <form onSubmit={handleSend}>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={data.email}
                onChange={setData}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setData(e);
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button type="submit">Register</button>
            </div>
          </form>
          <div>
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
