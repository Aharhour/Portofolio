const Title = ({ text1, text2 }) => {
  return (
    <h1 className='font-semibold text-2xl tracking-tight' style={{ animation: 'revealBlur 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
        {text1} <span className="text-gradient">{text2}</span>
    </h1>
  )
}

export default Title
