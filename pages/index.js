import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import { useRouter } from "next/router";

export default function Home() {
  const [symbol, setSymbol] = useState("NIFTY 50");
  const [fromDate, setFromDate] = useState("2017-01-01");
  const [toDate, setToDate] = useState("2017-12-31");
  const [data, setData] = useState([]);

  const chartRef = useRef(null);
   const router = useRouter();



  useEffect(() => {
    // Check if the user is authenticated
    // If not, redirect to the login page
    // Implement your own authentication logic here
      const isAuthenticated = localStorage.getItem("accessToken"); // Replace with your authentication logic

    if (!isAuthenticated) {
      router.push('/login');}
    else {
      router.push('/dashboard')
    }}, []);
      

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/api?symbol=${symbol}&from_date=${fromDate}&to_date=${toDate}`
      );
      const responseData = await response.json();
      setData(responseData);
      createChart(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const createChart = (chartData) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = chartData.map((entry) => entry.date);
    const prices = chartData.map((entry) => entry.price);

    const ctx = document.getElementById("chart").getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Price",
            data: prices,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Price",
            },
          },
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div  className="bg-white text-black">
      <h1>Historical Data Chart</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Symbol:
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            <option value="NIFTY 50">NIFTY</option>
            <option value="NIFTY BANK">BANKNIFTY</option>
          </select>
        </label>
        <label>
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To Date:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <canvas id="chart" width="400" height="200"></canvas>
    </div>
  );
}
