import { useEffect, useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../library/timeFormat'
import { dateFormat } from '../library/dateFormat'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import useScrollReveal from '../library/useScrollReveal'

const MyBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const { axios, getToken, user, image_base_url } = useAppContext()

    const [bookings, setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const ref = useScrollReveal()

    // Fetch all bookings for the current user
    const getMyBookings = async () => {
        try {
            const { data } = await axios.get('/api/user/bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (error) {
            // Fetch failed
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (user) {
            getMyBookings()
        }
    }, [user])

    return !isLoading ? (
        <div ref={ref} className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80ch]'>
            <BlurCircle top="100px" left="100px" />
            <BlurCircle bottom="0px" left="600px" />
            <h1 className='text-lg font-semibold mb-4 reveal'>My Bookings</h1>

            {/* Booking cards list */}
            {bookings.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl card-hover reveal stagger-${Math.min(index + 1, 8)}`}>
                    <div className='flex flex-col md:flex-row'>
                        <div className='img-zoom md:max-w-45 rounded overflow-hidden'>
                            <img src={image_base_url + item.show.movie_id.poster_path} alt={item.show.movie_id.title} className='aspect-video h-auto object-cover object-bottom' />
                        </div>
                        <div className='flex flex-col p-4'>
                            <p className='text-lg font-semibold'>{item.show.movie_id.title}</p>
                            <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie_id.runtime)}</p>
                            <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
                        </div>
                    </div>

                    {/* Payment info and seat details */}
                    <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
                        <div className='flex items-center gap-4'>
                            <p className='text-2xl font-semibold mb-3'>{currency}{item.amount.toFixed(2)}</p>
                            {!item.isPaid && (
                                <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer btn-press'>
                                    Pay Now
                                </Link>
                            )}
                        </div>
                        <div className='text-sm'>
                            <p><span className='text-gray-400'>Total Tickets:</span> {item.bookSeats.length}</p>
                            <p><span className='text-gray-400'>Seat Number:</span> {item.bookSeats.join(", ")}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ) : <div ref={ref}><Loading /></div>
}

export default MyBookings
