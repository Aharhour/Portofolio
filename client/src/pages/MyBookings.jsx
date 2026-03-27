import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../library/timeFormat'
import { dateFormat } from '../library/dateFormat'


// MyBookings - Page that displays all bookings made by the current user
const MyBookings = () => {
    // Get the currency symbol from environment variables
    const currency = import.meta.env.VITE_CURRENCY

    // State to store the list of bookings
    const [bookings, setBookings] = useState([])
    // State to track loading status
    const [isLoading, setIsLoading] = useState(true)

    // Fetch the user's bookings (currently using dummy data)
    const getMyBookings = async () =>{
        setBookings(dummyBookingData)
        setIsLoading(false)
    }

    // Fetch bookings when the component mounts
    useEffect(()=>{
        getMyBookings()
    },[])

  // Show bookings if loaded, otherwise show loading spinner
  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80ch]'>
        {/* Decorative blur circles */}
        <BlurCircle top="100px" left="100px"/>
        <div className=''>
            <BlurCircle bottom="0px" left="600px"/>
        </div>
        {/* Page title */}
        <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

        {/* Loop through each booking and display its details */}
        {bookings.map((item,index)=>(
            <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-2-3xl'>
                {/* Left side: movie poster and show info */}
                <div className='flex flex-col md:flex-row'>
                    {/* Movie poster image */}
                    <img src={item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
                    <div className='flex flex-col p-4'>
                        {/* Movie title */}
                        <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                        {/* Movie runtime in "Xh Ym" format */}
                        <p className='text-gray text-sm'>{timeFormat(item.show.movie.runtime)}</p>
                        {/* Show date and time formatted as readable string */}
                        <p className='text-gray text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
                    </div>
                </div>

                {/* Right side: price, payment status, and seat details */}
                <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
                    <div className='flex items-center gap-4'>
                        {/* Booking total amount with currency */}
                        <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
                        {/* Show "Pay Now" button if the booking is not yet paid */}
                        {!item.isPaid && <button className='bg-primary px-4 py-1.4 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</button>}
                    </div>
                    {/* Ticket and seat information */}
                    <div className='text-sm'>
                        <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
                        <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
  ) : <Loading />
}

export default MyBookings
