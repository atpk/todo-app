import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmNewPassword) {
        setMessage("Passwords do not match");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`,
        { email, otp, newPassword }
      );
      setMessage(response.data.message);
      if (response.data.message === "Password reset successfully") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset Password error", error);
      setMessage("Failed to reset password");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Reset Password</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleResetPassword}>
        {/* <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div> */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
