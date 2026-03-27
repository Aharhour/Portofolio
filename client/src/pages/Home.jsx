import React from 'react'
import HeroSection  from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailerSection from '../components/TrailerSection'

// Home - The main homepage that combines the hero banner, featured movies, and trailers
const Home = () => {
  return (
    <>
      {/* Full-screen hero banner with movie showcase */}
      <HeroSection />
      {/* Grid of currently showing movies */}
      <FeaturedSection />
      {/* YouTube trailer player with selectable thumbnails */}
      <TrailerSection />
    </>
  )
}

export default Home
