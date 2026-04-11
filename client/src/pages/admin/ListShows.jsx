import { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../library/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { ListIcon } from 'lucide-react';

const ListShows = () => {
    const { axios, getToken, user } = useAppContext()
    const currency = import.meta.env.VITE_CURRENCY

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-shows', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setShows(data.shows)
            setLoading(false);
        } catch (error) {
            // Fetch failed
        }
    }

    useEffect(() => {
        if (user) {
            getAllShows()
        }
    }, [user]);

    return !loading ? (
        <div>
            <div style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <Title text1="List" text2="Shows" />
                <p className='text-gray-500 text-sm mt-1'>{shows.length} shows gevonden</p>
            </div>

            {/* Shows table with earnings calculation */}
            <div className="max-w-5xl mt-6 overflow-x-auto rounded-xl border border-white/[0.06]" style={{ animation: 'revealUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                {shows.length > 0 ? (
                    <table className="w-full border-collapse text-nowrap">
                        <thead>
                            <tr className="bg-primary/10 text-left text-gray-300 text-sm">
                                <th className="p-3.5 font-medium pl-5">Film</th>
                                <th className="p-3.5 font-medium">Showtime</th>
                                <th className="p-3.5 font-medium">Boekingen</th>
                                <th className="p-3.5 font-medium">Opbrengst</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {shows.map((show, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200"
                                    style={{ animation: `revealUp 0.4s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.03}s both` }}
                                >
                                    <td className="p-3.5 pl-5 font-medium">{show.movie_id.title}</td>
                                    <td className="p-3.5 text-gray-400">{dateFormat(show.showDateTime)}</td>
                                    <td className="p-3.5">
                                        <span className='bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full'>
                                            {Object.keys(show.occupiedSeats).length}
                                        </span>
                                    </td>
                                    <td className="p-3.5 text-emerald-400 font-medium">{currency} {(Object.keys(show.occupiedSeats).length * show.showPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='text-center py-16'>
                        <ListIcon className='w-10 h-10 text-gray-600 mx-auto mb-3' />
                        <p className='text-gray-500'>Geen shows gevonden</p>
                    </div>
                )}
            </div>
        </div>
    ) : <Loading />
}

export default ListShows
