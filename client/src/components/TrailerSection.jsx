import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player/youtube'
import BlurCircle from './BlurCircle'

// TrailerSection - Displays a video player with selectable trailers
const TrailerSection = () => {

    // State to track which trailer is currently selected/playing
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>

            {/* Section title */}
            <p className='text-gray-300 font-medium text-lg max-w-960px mx-auto'>
                Trailers
            </p>

            {/* YouTube video player for the selected trailer */}
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
                                showinfo: 1,          // Show video info
                                modestbranding: 1      // Minimal YouTube branding
                            }
                        }
                    }}
                />
            </div>

            {/* Thumbnail selector - clicking a thumbnail switches the trailer */}
            <div className='flex gap-4 mt-6 justify-center flex-wrap'>
                {dummyTrailers.map((trailer) => (
                    <img
                        key={trailer.id}
                        src={trailer.image}
                        alt={trailer.title}
                        // Set the clicked trailer as the current trailer
                        onClick={() => setCurrentTrailer(trailer)}
                        // Highlight the active trailer with a red border and scale effect
                        className={`w-32 cursor-pointer rounded-lg border-2 transition
                        ${currentTrailer.id === trailer.id
                            ? 'border-red-500 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    />
                ))}
            </div>

            <div>

            </div>

        </div>
    )
}

export default TrailerSection
