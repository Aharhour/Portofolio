import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarIcon, StarIcon, XIcon, TrendingUpIcon, ClockIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import useScrollReveal from '../library/useScrollReveal'

const Releases = () => {
    const { axios, image_base_url } = useAppContext()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMovie, setSelectedMovie] = useState(null)
    const ref = useScrollReveal()

    const fetchUpcoming = async () => {
        try {
            const { data } = await axios.get('/api/show/upcoming')
            if (data.success) {
                const sorted = data.movies
                    .filter(m => m.poster_path && m.release_date)
                    .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                setMovies(sorted)
            }
        } catch (error) {
            // Fetch failed
        }
        setLoading(false)
    }

    useEffect(() => { fetchUpcoming() }, [])

    // Group movies by month+year
    const grouped = movies.reduce((acc, movie) => {
        const date = new Date(movie.release_date)
        const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`
        const label = `${date.toLocaleString('nl-NL', { month: 'long' })} ${date.getFullYear()}`
        if (!acc[key]) acc[key] = { label, movies: [] }
        acc[key].movies.push(movie)
        return acc
    }, {})

    const getDaysUntil = (dateStr) => {
        const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
        if (diff <= 0) return 'Nu in de bioscoop'
        if (diff === 1) return 'Morgen'
        if (diff <= 7) return `Over ${diff} dagen`
        if (diff <= 30) return `Over ${Math.ceil(diff / 7)} weken`
        if (diff <= 365) return `Over ${Math.ceil(diff / 30)} maanden`
        return `Over ${Math.floor(diff / 365)}+ jaar`
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('nl-NL', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
    }

    if (loading) return <div ref={ref}><Loading /></div>

    return (
        <div ref={ref} className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50 pb-20 min-h-screen'>
            <div className='relative text-center mb-16 reveal reveal-blur'>
                <BlurCircle top="-100px" left="30%" />
                <h1 className='text-4xl font-bold'>Aankomende Releases</h1>
                <p className='text-gray-400 mt-3 max-w-xl mx-auto'>
                    De grootste films tot eind 2026. Klik op een film voor meer informatie.
                </p>
                <p className='text-gray-600 text-sm mt-2'>{movies.length} films gevonden</p>
            </div>

            {movies.length === 0 ? (
                <p className='text-center text-gray-500'>Geen aankomende films gevonden.</p>
            ) : (
                Object.entries(grouped)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([key, { label, movies: monthMovies }]) => (
                    <div key={key} className='mb-14 reveal'>
                        <div className='flex items-center gap-3 mb-6 sticky top-20 z-10 bg-black/80 backdrop-blur-md py-3 -mx-2 px-2 rounded-lg'>
                            <CalendarIcon className='w-5 h-5 text-primary' />
                            <h2 className='text-xl font-semibold capitalize'>{label}</h2>
                            <span className='text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full'>{monthMovies.length} films</span>
                        </div>

                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                            {monthMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    onClick={() => setSelectedMovie(movie)}
                                    className='group cursor-pointer'
                                >
                                    {/* Poster */}
                                    <div className='relative rounded-xl overflow-hidden aspect-[2/3]'>
                                        <img
                                            src={image_base_url + movie.poster_path}
                                            alt={movie.title}
                                            className='w-full h-full object-cover group-hover:scale-105 transition duration-500'
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300' />

                                        {/* Hover overlay info */}
                                        <div className='absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300'>
                                            <p className='text-xs text-gray-300'>{formatDate(movie.release_date)}</p>
                                            <p className='text-[10px] text-gray-400 mt-0.5 line-clamp-2'>{movie.overview}</p>
                                        </div>

                                        {/* Countdown badge */}
                                        <div className='absolute top-2 left-2'>
                                            <span className='bg-primary/90 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded-full'>
                                                {getDaysUntil(movie.release_date)}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        {movie.vote_average > 0 && (
                                            <div className='absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-full'>
                                                <StarIcon className='w-2.5 h-2.5 text-primary fill-primary' />
                                                {movie.vote_average.toFixed(1)}
                                            </div>
                                        )}

                                        {/* Popularity indicator for top movies */}
                                        {movie.popularity > 100 && (
                                            <div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-0'>
                                                <TrendingUpIcon className='w-4 h-4 text-primary' />
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className='font-medium text-sm mt-2 truncate group-hover:text-primary transition'>{movie.title}</h3>
                                    <p className='text-[11px] text-gray-500'>{formatDate(movie.release_date)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Detail Modal — rendered via portal to escape the PageTransition
                wrapper, whose transform otherwise makes `fixed` descendants
                position relative to the wrapper instead of the viewport. */}
            {selectedMovie && createPortal(
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4' onClick={() => setSelectedMovie(null)} style={{ animation: 'fadeIn 0.2s ease-out' }}>
                    <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />
                    <div
                        className='relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 border border-gray-700'
                        style={{ animation: 'revealScale 0.35s cubic-bezier(0.16,1,0.3,1)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Backdrop header */}
                        {selectedMovie.backdrop_path && (
                            <div className='relative h-56 md:h-72'>
                                <img
                                    src={image_base_url + selectedMovie.backdrop_path}
                                    alt={selectedMovie.title}
                                    className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent' />

                                <button
                                    onClick={() => setSelectedMovie(null)}
                                    className='absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition cursor-pointer'
                                >
                                    <XIcon className='w-5 h-5' />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className='p-6 md:p-8 -mt-16 relative'>
                            <div className='flex gap-5'>
                                {/* Poster */}
                                <img
                                    src={image_base_url + selectedMovie.poster_path}
                                    alt={selectedMovie.title}
                                    className='w-28 md:w-36 h-auto rounded-xl shadow-2xl shrink-0 -mt-20 border-2 border-gray-800'
                                />

                                <div className='pt-6'>
                                    <h2 className='text-2xl md:text-3xl font-bold'>{selectedMovie.title}</h2>

                                    {selectedMovie.original_title && selectedMovie.original_title !== selectedMovie.title && (
                                        <p className='text-sm text-gray-500 mt-1'>{selectedMovie.original_title}</p>
                                    )}

                                    <div className='flex flex-wrap items-center gap-3 mt-3'>
                                        {selectedMovie.vote_average > 0 && (
                                            <div className='flex items-center gap-1.5 bg-primary/20 text-primary text-sm font-medium px-3 py-1 rounded-full'>
                                                <StarIcon className='w-4 h-4 fill-primary' />
                                                {selectedMovie.vote_average.toFixed(1)}
                                            </div>
                                        )}

                                        <div className='flex items-center gap-1.5 bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full'>
                                            <CalendarIcon className='w-4 h-4' />
                                            {formatDate(selectedMovie.release_date)}
                                        </div>

                                        <span className='bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full'>
                                            {getDaysUntil(selectedMovie.release_date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Genre tags */}
                            {selectedMovie.genre_ids && selectedMovie.genre_ids.length > 0 && (
                                <div className='flex flex-wrap gap-2 mt-6'>
                                    {selectedMovie.genre_ids.map(id => {
                                        const genreMap = {
                                            28: 'Actie', 12: 'Avontuur', 16: 'Animatie', 35: 'Komedie',
                                            80: 'Misdaad', 99: 'Documentaire', 18: 'Drama', 10751: 'Familie',
                                            14: 'Fantasy', 36: 'Historisch', 27: 'Horror', 10402: 'Muziek',
                                            9648: 'Mysterie', 10749: 'Romantiek', 878: 'Sci-Fi',
                                            10770: 'TV Film', 53: 'Thriller', 10752: 'Oorlog', 37: 'Western'
                                        }
                                        const name = genreMap[id]
                                        if (!name) return null
                                        return (
                                            <span key={id} className='text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full'>
                                                {name}
                                            </span>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Overview */}
                            <div className='mt-6'>
                                <h3 className='text-sm font-semibold text-gray-300 mb-2'>Beschrijving</h3>
                                <p className='text-sm text-gray-400 leading-relaxed'>
                                    {selectedMovie.overview || 'Er is nog geen beschrijving beschikbaar voor deze film.'}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className='grid grid-cols-3 gap-4 mt-6'>
                                <div className='bg-gray-800/50 rounded-xl p-4 text-center'>
                                    <StarIcon className='w-5 h-5 text-primary mx-auto mb-1' />
                                    <p className='text-lg font-bold'>{selectedMovie.vote_average > 0 ? selectedMovie.vote_average.toFixed(1) : '-'}</p>
                                    <p className='text-[10px] text-gray-500'>Beoordeling</p>
                                </div>
                                <div className='bg-gray-800/50 rounded-xl p-4 text-center'>
                                    <TrendingUpIcon className='w-5 h-5 text-primary mx-auto mb-1' />
                                    <p className='text-lg font-bold'>{Math.round(selectedMovie.popularity)}</p>
                                    <p className='text-[10px] text-gray-500'>Populariteit</p>
                                </div>
                                <div className='bg-gray-800/50 rounded-xl p-4 text-center'>
                                    <ClockIcon className='w-5 h-5 text-primary mx-auto mb-1' />
                                    <p className='text-lg font-bold'>{selectedMovie.vote_count || 0}</p>
                                    <p className='text-[10px] text-gray-500'>Stemmen</p>
                                </div>
                            </div>

                            {/* Taal */}
                            <div className='mt-6 flex items-center gap-2 text-sm text-gray-500'>
                                <span>Originele taal:</span>
                                <span className='uppercase bg-gray-800 px-2 py-0.5 rounded text-gray-300 text-xs font-medium'>
                                    {selectedMovie.original_language}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default Releases
