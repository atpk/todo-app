import React from "react";
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

const SimpleChart = ({ data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Charts</h2>
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center">Diabetes Probability (Line Chart)</h3>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line
              type="monotone"
              dataKey="diabetes_probability"
              stroke="#8884d8"
            />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">
            Age vs Diabetes Probability (Bar Chart)
          </h3>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Bar dataKey="age" fill="#8884d8" />
            <Bar dataKey="diabetes_probability" fill="#82ca9d" />
          </BarChart>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">Gender Distribution (Pie Chart)</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={data}
              dataKey="diabetes_probability"
              nameKey="gender"
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

export default SimpleChart;
