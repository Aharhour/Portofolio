import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import { Heart, StarIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import timeFormat from '../library/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import CommentSection from '../components/CommentSection'
import { useAppContext } from '../context/AppContext'
import useScrollReveal from '../library/useScrollReveal'

// Detailpagina van één film: poster, beschrijving, cast, datum-keuze en aanbevelingen.
const MovieDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams() // movieId uit de URL
    const [show, setShow] = useState(null)
    const ref = useScrollReveal() // Scroll-animaties triggeren wanneer elementen in beeld komen

    const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext()

    // Filmdetails + alle showtimes voor deze film ophalen bij de backend.
    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`)
            if (data.success) {
                setShow(data)
            }
        } catch (error) {
            // Fout stilletjes negeren
        }
    }

    // Hartje aan-/uitzetten: voegt deze film toe aan favorieten of haalt 'm eruit.
    const handleFavorite = async () => {
        try {
            // Niet ingelogd? → toast met loginbericht
            if (!user) return toast.error("Please login to proceed")

            const { data } = await axios.post('/api/user/update-favorite', { movieId: id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                // Lijst opnieuw ophalen zodat het hartje direct visueel bijwerkt
                await fetchFavoriteMovies()
                toast.success(data.message)
            }
        } catch (error) {
            // Fout stilletjes negeren
        }
    }

    // Bij elke wijziging van het film-id (andere film geopend): opnieuw fetchen
    useEffect(() => {
        getShow()
    }, [id])

    // Check of deze film in de favorieten zit (voor het hart-icoon styling)
    const isFavorite = favoriteMovies?.find(movie => movie._id === id)

    // Pas renderen als de film geladen is, anders een loading spinner tonen
    return show ? (
        <div ref={ref} className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
            {/* Bovenste sectie: filmposter + alle film-info naast elkaar */}
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                <img
                    src={image_base_url + show.movie.poster_path}
                    alt={show.movie.title}
                    className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover reveal reveal-left"
                    style={{ boxShadow: '0 20px 60px -12px rgba(248, 69, 101, 0.15)' }}
                />

                <div className="relative flex flex-col gap-3 reveal reveal-right">
                    <BlurCircle top="-100px" left="-100px" />

                    <p className="text-primary">ENGLISH</p>

                    <h1 className="text-4xl font-semibold max-w-96 text-balance">
                        {show.movie.title}
                    </h1>

                    <div className="flex items-center gap-2 text-gray-300">
                        <StarIcon className="w-5 h-5 text-primary fill-primary" />
                        {show.movie.vote_average.toFixed(1)} User Rating
                    </div>

                    <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
                        {show.movie.overview}
                    </p>

                    <p className="text-gray-300">
                        {timeFormat(show.movie.runtime)} &bull;{' '}
                        {show.movie.genres.map((g) => g.name).join(', ')} &bull;{' '}
                        {show.movie.release_date.split('-')[0]}
                    </p>

                    {/* Actieknoppen: tickets kopen en favoriet aan/uit */}
                    <div className="flex items-center flex-wrap gap-4 mt-4">
                        <a
                            href="#dateSelect"
                            className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer btn-press glow-primary"
                        >
                            Buy Tickets
                        </a>

                        <button onClick={handleFavorite} className="bg-gray-700 hover:bg-gray-600 p-2.5 rounded-full transition-all duration-300 cursor-pointer btn-press">
                            <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-primary text-primary scale-110' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Cast: horizontaal scrollende lijst van acteurs (max 12 personen getoond) */}
            <p className="text-lg font-medium mt-20 reveal">Cast</p>
            <div className="overflow-x-auto no-scrollbar mt-8 pb-4 reveal">
                <div className="flex items-center gap-4 w-max px-4">
                    {show.movie?.casts?.slice(0, 12).map((cast, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <img
                                src={image_base_url + cast.profile_path}
                                alt={cast.name}
                                className="rounded-full h-20 aspect-square object-cover group-hover:scale-105 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-primary/10"
                            />
                            <p className="font-medium text-xs mt-3 group-hover:text-primary transition-colors">{cast.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Datum-keuze component voor het boeken (link naar SeatLayout pagina) */}
            <div className="reveal">
                <DateSelect dateTime={show.dateTime} id={id} />
            </div>

            {/* Comment-sectie: ingelogde gebruikers kunnen reacties achterlaten onder de film */}
            <div className="reveal">
                <CommentSection movieId={id} />
            </div>

            {/* Aanbevelingen: 4 andere films onderaan om door te klikken */}
            <p className="text-lg font-medium mt-20 mb-8 reveal">You May Also Like</p>
            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {shows.slice(0, 4).map((movie, i) => (
                    <div key={movie._id} className={`reveal stagger-${i + 1}`}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-20 reveal">
                <button
                    onClick={() => { navigate('/movies'); window.scrollTo(0, 0) }}
                    className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer btn-press"
                >
                    Show more
                </button>
            </div>
        </div>
    ) : <div ref={ref}><Loading /></div>
}

export default MovieDetails
