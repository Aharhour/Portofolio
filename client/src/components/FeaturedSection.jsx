import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import { dummyShowsData } from '../assets/assets'
import MovieCard from './MovieCard'


// FeaturedSection - Displays a "Now Showing" section with a grid of featured movies
const FeaturedSection = () => {

    // Hook for navigating to other pages
    const navigate = useNavigate()

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
        {/* Section header with title and "View All" link */}
        <div className='relative flex items-center justify-between pt-20 pb-10'>
            {/* Decorative blur circle in the background */}
            <BlurCircle top='0' right='-80px'/>
            <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
            {/* Button to navigate to the full movies page */}
            <button onClick={()=> navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300'>
                View All
                <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/>
            </button>
        </div>

        {/* Grid of movie cards - shows up to 8 movies */}
        <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
            {dummyShowsData.slice(0, 8).map((show)=>(
                <MovieCard key={show._id} movie={show}/>
            ))}
        </div>

        {/* "Show more" button to go to the full movies page */}
        <div className='flex justify-center mt-20'>
            <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}}
            className='px-10 py-3 text-sm bg-primary hover:bg-prinary-dull transistion
            rounded-md font-medium cursor-pointer'>
                Show more
            </button>
        </div>
    </div>
  )
}

export default FeaturedSection
