import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasLowercase &&
      hasUppercase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  useEffect(() => {
    if (password && !validatePassword(password)) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }

    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // password check
      if (passwordError || confirmPasswordError) {
        setErrorMessage("Please fix the errors before submitting.");
        return;
      }

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        username,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Register</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && (
            <small className="text-danger">{passwordError}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPasswordError && (
            <small className="text-danger">{confirmPasswordError}</small>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={passwordError || confirmPasswordError}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
