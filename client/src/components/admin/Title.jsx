import React from 'react'

// Title - A reusable title component for admin pages
// text1 is displayed in normal style, text2 is displayed with underline and primary color
const Title = ({ text1, text2 }) => {
  return (
    <h1 className='font-medium text-2xl'>
        {text1} <span className="underline text-primary">{text2}</span>
    </h1>
  )
}

export default Title
