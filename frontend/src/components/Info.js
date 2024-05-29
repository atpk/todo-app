import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SimpleChart from "./SimpleChart";
import Charts from "./Charts";

const Info = () => {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  // const [error, setError] = useState(null);
  // const [ageError, setAgeError] = useState("");
  // const [weightError, setWeightError] = useState("");
  // const [heightError, setHeightError] = useState("");
  // const [genderError, setGenderError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [predictionSuccess, setpredictionSuccess] = useState(false);
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userInfoData = await Promise.all(
        response.data.map(async (userInfo) => {
          // const inputData = [[0.1, 0.2, 0.3]];
          const h = parseFloat(userInfo.height) / 100;
          const bmi = parseFloat(weight) / (h * h);
          const genderEncoded =
            userInfo.gender.toLowerCase() === "male" ? 0 : 1;

          const predictionResponse = await axios.post(
            "http://54.242.130.105:5000/predict",
            {
              input: [
                [
                  parseFloat(genderEncoded),
                  parseFloat(userInfo.age),
                  parseFloat(bmi),
                ],
              ],
            }
          );
          console.log(predictionResponse);
          setpredictionSuccess(true);

          return {
            ...userInfo,
            diabetes_probability: predictionResponse.data.prediction,
          };
        })
      );

      setTodos(userInfoData);
    } catch (error) {
      console.error("Fetch todos error", error);
      setpredictionSuccess(false);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [backendUrl, token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTodos();
  }, [token, fetchTodos, navigate]);

  const addOrUpdateTodo = async () => {
    const url = isEditing
      ? `${backendUrl}/todos/${currentTodoId}`
      : `${backendUrl}/todos`;
    const method = isEditing ? "put" : "post";
    const todoData = { name, age, weight, height, gender };

    try {
      await axios[method](url, todoData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
      setName("");
      setAge("");
      setWeight("");
      setHeight("");
      setGender("");
      setIsEditing(false);
      setCurrentTodoId(null);
    } catch (error) {
      console.error("Add/Update todo error", error);
    }
  };

  const editTodo = (todo) => {
    setName(todo.name);
    setAge(todo.age);
    setWeight(todo.weight);
    setHeight(todo.height);
    setGender(todo.gender);
    setIsEditing(true);
    setCurrentTodoId(todo._id);
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${backendUrl}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error("Delete todo error", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Info List</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="1"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          min="1"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          min="1"
          required
        />
      </div>
      <div className="mb-3">
        <select
          className="form-control"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <button className="btn btn-primary mb-3" onClick={addOrUpdateTodo}>
        {isEditing ? "Update Data" : "Add Data"}
      </button>
      <h2 className="text-center mb-4">Data Info</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Weight</th>
            <th scope="col">Height</th>
            <th scope="col">Gender</th>
            {predictionSuccess && <th scope="col">Diabetes Probability</th>}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={todo._id}>
              <th scope="row">{index + 1}</th>
              <td>{todo.name}</td>
              <td>{todo.age}</td>
              <td>{todo.weight}</td>
              <td>{todo.height}</td>
              <td>{todo.gender}</td>
              {predictionSuccess && <td>{todo.diabetes_probability}</td>}
              <td>
                <button
                  className="btn btn-info me-2"
                  onClick={() => editTodo(todo)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Simple Charts</h2>
      <SimpleChart data={todos} />
      <h2>Modifiable Charts</h2>
      <Charts data={todos} />
    </div>
  );
};

export default Info;
