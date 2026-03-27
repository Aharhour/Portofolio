import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { StarIcon } from 'lucide-react'

// AddShows - Admin page for adding new movie shows
const AddShows = () => {
    // Get the currency symbol from environment variables
    const currency = import.meta.env.VITE_CURRENCY
    // State to store the list of currently playing movies
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    // State to track which movie the admin has selected
    const [selectedMovie, setSelectedMovie] = useState(null);
    // State to store selected date/time slots for the new show
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    // State for the date/time input field value
    const [dateTimeInput, setDateTimeInput] = useState("");
    // State for the ticket price input field value
    const [showPrice, setShowPrice] = useState("");

    // Fetch all currently playing movies (using dummy data for now)
    const fetchNowPlayingMovies = async () => {
      setNowPlayingMovies(dummyShowsData)
    };

    // Fetch movies when the component mounts
    useEffect(() => {
      fetchNowPlayingMovies();
    }, []);

  // Show movie grid if movies are loaded, otherwise show loading spinner
  return nowPlayingMovies.length > 0 ? (
    <>
      {/* Page title */}
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      {/* Scrollable container for movie posters */}
      <div className="overflow-x-auto pb-4">
        {/* Movie grid - non-hovered movies become transparent on group hover */}
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {/* Loop through each movie and display as a selectable card */}
          {nowPlayingMovies.map((movie) =>(
            <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}>
              <div className="relative rounded-lg overflow-hidden">
                {/* Movie poster image */}
                <img src={movie.poster_path} alt="" className="w-full object-cover brightness-90"/>
                {/* Overlay at the bottom showing rating and vote count */}
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  {/* Star rating */}
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                    {movie.vote_average.toFixed(1)}
                  </p>
                  {/* Total vote count */}
                  <p className="text-gray-300">{movie.vote_count} Votes</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : <Loading />
}

export default AddShows
