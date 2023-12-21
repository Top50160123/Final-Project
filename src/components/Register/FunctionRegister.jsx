export const handleSubmit = async (
  e,
  email,
  password,
  confirmPassword,
  setError,
  navigate
) => {
  e.preventDefault();
  setError("");

  if (!password && !email) {
    setError("Please enter your information.");
    return;
  }

  if (!email) {
    setError("Please enter your Google email.");
    return;
  }

  if (!password) {
    setError("Please enter your password.");
    return;
  }

  if (!confirmPassword) {
    setError("Please confirm your password.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    //navigate("/login");
    navigate("/contactUsOtp");
  } catch (err) {
    setError(err.message);
    console.error(err);
  }
};
