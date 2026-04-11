import { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../library/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { ListCollapseIcon } from 'lucide-react';

const ListBookings = () => {
    const { axios, getToken, user } = useAppContext()
    const currency = import.meta.env.VITE_CURRENCY

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllBookings = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setBookings(data.bookings)
        } catch (error) {
            // Fetch failed
        }
        setIsLoading(false)
    };

    useEffect(() => {
        if (user) {
            getAllBookings();
        }
    }, [user]);

    return !isLoading ? (
        <div>
            <div style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <Title text1="List" text2="Bookings" />
                <p className='text-gray-500 text-sm mt-1'>{bookings.length} boekingen gevonden</p>
            </div>

            {/* Bookings table */}
            <div className="max-w-5xl mt-6 overflow-x-auto rounded-xl border border-white/[0.06]" style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                {bookings.length > 0 ? (
                    <table className="w-full border-collapse text-nowrap">
                        <thead>
                            <tr className="bg-primary/10 text-left text-gray-300 text-sm">
                                <th className="p-3.5 font-medium pl-5">Gebruiker</th>
                                <th className="p-3.5 font-medium">Film</th>
                                <th className="p-3.5 font-medium">Showtime</th>
                                <th className="p-3.5 font-medium">Stoelen</th>
                                <th className="p-3.5 font-medium">Bedrag</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {bookings.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200"
                                    style={{ animation: `revealUp 0.4s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.03}s both` }}
                                >
                                    <td className="p-3.5 pl-5">
                                        <div className='flex items-center gap-2.5'>
                                            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold'>
                                                {item.user.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span className='font-medium'>{item.user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3.5 text-gray-300">{item.show.movie_id.title}</td>
                                    <td className="p-3.5 text-gray-400">{dateFormat(item.show.showDateTime)}</td>
                                    <td className="p-3.5">
                                        <div className='flex flex-wrap gap-1'>
                                            {item.bookSeats.map((seat) => (
                                                <span key={seat} className='bg-white/[0.05] border border-white/[0.08] text-xs px-2 py-0.5 rounded-md'>{seat}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-3.5 text-emerald-400 font-medium">{currency} {item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='text-center py-16'>
                        <ListCollapseIcon className='w-10 h-10 text-gray-600 mx-auto mb-3' />
                        <p className='text-gray-500'>Geen boekingen gevonden</p>
                    </div>
                )}
            </div>
        </div>
    ) : <Loading />
}

export default ListBookings
