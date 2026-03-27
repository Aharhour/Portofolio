import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../library/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'

// MovieDetails - Page that shows detailed information about a specific movie
const MovieDetails = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate()
  // Get the movie ID from the URL
  const { id } = useParams()
  // State to store the movie data and available show times
  const [show, setShow] = useState(null)

  // Find the movie matching the URL id and set it with available date/time data
  const getShow = () => {
    const foundShow = dummyShowsData.find((item) => item._id === id)

    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData,
      })
    }
  }

  // Fetch movie data whenever the id parameter changes
  useEffect(() => {
    getShow()
  }, [id])

  // Show loading spinner while data is being fetched
  if (!show) {
    return <Loading />
  }

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      {/* Movie poster and details section */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Movie poster image */}
        <img
          src={show.movie?.poster_path}
          alt={show.movie?.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        {/* Movie info panel */}
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          {/* Language label */}
          <p className="text-primary">ENGLISH</p>

          {/* Movie title */}
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {show.movie?.title}
          </h1>

          {/* User rating with star icon */}
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie?.vote_average?.toFixed(1)} User Rating
          </div>

          {/* Movie description/overview */}
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie?.overview}
          </p>

          {/* Runtime, genres, and release year */}
          <p className="text-gray-300">
            {timeFormat(show.movie?.runtime)} •{' '}
            {show.movie?.genres?.map((g) => g.name).join(', ')} •{' '}
            {show.movie?.release_date?.split('-')[0]}
          </p>

          {/* Action buttons: Watch Trailer, Buy Tickets, and Favorite */}
          <div className="flex items-center flex-wrap gap-4 mt-4">
            {/* Watch Trailer button */}
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            {/* Buy Tickets button - scrolls to the date selector */}
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>

            {/* Favorite/heart button */}
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cast section - horizontal scrollable list of cast members */}
      <p className="text-lg font-medium mt-20">Cast</p>

      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {/* Display up to 12 cast members with profile photos */}
          {show.movie?.casts?.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={cast.profile_path}
                alt={cast.name}
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date selection component for booking a show */}
      <DateSelect dateTime={show.dateTime} id={id} />

      {/* "You May Also Like" section with recommended movies */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      {/* "Show more" button to navigate to the full movies page */}
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  )
}

export default MovieDetails
