import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { localhost } from '@/url';
import getEmailFromToken from '@/utils/decode';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [properties, setProperties] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalGross, setTotalGross] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const userEmail = getEmailFromToken()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(localhost+'/api/property/Dashboard', {
          params: { userEmail },
        });
        const data = response.data;
        console.log(response.data);
        
        setProperties(data.properties);
        setTotalBookings(data.totalBookings);
        setTotalGross(data.totalGross);
        setTotalProfit(data.totalProfit);
        setChartData(data.chartData);
        setTopHotels(data.topHotels);
        setTrendingDestinations(data.trendingDestinations);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [userEmail]);

  const barChartData = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Bookings by Month',
        data: chartData.map(item => item.bookings),
        backgroundColor: '#e38624',
        borderColor: '#FFFFFF',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Dashboard</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-sm">No of Properties</h3>
          <p className="text-2xl font-bold">{properties}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-sm">Total Bookings</h3>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-sm">Total Gross</h3>
          <p className="text-2xl font-bold">₹{totalGross.toLocaleString()}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-sm">Total Profit</h3>
          <p className="text-2xl font-bold">₹{totalProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Top Hotels with Most Bookings</h3>
          <ul className="mt-4">
            {topHotels.map((hotel, index) => (
              <li key={index} className="flex justify-between">
                <span>{hotel.name}</span>
                <span>{hotel.bookings}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-100 p-4 mt-6 rounded shadow">
        <h3 className="text-lg font-bold">Bookings by destination</h3>
        <ul className="mt-4">
          {trendingDestinations.map((destination, index) => (
            <li key={index} className="flex justify-between">
              <span>{destination.name}</span>
              <span>{destination.bookings}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
