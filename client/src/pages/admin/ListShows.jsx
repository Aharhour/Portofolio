import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../library/dateFormat';

// ListShows - Admin page for listing all movie shows with their bookings and earnings
const ListShows = () => {

  // Get the currency symbol from environment variables
  const currency = import.meta.env.VITE_CURRENCY

  // State to store the list of shows
  const [shows, setShows] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Fetch all shows (using dummy data for now)
  const getAllShows = async () =>{
    try {
      // Set a single dummy show with occupied seats
      setShows([{
        movie:dummyShowsData[0],
        showDateTime: "2026-03-27T02:30:00.000Z",
        showPrice: 59,
        occupiedSeats: {
          A1: "user_1",
          A2: "user_2",
          A3: "user_3"
        }
      }]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch shows when the component mounts
  useEffect(() => {
    getAllShows();
  }, []);

  // Show table if loaded, otherwise show loading spinner
  return !loading ? (
    <>
      {/* Page title */}
      <Title text1="List" text2="Shows" />
      {/* Scrollable table container */}
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          {/* Table header row */}
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>
          {/* Table body - loop through each show */}
          <tbody className="text-sm font-light">
            {shows.map((show, index) => (
              <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
              {/* Movie title */}
              <td className="p-2 font-medium pl-5">{show.movie.title}</td>
              {/* Formatted show date and time */}
              <td className="p-2">{dateFormat(show.showDateTime)}</td>
              {/* Total bookings = number of occupied seats */}
              <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
              {/* Earnings = number of occupied seats * ticket price */}
              <td className="p-2">{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListShows
