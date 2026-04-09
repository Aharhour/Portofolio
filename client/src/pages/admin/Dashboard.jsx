import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon, TrendingUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../library/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { axios, getToken, user, image_base_url } = useAppContext()
    const currency = import.meta.env.VITE_CURRENCY

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const d = dashboardData || {}
    const dashboardCards = [
        { title: "Totaal Boekingen", value: String(d.totalBookings ?? 0), icon: ChartLineIcon, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        { title: "Totale Omzet", value: `${currency} ${(d.totalRevenue ?? 0).toFixed(2)}`, icon: CircleDollarSignIcon, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        { title: "Actieve Shows", value: String(d.activeShows?.length ?? 0), icon: PlayCircleIcon, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
        { title: "Totaal Gebruikers", value: String(d.totalUser ?? 0), icon: UserIcon, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    ]

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setDashboardData(data.data)
                setLoading(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Error fetching dashboard data')
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user]);

    return !loading ? (
        <div className='animate-fade-in'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <Title text1="Admin" text2="Dashboard" />
                    <p className='text-gray-500 text-sm mt-1'>Overzicht van je bioscoop</p>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <TrendingUpIcon className='w-4 h-4 text-emerald-400' />
                    <span>Live data</span>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
                {dashboardCards.map((card, index) => (
                    <div key={index} className={`relative overflow-hidden flex items-center gap-4 px-5 py-5 border rounded-xl ${card.bg}`}>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.05] ${card.color}`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">{card.title}</p>
                            <p className="text-2xl font-bold mt-0.5">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active shows */}
            <div className='mt-12'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h2 className="text-lg font-semibold">Actieve Shows</h2>
                        <p className='text-xs text-gray-500'>{dashboardData?.activeShows?.length || 0} shows gepland</p>
                    </div>
                </div>

                {dashboardData?.activeShows?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {dashboardData.activeShows.map((show) => (
                            <div key={show._id} className="group rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-300">
                                {/* Poster */}
                                <div className='relative aspect-[2/3] overflow-hidden'>
                                    <img
                                        src={image_base_url + show.movie_id.poster_path}
                                        alt={show.movie_id.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />

                                    {/* Price badge */}
                                    <div className='absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-sm font-semibold px-2.5 py-1 rounded-lg'>
                                        {currency} {show.showPrice}
                                    </div>

                                    {/* Rating */}
                                    <div className='absolute bottom-3 right-3 flex items-center gap-1 text-xs'>
                                        <StarIcon className="w-3.5 h-3.5 text-primary fill-primary" />
                                        {show.movie_id.vote_average.toFixed(1)}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className='p-4'>
                                    <p className="font-medium truncate">{show.movie_id.title}</p>
                                    <p className="text-xs text-gray-500 mt-1.5">{dateFormat(show.showDateTime)}</p>
                                    <div className='flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]'>
                                        <span className='text-xs text-gray-400'>
                                            {Object.keys(show.occupiedSeats).length} stoelen geboekt
                                        </span>
                                        <span className='text-xs font-medium text-emerald-400'>
                                            {currency} {(Object.keys(show.occupiedSeats).length * show.showPrice).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-16 bg-white/[0.02] rounded-xl border border-white/[0.06]'>
                        <PlayCircleIcon className='w-10 h-10 text-gray-600 mx-auto mb-3' />
                        <p className='text-gray-500'>Geen actieve shows op dit moment</p>
                    </div>
                )}
            </div>
        </div>
    ) : <Loading />
}

export default Dashboard
