import React, { useState } from "react";
import axios from "axios";

const PredictDiabetes = () => {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const [ageError, setAgeError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [genderError, setGenderError] = useState("");

  const validateAge = () => {
    if (age === "") {
      setAgeError("Age is required.");
    } else if (parseFloat(age) <= 0) {
      setAgeError("Age must be a positive number.");
    } else {
      setAgeError("");
    }
  };

  const validateWeight = () => {
    if (weight === "") {
      setWeightError("Weight is required.");
    } else if (parseFloat(weight) <= 0) {
      setWeightError("Weight must be a positive number.");
    } else {
      setWeightError("");
    }
  };

  const validateHeight = () => {
    if (height === "") {
      setHeightError("Height is required.");
    } else if (parseFloat(height) <= 0) {
      setHeightError("Height must be a positive number.");
    } else {
      setHeightError("");
    }
  };

  const validateGender = () => {
    if (gender === "") {
      setGenderError("Gender is required.");
    } else if (!["male", "female"].includes(gender.toLowerCase())) {
      setGenderError("Gender must be either 'male' or 'female'.");
    } else {
      setGenderError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setPrediction(null);

    validateAge();
    validateWeight();
    validateHeight();
    validateGender();

    if (ageError || weightError || heightError || genderError) {
      setError("Please fix the errors above and try again.");
      return;
    }

    try {
      const h = parseFloat(height) / 100;
      const bmi = parseFloat(weight) / (h * h);
      const genderEncoded = gender.toLowerCase() === "male" ? 0 : 1;

      const response = await axios.post("http://54.242.130.105:5000/predict", {
        input: [[parseFloat(age), parseFloat(bmi), parseFloat(genderEncoded)]],
      });

      if (response.data && response.data.prediction) {
        setPrediction(response.data.prediction);
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError("Error making prediction. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Predict Diabetes</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="number"
            className={`form-control ${ageError ? "is-invalid" : ""}`}
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onBlur={validateAge}
            min="1"
            required
          />
          {ageError && <div className="invalid-feedback">{ageError}</div>}
        </div>
        <div className="mb-3">
          <input
            type="number"
            className={`form-control ${weightError ? "is-invalid" : ""}`}
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={validateWeight}
            min="1"
            required
          />
          {weightError && <div className="invalid-feedback">{weightError}</div>}
        </div>
        <div className="mb-3">
          <input
            type="number"
            className={`form-control ${heightError ? "is-invalid" : ""}`}
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onBlur={validateHeight}
            min="1"
            required
          />
          {heightError && <div className="invalid-feedback">{heightError}</div>}
        </div>
        <div className="mb-3">
          <select
            className={`form-control ${genderError ? "is-invalid" : ""}`}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            onBlur={validateGender}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {genderError && <div className="invalid-feedback">{genderError}</div>}
        </div>
        {error && (
          <div className="alert alert-warning">
            <p>{error}</p>
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Predict
        </button>
      </form>
      <div>
        <h1> </h1>
      </div>
      {prediction !== null && (
        <div className="alert alert-success mt-4">
          <h2>Diabetes Prediction:</h2>
          <p>{prediction}</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-4">
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default PredictDiabetes;
