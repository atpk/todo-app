import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Info from "./components/Info";
import Login from "./components/Login";
import Register from "./components/Register";
import Analytics from "./components/Analytics";
import PredictDiabetes from "./components/PredictDiabetes";

const App = () => {
  const isAuthenticated = () => !!localStorage.getItem("token");
  return (
    <Router>
      <div>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/todos" element={<Info />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={isAuthenticated() ? <Info /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={
                isAuthenticated() ? <Analytics /> : <Navigate to="/login" />
              }
            />
            <Route path="/predict-diabetes" element={<PredictDiabetes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
