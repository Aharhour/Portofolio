import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

// AdminSidebar - The sidebar navigation for admin pages with user info and nav links
const AdminSidebar = () => {

  // Hardcoded admin user info (placeholder for real auth data)
  const user = {
    firstName: 'Admin',
    lastName: 'User',
    imageUrl: assets.profile,
  }

  // Define the navigation links for the admin sidebar
  const adminNavlinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
    { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
    { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
  ]

  return (
    // Sidebar container with full height minus navbar, and responsive width
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm'>
        {/* Admin user profile picture */}
        <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={user.imageUrl} alt="sidebar"/>
        {/* Admin user name - hidden on mobile */}
        <p className='mt-2 text-base max-md:hidden'>{user.firstName} {user.lastName}</p>
        {/* Navigation links */}
        <div className='w-full'>
          {adminNavlinks.map((link, index)=> (
            // NavLink highlights the active route with primary color styling
            <NavLink key={index} to={link.path} end={link.path === '/admin'} className={({ isActive }) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${isActive && 'bg-primary/15 text-primary group'}`}>
              {({ isActive })=>(
                <>
                {/* Navigation icon */}
                <link.icon className="w-5 h-5" />
                {/* Navigation label - hidden on mobile */}
                <p className='max-md:hidden'>{link.name}</p>
                {/* Active indicator bar on the right side */}
                <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-primary'}`}/>
                </>
              )}
            </NavLink>
          ))}
        </div>
    </div>
  )
}

export default AdminSidebar
