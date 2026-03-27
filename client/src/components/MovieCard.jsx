import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../library/timeFormat'

// MovieCard - A card component that displays a single movie with poster, info, and rating
const MovieCard = ({ movie }) => {

  // Hook for navigating to the movie details page
  const navigate = useNavigate()

  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800
    rounded-2xl hover:-translate-y-1 transition duration-300 w-60'>

      {/* Movie poster image - clicking navigates to movie details */}
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`)
          window.scrollTo(0, 0)
        }}
        src={movie.backdrop_path}
        alt=""
        className='rounded-lg h-52 w-full object-cover object-bottom-right cursor-pointer'
      />

      {/* Movie title - truncated if too long */}
      <p className='font-semibold mt-2 truncate'>{movie.title}</p>

      {/* Movie metadata: release year, genres, and runtime */}
      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} •
        {movie.genres.slice(0, 2).map(g => g.name).join(" | ")} •
        {timeFormat(movie.runtime)}
      </p>

      {/* Bottom row: Buy Tickets button and star rating */}
      <div className='flex items-center justify-between mt-4 pb-3'>
        {/* Button to navigate to movie details page */}
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`)
            window.scrollTo(0, 0)
          }}
          className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull
          transition rounded-full font-medium cursor-pointer'
        >
          Buy Tickets
        </button>

        {/* Movie rating with star icon */}
        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
