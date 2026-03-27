import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player/youtube'
import BlurCircle from './BlurCircle'

const TrailerSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>

            <p className='text-gray-300 font-medium text-lg max-w-960px mx-auto'>
                Trailers
            </p>

            <div className='relative mt-6'>
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
                            playerVars: {
                                showinfo: 1,
                                modestbranding: 1
                            }
                        }
                    }}
                />
            </div>

            {/* Clicking a thumbnail switches the active trailer */}
            <div className='flex gap-4 mt-6 justify-center flex-wrap'>
                {dummyTrailers.map((trailer) => (
                    <img
                        key={trailer.id}
                        src={trailer.image}
                        alt={trailer.title}
                        onClick={() => setCurrentTrailer(trailer)}
                        className={`w-32 cursor-pointer rounded-lg border-2 transition
                        ${currentTrailer.id === trailer.id
                            ? 'border-red-500 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    />
                ))}
            </div>

        </div>
    )
}

export default TrailerSection
