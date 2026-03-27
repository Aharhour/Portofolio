import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalculatorIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// HeroSection - The main banner/hero section displayed at the top of the homepage
const HeroSection = () => {

    // Hook for navigating to other pages
    const navigate = useNavigate()

  return (
    // Full-screen hero container with background image
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36
    bg-[url("/background.png")] bg-cover bg-center h-screen'>

        {/* Marvel studio logo */}
        <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20"/>

        {/* Movie title */}
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
            Avengers <br /> Endgame
        </h1>

        {/* Movie metadata: genre, year, and duration */}
        <div className='flex items-center gap-4 text-gray-300'>
            <span>Action | Adventure | Sci-Fi</span>
            <div className='flex items-center gap-1'>
                <CalculatorIcon className='w-4.5 h-4.5'/> 2019
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/> 3h 1m
            </div>
        </div>

        {/* Short movie description */}
        <p className='max-w-md text-gray-300'>
            After the devastating events of Avengers: Infinity War (2018),
            the universe is in ruins. With the help of remaining allies,
            the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.
        </p>

        {/* Button to navigate to the Movies page */}
        <button
          onClick={() => navigate('/Movies')}
          className='flex items-center gap-1 px-6 py-3 text-sm bg-primary
          hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
        >
            Explore Movies
            <ArrowRight className="w-5 h-5"/>
        </button>
    </div>
  )
}

export default HeroSection
