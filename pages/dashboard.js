import React from 'react'
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useRouter } from "next/router";
import SideBar from '@/components/SideBar';
function Dashboard() {
      const [symbol, setSymbol] = useState("NIFTY 50");
      const [fromDate, setFromDate] = useState("2017-01-01");
      const [toDate, setToDate] = useState("2017-12-31");
      const [data, setData] = useState([]);
      const [profile,setProfile]=useState([]);
      console.log(profile)
       console.log(data)

      const chartRef = useRef(null);
      const router = useRouter();
      


  useEffect(() => {
    // Check if the user is authenticated
    // If not, redirect to the login page
    // Implement your own authentication logic here
    const isAuthenticated = localStorage.getItem("accessToken"); // Replace with your authentication logic

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, []);

    useEffect(() => {
      fetchProfileData( );
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
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `/api/user/profile`
        );
        const responseData = await response.json();
        setProfile(responseData.data);
        
      } catch (error) {
        console.error(error);
      }
    };

    const createChart = (chartData) => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const labels = chartData.map((entry) => new Date(entry.date).toLocaleDateString());
      console.log(labels)
    
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
    <div className="bg-pink-100 text-black h-screen  flex flex-row  ">
      <SideBar className="" />
      <div className=" lg:ml-72 flex-1 p-10">
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
        <canvas id="chart" width="200" height="100"></canvas>
        <div></div>
      </div>
      <div className=" shadow-lg shadow-purple-400 rounded-full  ">
        <section class=" bg-[#071e34] flex font-medium items-center justify-center h-screen">
          <section class="w-72 mx-auto bg-[#20354b] rounded-2xl p-1 px-8 py-6 shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-gray-400 text-sm">{profile.user_id}</span>
              {/* <span class="text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </span> */}
            </div>
            {/* <div class="mt-6 w-fit mx-auto">
            <img src="https://api.lorem.space/image/face?w=120&h=120&hash=bart89fe" class="rounded-full w-28 " alt="profile picture" srcset="" />   </div> */}

            <div class="mt-8 ">
              <div class="text-white font-bold text-2xl tracking-wide">
                {profile?.user_name} <br /> <p className='opacity-80 text-xl'>{profile?.email}</p>
              </div>
            </div>
            <p class="text-emerald-400 font-semibold mt-2.5">{profile?.user_type}</p>

            <div class="h-1 w-full bg-black mt-8 rounded-full">
              <div class="h-1 rounded-full w-5/5 bg-yellow-500 "></div>
            </div>
            <div class="mt-3 text-white text-sm">
              BROKER : 
              <span class="text-gray-400 font-semibold pl-3 ">{profile?.broker}</span>
            
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

export default Dashboard