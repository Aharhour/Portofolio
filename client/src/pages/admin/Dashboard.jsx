import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../library/dateFormat';

// Dashboard - The main admin dashboard page showing stats and active shows
const Dashboard = () => {
  // Get the currency symbol from environment variables
  const currency = import.meta.env.VITE_CURRENCY

  // State to store dashboard statistics and active shows
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });
  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Define the stat cards to display at the top of the dashboard
  const dashboardCards = [
    { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
    { title: "Total Revenue", value: currency + dashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
    { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
    { title: "Total User", value: dashboardData.totalUser || "0", icon: UserIcon },
  ]

  // Fetch dashboard data (currently using dummy data)
  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData)
    setLoading(false)
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Show dashboard content if loaded, otherwise show loading spinner
    return !loading ? (
      <>
          {/* Page title with styled text */}
          <Title text1="Admin" text2="Dashboard"/>

          {/* Dashboard stat cards section */}
          <div className="relative flex flex-wrap gap-4 mt-6">
            <BlurCircle top="-100px" left="0"/>
            <div className='flex flex-wrap gap-4 w-full'>
              {/* Render each stat card with its title, value, and icon */}
              {dashboardCards.map((card, index) => (
                <div key={index} className="flex item-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full">
                  <div>
                    {/* Card title */}
                    <h1 className="text-sm">{card.title}</h1>
                    {/* Card value (e.g. total bookings count, revenue amount) */}
                    <p className="text-xl font-medium mt-1">{card.value}</p>
                  </div>
                  {/* Card icon rendered dynamically */}
                  <card.icon className="w-6 h-6"/>
                </div>
              ))}
            </div>
          </div>

          {/* Active Shows section */}
          <p className="mt-10 text-lg font-medium">Active Shows</p>
          <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
            <BlurCircle top="100px" left="-10%"/>
            {/* Loop through active shows and display each as a card */}
            {dashboardData.activeShows.map((show) => (
              <div key={show._id} className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300">
                {/* Show movie poster */}
                <img src={show.movie.poster_path} alt="" className="h-60 w-full object-cover" />
                {/* Movie title */}
                <p className="font-medium p-2 truncate">{show.movie.title}</p>
                <div className="flex items-center justify-between px-2">
                  {/* Show price with currency */}
                  <p className="text-lg font-medium">{currency} {show.showPrice}</p>
                  {/* Movie rating with star icon */}
                  <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                    <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                    {show.movie.vote_average.toFixed(1)}
                  </p>
                </div>
                {/* Formatted show date and time */}
                <p className="px-2 pt-2 text-sm text-gray-500">{dateFormat(show.showDateTime)}</p>

              </div>
            ))}
          </div>
      </>
  ) : <Loading />
}

export default Dashboard
