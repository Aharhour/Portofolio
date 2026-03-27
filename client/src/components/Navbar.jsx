import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/react'

// Navbar - The main navigation bar displayed at the top of public pages
const Navbar = () => {

  // State to toggle the mobile menu open/closed
  const [isOpen, setIsOpen] = useState(false)
  // Get the current logged-in user from Clerk
  const {user} = useUser()
  // Get the openSignIn function to trigger the login modal
  const { openSignIn } = useClerk()

  // Hook for programmatic navigation
  const navigate = useNavigate()

    return (
      // Fixed navbar container pinned to the top of the screen
      <div className='fixed top-0 left-0 z-50 w-full flex items-center
      justify-between px-6 md:px-16 lg:px-36 py-5'>
        {/* Logo that links to the homepage */}
        <Link to='/' className='max-md:flex-1'>
          <img src={assets.logo} alt="" className='w-36 h-auto'/>
        </Link>

        {/* Navigation links - shown as sidebar on mobile, inline on desktop */}
        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
        max-md:text-lg z-50 flex flex-col md:flex-row items-center
        max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen
        md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
        border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

          {/* Close button for mobile menu */}
          <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'
          onClick={()=> setIsOpen(!isOpen)}/>

          {/* Navigation links - each scrolls to top and closes mobile menu */}
          <Link onClick={()=> {scrollTo(0,0,); setIsOpen(false)}} to='/'>Home</Link>
          <Link onClick={()=> {scrollTo(0,0,); setIsOpen(false)}} to='/movies'>Movies</Link>
          <Link onClick={()=> {scrollTo(0,0,); setIsOpen(false)}} to='/'>Theaters</Link>
          <Link onClick={()=> {scrollTo(0,0,); setIsOpen(false)}} to='/'>Releases</Link>
          <Link onClick={()=> {scrollTo(0,0,); setIsOpen(false)}} to='/favorite'>Favorites</Link>
        </div>

        {/* Right side: search icon and login/user button */}
        <div className='flex items-center gap-8'>
          {/* Search icon - hidden on mobile */}
          <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer'/>
          {
            // If user is not logged in, show a Login button
            !user ? (
              <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull
              transition rounded-full font-medium cursor-pointer'>Login</button>
            ) : (
              // If user is logged in, show the Clerk UserButton with a custom "My Bookings" menu item
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="My Bookings"
                  labelIcon={<TicketPlus width={15}/>} onClick={()=> navigate('/my-bookings')}/>
                </UserButton.MenuItems>
              </UserButton>
            )
          }

        </div>

        {/* Hamburger menu icon for mobile - toggles the mobile nav menu */}
        <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=> setIsOpen(!isOpen)} />
      </div>
    )
}

export default Navbar
