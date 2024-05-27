import React, { useState } from "react";
import axios from "axios";

const PredictDiabetes = () => {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [diabetesProbability, setDiabetesProbability] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const predictDiabetes = async () => {
    try {
      const response = await axios.post(`${backendUrl}/todos/predict`, {
        age,
        weight,
        height,
        gender,
      });
      setDiabetesProbability(response.data.diabetes_probability);
    } catch (error) {
      console.error("Prediction error", error);
      setDiabetesProbability(null);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Predict Diabetes</h1>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={predictDiabetes}>
        Predict
      </button>
      {diabetesProbability !== null && (
        <div className="mt-3">
          <h4>Diabetes Probability: {diabetesProbability.toFixed(2)}</h4>
        </div>
      )}
    </div>
  );
};

export default PredictDiabetes;
