import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6347",
  "#8A2BE2",
];

const Charts = ({ data }) => {
  const [lineXKey, setLineXKey] = useState("name");
  const [lineYKey, setLineYKey] = useState("diabetes_probability");
  const [barXKey, setBarXKey] = useState("name");
  const [barYKey, setBarYKey] = useState("age");
  const [pieKey, setPieKey] = useState("gender");

  const chartKeys = [
    "name",
    "age",
    "weight",
    "height",
    "gender",
    "diabetes_probability",
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Charts</h2>
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center">Diabetes Probability (Line Chart)</h3>
          <div className="mb-3">
            <label>X-Axis: </label>
            <select
              value={lineXKey}
              onChange={(e) => setLineXKey(e.target.value)}
            >
              {chartKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <label className="ml-2">Y-Axis: </label>
            <select
              value={lineYKey}
              onChange={(e) => setLineYKey(e.target.value)}
            >
              {chartKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey={lineYKey} stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey={lineXKey} />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">
            Age vs Diabetes Probability (Bar Chart)
          </h3>
          <div className="mb-3">
            <label>X-Axis: </label>
            <select
              value={barXKey}
              onChange={(e) => setBarXKey(e.target.value)}
            >
              {chartKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <label className="ml-2">Y-Axis: </label>
            <select
              value={barYKey}
              onChange={(e) => setBarYKey(e.target.value)}
            >
              {chartKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <XAxis dataKey={barXKey} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Bar dataKey={barYKey} fill="#8884d8" />
            <Bar dataKey="diabetes_probability" fill="#82ca9d" />
          </BarChart>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">Gender Distribution (Pie Chart)</h3>
          <div className="mb-3">
            <label>Key: </label>
            <select value={pieKey} onChange={(e) => setPieKey(e.target.value)}>
              {chartKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <PieChart width={500} height={300}>
            <Pie
              data={data}
              dataKey="diabetes_probability"
              nameKey={pieKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Charts;
