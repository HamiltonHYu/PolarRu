import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Graph = (props) => {
  const data = [];
  for (let i = 0; i < props.state.poll.options.length; i++) {
    const option = props.state.poll.options[i];
    data.push({ name: option, count: 0, fill: COLORS[i % COLORS.length] });
  }
  for (let response of props.state.poll.responses) {
    data[response.vote].count++;
  }

  return (
    <div style={{ height: "50vh", width: "30vw" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={150} height={40} data={data}>
          <XAxis dataKey="name" style={{ fontSize: ".5rem" }} />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
