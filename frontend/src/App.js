import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Info from "./components/Info";
import Login from "./components/Login";
import Register from "./components/Register";
import PredictDiabetes from "./components/PredictDiabetes";

const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/todos" element={<Info />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route path="/predict-diabetes" element={<PredictDiabetes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
