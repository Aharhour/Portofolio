import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import useScrollReveal from '../library/useScrollReveal'

const Movies = () => {
  const { shows } = useAppContext()
  const ref = useScrollReveal()

  return shows.length > 0 ? (
    <div ref={ref} className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-lg font-medium my-4 reveal'>Now Showing</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.map((movie, i) => (
          <div key={movie._id} className={`reveal stagger-${Math.min((i % 8) + 1, 8)}`}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen page-enter'>
      <h1 className='text-3xl font-bold text-center'>No movies available</h1>
    </div>
  )
}

export default Movies
