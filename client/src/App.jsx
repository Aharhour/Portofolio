import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Dashboard from './pages/admin/Dashboard'
import Layout from './pages/admin/Layout'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'

const App = () => {

  // Check if the current route is an admin route to hide navbar/footer on admin pages
  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
      {/* Toast notification container for displaying popup messages */}
      <Toaster />
      {/* Only show the Navbar on non-admin pages */}
      {!isAdminRoute && <Navbar/>}
      {/* Define all the routes for the application */}
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home/>}/>
        <Route path='/movies' element={<Movies/>}/>
        {/* Dynamic route for individual movie details */}
        <Route path='/movies/:id' element={<MovieDetails/>}/>
        {/* Dynamic route for seat selection with movie id and date */}
        <Route path='/movies/:id/:date' element={<SeatLayout/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/favorite' element={<Favorite/>} />
        {/* Admin routes wrapped in the Layout component which provides sidebar and navbar */}
        <Route path='/admin' element={<Layout/>}>
          {/* Default admin page is the Dashboard */}
          <Route index element={<Dashboard/>}/>
          <Route path="add-shows" element={<AddShows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="list-bookings" element={<ListBookings/>}/>
        </Route>
      </Routes>
      {/* Only show the Footer on non-admin pages */}
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App
