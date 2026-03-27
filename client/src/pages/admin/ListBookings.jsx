import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../library/dateFormat';

// ListBookings - Admin page for listing all bookings
const ListBookings = () => {
  // Get the currency symbol from environment variables
  const currency = import.meta.env.VITE_CURRENCY

  // State to store the list of bookings
  const [bookings, setBookings] = useState([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all bookings (using dummy data for now)
  const getAllBookings = async () => {
    setBookings(dummyBookingData)
    setIsLoading(false);
  }

  // Fetch bookings when the component mounts
  useEffect(() => {
    getAllBookings();
  }, []);

  // Show table if loaded, otherwise show loading spinner
  return !isLoading ? (
    <>
    {/* Page title */}
    <Title text="List" text2="Bookings"/>
    {/* Scrollable table container */}
    <div className="max-w-4xl mt-6 overflow-x-auto">
      <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
        {/* Table header row */}
        <thead>
          <tr className="bg-primary/20 text-left text-white">
            <th className="p-2 font-medium pl-5">User Name</th>
            <th className="p-2 font-medium">Movie Name</th>
            <th className="p-2 font-medium">Show Time</th>
            <th className="p-2 font-medium">Seats</th>
            <th className="p-2 font-medium">Amount</th>
          </tr>
        </thead>
          {/* Table body - loop through each booking */}
          <tbody className="text-sm font-light">
            {bookings.map((item, index) => (
              <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
              {/* Booking user's name */}
              <td className="p-2 font-medium pl-5">{item.user.name}</td>
              {/* Movie title for this booking */}
              <td className="p-2">{item.show.movie.title}</td>
              {/* Formatted show date and time */}
              <td className="p-2">{dateFormat(item.show.showDateTime)}</td>
              {/* List of booked seat numbers */}
              <td className="p-2">{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
              {/* Total booking amount with currency */}
              <td className="p-2">{currency} {item.amount}</td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>

    </>
  ) : <Loading />
}

export default ListBookings
