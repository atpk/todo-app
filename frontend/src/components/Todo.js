import React, { useState, useEffect } from "react";
import axios from "axios";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(`${backendUrl}/todos`);
    setTodos(response.data);
  };

  const addOrUpdateTodo = async () => {
    if (isEditing) {
      await axios.put(`${backendUrl}/todos/${currentTodoId}`, {
        name,
        timeRequired,
      });
      setIsEditing(false);
      setCurrentTodoId(null);
    } else {
      const newTodo = { name, timeRequired };
      await axios.post(`${backendUrl}/todos`, newTodo);
    }
    fetchTodos();
    setName("");
    setTimeRequired("");
  };

  const editTodo = (todo) => {
    setName(todo.name);
    setTimeRequired(todo.timeRequired);
    setIsEditing(true);
    setCurrentTodoId(todo._id);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${backendUrl}/todos/${id}`);
    fetchTodos();
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
