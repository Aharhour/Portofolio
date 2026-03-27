import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

// AdminNavbar - The navigation bar displayed at the top of admin pages
const AdminNavbar = () => {
  return (
    // Navbar container with bottom border
    <div className='flex item-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
        {/* Logo that links back to the main homepage */}
        <Link to="/">
        <img src={assets.logo} alt="logo" className='w-36 h-auto'/>
        </Link>
    </div>
  )
}

export default AdminNavbar
