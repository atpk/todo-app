import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Fetch todos error", error);
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
    const todoData = { name, timeRequired };

    try {
      await axios[method](url, todoData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
      setName("");
      setTimeRequired("");
      setIsEditing(false);
      setCurrentTodoId(null);
    } catch (error) {
      console.error("Add/Update todo error", error);
    }
  };

  const editTodo = (todo) => {
    setName(todo.name);
    setTimeRequired(todo.timeRequired);
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
      <h1 className="text-center mb-4">Todo List</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Time Required"
          value={timeRequired}
          onChange={(e) => setTimeRequired(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={addOrUpdateTodo}>
        {isEditing ? "Update Todo" : "Add Todo"}
      </button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Time Required</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={todo._id}>
              <th scope="row">{index + 1}</th>
              <td>{todo.name}</td>
              <td>{todo.timeRequired}</td>
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
    </div>
  );
};

export default Todo;
