import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ALLOWED_REDIRECTS = ['my-bookings', 'movies', 'favorite', 'admin', 'releases', 'theaters'];

const Loading = () => {
    const { nextUrl } = useParams()
    const navigate = useNavigate()

    // If a redirect URL is provided, navigate there after a delay (e.g. post-payment)
    useEffect(() => {
        if (nextUrl && ALLOWED_REDIRECTS.includes(nextUrl)) {
            const timer = setTimeout(() => {
                navigate(`/${nextUrl}`)
            }, 8000)
            return () => clearTimeout(timer)
        }
    }, [nextUrl, navigate])

    return (
        <div className='flex flex-col justify-center items-center h-[80vh] gap-4'>
            <div className='relative'>
                <div className='h-16 w-16 rounded-full border-2 border-white/10'></div>
                <div className='absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent border-t-primary animate-spin'></div>
            </div>
            <p className='text-gray-500 text-sm animate-pulse'>Laden...</p>
        </div>
    )
}

export default Loading
