import React from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'

// Layout - The admin layout wrapper that provides the navbar, sidebar, and content area
const Layout = () => {
  return (
    <>
      {/* Admin navigation bar at the top */}
      <AdminNavbar />
      <div className='flex'>
        {/* Admin sidebar on the left with navigation links */}
        <AdminSidebar />
        {/* Main content area - renders the active admin page via Outlet */}
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
