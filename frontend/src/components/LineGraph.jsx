import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const LineGraph = ({ labels, values, labelName = "Test", lineColor = "#8884d8" }) => {
  const data = labels.map((label, index) => ({
    name: label,
    [labelName]: parseFloat(values[index])
  }));

  return (
    <div className="w-full h-64 my-4">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={labelName} stroke={lineColor} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;