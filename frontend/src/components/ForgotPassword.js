import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`,
        { email, recaptchaToken }
      );
      setMessage(response.data.message);
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error("Forgot Password error", error);
      setMessage("Failed to send OTP");
    }
  };

  const onReCAPTCHAChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Forgot Password</h1>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleForgotPassword}>
        {step === 1 && (
          <>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={onReCAPTCHAChange}
            />
          </>
        )}
        <button type="submit" className="btn btn-primary">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
