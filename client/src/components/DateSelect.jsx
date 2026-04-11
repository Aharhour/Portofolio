import { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const DateSelect = ({ dateTime, id }) => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)

    const onBookHandler = () => {
        if (!selected) {
            return toast('Please select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0, 0)
    }

    const dates = Object.keys(dateTime)

    return (
        <div id='dateSelect' className='pt-30'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 md:p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl overflow-hidden'>
                <BlurCircle top="-100px" left="-100px" />
                <BlurCircle top="100px" right="0px" />

                {/* Date picker grid */}
                <div>
                    <div className='flex items-center gap-2 mb-1'>
                        <CalendarIcon className='w-5 h-5 text-primary' />
                        <p className='text-lg font-semibold'>Choose Date</p>
                    </div>
                    <p className='text-gray-500 text-sm mb-5'>{dates.length} beschikbare dagen</p>
                    <div className='flex items-center gap-6 text-sm'>
                        <ChevronLeftIcon width={28} className='text-gray-500 hover:text-white transition-colors cursor-pointer' />
                        <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-3'>
                            {dates.map((date) => (
                                <button
                                    onClick={() => setSelected(date)}
                                    key={date}
                                    className={`flex flex-col items-center justify-center h-16 w-16 aspect-square rounded-xl cursor-pointer transition-all duration-300 btn-press ${selected === date
                                        ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                                        : "border border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                                    }`}
                                >
                                    <span className='text-lg font-bold leading-none'>{new Date(date).getDate()}</span>
                                    <span className='text-[10px] uppercase mt-0.5 opacity-80'>{new Date(date).toLocaleDateString("en-US", { month: "short" })}</span>
                                </button>
                            ))}
                        </span>
                        <ChevronRightIcon width={28} className='text-gray-500 hover:text-white transition-colors cursor-pointer' />
                    </div>
                </div>

                <button onClick={onBookHandler} className='bg-primary text-white px-10 py-3 rounded-full hover:bg-primary-dull transition-all cursor-pointer btn-press glow-primary font-medium'>
                    Book Now
                </button>
            </div>
        </div>
    )
}

export default DateSelect
