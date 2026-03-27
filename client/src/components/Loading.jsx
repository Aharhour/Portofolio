import React from 'react'

// Loading - A full-page loading spinner shown while data is being fetched
const Loading = () => {
  return (
    // Centered container taking up most of the viewport height
    <div className='flex justify-center items-center h-[80vh]'>
        {/* Spinning circle animation with a primary-colored top border */}
        <div className='animate-spin rounded-full h-14 w-14 border-2 border-t-primary'></div>
    </div>
  )
}

export default Loading
