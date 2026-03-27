import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData, assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../library/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

// SeatLayout - Page where users select a time slot and seats for their booking
const SeatLayout = () => {

    // Define seat row groups for the cinema layout (pairs of rows displayed together)
    const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

    // Get movie id and selected date from the URL
    const {id, date } = useParams()
    // State to track which seats the user has selected
    const [selectedSeats, setSelectedSeats] = useState([])
    // State to track which time slot the user has selected
    const [selectedTime, setSelectedTime] = useState(null)
    // State to store the movie and show time data
    const [show, setShow] = useState(null)

    // Hook for programmatic navigation
    const navigate = useNavigate()

    // Find the movie by id and set the show data with available times
    const getShow = async () => {
      const show = dummyShowsData.find(show => show._id === id)
      if(show){
        setShow({
          movie: show,
          dateTime: dummyDateTimeData
        })
      }
    }

    // Handler for when a seat button is clicked
    const handleSeatClick = (seatId) =>{
      // Require time selection before selecting seats
      if (!selectedTime) {
        return toast("Please select time first")
      }
      // Limit selection to a maximum of 5 seats
      if (!selectedSeats.includes(seatId) && selectedSeats.length > 4){
        return toast("You can only select 5 seats")
      }
      // Toggle the seat: add if not selected, remove if already selected
      setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
    }

    // Renders a row of seat buttons (default 9 seats per row)
    const renderSeats = (row, count = 9)=>(
      <div key={row} className="flex gap-2 mt-2">
        <div className='flex flex-wrap items-center justify-center gap-2'>
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;   // Generate seat ID like "A1", "B3", etc.
            return (
              // Seat button - highlighted when selected
              <button key={seatId} onClick={() => handleSeatClick (seatId)} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${selectedSeats.includes(seatId) && "bg-primary text-white"}`}>
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    )

    // Fetch show data when the component mounts
    useEffect(()=>{
      getShow()
    },[])


  // Show the seat layout if data is loaded, otherwise show loading spinner
  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Left sidebar: Available time slots for the selected date */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {/* List each available time slot - highlighted when selected */}
          {show.dateTime[date].map((item)=>(
            <div key={item.time} onClick={()=> setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
              <ClockIcon className="w-4 h-4" />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: Seat selection grid */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
          {/* Decorative blur circles */}
          <BlurCircle top="-100px" left="-100px"/>
          <BlurCircle bottem="0" right="0"/>
          <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
          {/* Screen image showing where the screen is */}
          <img src={assets.screenImage} alt="screen" />
          <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

          {/* Seat grid layout */}
          <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
            {/* First group of rows (A, B) displayed in a single column on desktop */}
            <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
              {groupRows[0].map(row => renderSeats(row))}
            </div>

            {/* Remaining row groups displayed in a 2-column grid */}
            <div className='grid grid-cols-2 gap-11'>
              {groupRows.slice(1).map((group, idx)=>(
                <div key={idx} className=''>
                  {group.map(row => renderSeats(row))}
                </div>
              ))}
            </div>
          </div>

          {/* Proceed to checkout button */}
          <button onClick={()=> navigate('/my-bookings')} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium crusor-pointer active:scale-95'>
              Proceed to Checkout
              <ArrowRightIcon strikeWidth={3} className='w-4 h-4' />
          </button>
      </div>
    </div>
  ) : (
    // Show loading spinner while data is being fetched
    <Loading />
  )
}

export default SeatLayout
