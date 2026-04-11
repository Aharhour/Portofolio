import { useEffect, useState, useRef } from 'react'
import { ArrowRight, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import { useAppContext } from '../context/AppContext'
import useScrollReveal from '../library/useScrollReveal'

const UpcomingSection = () => {
    const navigate = useNavigate()
    const { axios, image_base_url } = useAppContext()
    const [movies, setMovies] = useState([])
    const scrollRef = useRef(null)
    const sectionRef = useScrollReveal()

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const { data } = await axios.get('/api/show/upcoming')
                if (data.success) {
                    setMovies(
                        data.movies
                            .filter(m => m.poster_path && m.backdrop_path && m.release_date)
                            .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                            .slice(0, 12)
                    )
                }
            } catch {
                // Fetch failed
            }
        }
        fetchUpcoming()
    }, [])

    const scroll = (dir) => {
        scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
    }

    const getDaysUntil = (dateStr) => {
        const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
        if (diff <= 0) return 'Nu in de bioscoop'
        if (diff === 1) return 'Morgen'
        if (diff <= 7) return `Over ${diff} dagen`
        if (diff <= 30) return `Over ${Math.ceil(diff / 7)} weken`
        return `Over ${Math.ceil(diff / 30)} maanden`
    }

    if (movies.length === 0) return <div ref={sectionRef} />

    return (
        <div ref={sectionRef} className='relative px-6 md:px-16 lg:px-24 xl:px-44 pt-24 pb-10 overflow-hidden'>
            <BlurCircle top='100px' left='-60px' />

            {/* Header */}
            <div className='flex items-center justify-between mb-10 reveal'>
                <div>
                    <p className='text-gray-300 font-medium text-lg'>Binnenkort in de bioscoop</p>
                    <p className='text-gray-500 text-sm mt-1'>De nieuwste films die eraan komen</p>
                </div>
                <div className='flex items-center gap-3'>
                    <button onClick={() => scroll(-1)} className='p-2 rounded-full border border-gray-700 hover:border-primary/50 hover:bg-primary/10 transition cursor-pointer btn-press'>
                        <ChevronLeftIcon className='w-5 h-5' />
                    </button>
                    <button onClick={() => scroll(1)} className='p-2 rounded-full border border-gray-700 hover:border-primary/50 hover:bg-primary/10 transition cursor-pointer btn-press'>
                        <ChevronRightIcon className='w-5 h-5' />
                    </button>
                    <button onClick={() => { navigate('/releases'); scrollTo(0, 0) }} className='group flex items-center gap-2 text-sm text-gray-300 ml-2 hover-underline'>
                        Bekijk alles
                        <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
                    </button>
                </div>
            </div>

            {/* Horizontal scroll carousel */}
            <div ref={scrollRef} className='flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 reveal'>
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        onClick={() => { navigate('/releases'); scrollTo(0, 0) }}
                        className='group relative shrink-0 w-72 cursor-pointer'
                    >
                        {/* Backdrop image with gradient overlay */}
                        <div className='relative h-44 rounded-xl overflow-hidden'>
                            <img
                                src={image_base_url + movie.backdrop_path}
                                alt={movie.title}
                                className='w-full h-full object-cover group-hover:scale-105 transition duration-500'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />

                            {/* Countdown badge */}
                            <div className='absolute top-3 left-3'>
                                <span className='flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full'>
                                    <CalendarIcon className='w-3 h-3' />
                                    {getDaysUntil(movie.release_date)}
                                </span>
                            </div>

                            {/* Rating */}
                            {movie.vote_average > 0 && (
                                <div className='absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded-full'>
                                    <StarIcon className='w-3 h-3 text-primary fill-primary' />
                                    {movie.vote_average.toFixed(1)}
                                </div>
                            )}

                            {/* Title overlay at bottom of image */}
                            <div className='absolute bottom-0 left-0 right-0 p-3'>
                                <h3 className='font-semibold text-sm leading-tight truncate'>{movie.title}</h3>
                                <p className='text-[11px] text-gray-300 mt-0.5'>
                                    {new Date(movie.release_date).toLocaleDateString('nl-NL', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Description below image */}
                        <p className='text-xs text-gray-500 mt-2.5 line-clamp-2 leading-relaxed'>
                            {movie.overview || 'Geen beschrijving beschikbaar.'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UpcomingSection
