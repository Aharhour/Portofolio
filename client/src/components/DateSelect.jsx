import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// DateSelect - A date picker component that lets users choose a show date before booking
const DateSelect = ({dateTime, id}) => {

    // Hook for navigating to the seat selection page
    const navigate = useNavigate();

    // State to track which date the user has selected
    const[selected, setSelected] = useState(null)

    // Handler for the "Book Now" button
    const onBookHndler = ()=> {
        // Show a warning if no date is selected
        if(!selected){
            return toast('Please select a date')
        }
        // Navigate to the seat layout page with the movie id and selected date
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0,0)
    }

  return (
    <div id='dateSelect' className='pt-30'>
        {/* Container with blur circles for decoration */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
            <BlurCircle top="-100px" left="-100px"/>
            <BlurCircle top="100px" right="0px"/>
            <div>
                <p className='text-lg font-semibold'>Choose Date</p>
                {/* Date buttons grid with left/right navigation arrows */}
                <div className='flex items-center gap-6 text-sm mt-5'>
                    <ChevronLeftIcon width={28}/>
                    <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
                        {/* Loop through available dates and render a button for each */}
                        {Object.keys(dateTime).map((date)=>(
                            <button onClick={()=> setSelected(date)} key={date} className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? "bg-primary text-white" : "border border-primary/70"}`}>
                                {/* Display the day number */}
                                <span>{new Date(date).getDate()}</span>
                                {/* Display the short month name */}
                                <span>{new Date(date).toLocaleDateString("en-US",{month: "short"})}</span>
                            </button>
                        ))}
                    </span>
                    <ChevronRightIcon width={28}/>
                </div>
            </div>
            {/* Book Now button - triggers navigation to seat selection */}
            <button onClick={onBookHndler} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>Book Now</button>
        </div>
    </div>
  )
}

export default DateSelect
