import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ data }) {
  const labels = data.map((d) => d.x);
  const values = data.map((d) => d.y);
  const chartData = {
    labels,
    datasets: [{ label: "Orders", data: values, borderColor: "#2563EB" }]
  };
  return <Line data={chartData} />;
}

