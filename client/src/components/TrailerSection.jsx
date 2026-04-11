import { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player/youtube'
import BlurCircle from './BlurCircle'
import useScrollReveal from '../library/useScrollReveal'

const TrailerSection = () => {
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
    const ref = useScrollReveal()

    return (
        <div ref={ref} className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
            <p className='text-gray-300 font-medium text-lg max-w-960px mx-auto reveal'>
                Trailers
            </p>

            {/* YouTube player for the selected trailer */}
            <div className='relative mt-6 reveal'>
                <BlurCircle top='-100px' right='-100px' />

                <ReactPlayer
                    url={currentTrailer.videoUrl}
                    controls
                    playing={false}
                    width="100%"
                    height="540px"
                    className="mx-auto max-w-960px"
                    config={{
                        youtube: {
                            playerVars: { showinfo: 1, modestbranding: 1 }
                        }
                    }}
                />
            </div>

            {/* Thumbnail strip - clicking switches the active trailer */}
            <div className='flex gap-4 mt-6 justify-center flex-wrap reveal'>
                {dummyTrailers.map((trailer) => (
                    <img
                        key={trailer.id}
                        src={trailer.image}
                        alt={trailer.title}
                        onClick={() => setCurrentTrailer(trailer)}
                        className={`w-32 cursor-pointer rounded-lg border-2 transition-all duration-300 ${currentTrailer.id === trailer.id
                            ? 'border-red-500 scale-105 shadow-lg shadow-primary/20'
                            : 'border-transparent opacity-70 hover:opacity-100 hover:scale-102'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default TrailerSection
