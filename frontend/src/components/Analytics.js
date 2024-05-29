// Analytics.js
import React, { useState, useEffect, useCallback } from "react";
import { fetchTodos } from "../api";
import Charts from "./Charts";
import SimpleChart from "./SimpleChart";

const Analytics = () => {
  const [todos, setTodos] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  const loadTodos = useCallback(async () => {
    const todosData = await fetchTodos(backendUrl, token);
    setTodos(todosData);
  }, [backendUrl, token]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Analytics</h1>
      <h2>Simple Charts</h2>
      <SimpleChart data={todos} />
      <h2>Modifiable Charts</h2>
      <Charts data={todos} />
    </div>
  );
};

export default Analytics;
