import { useEffect, useState } from 'react'
import { ArrowLeftIcon, CalendarIcon, LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const AdminSidebar = () => {
    const navigate = useNavigate()
    const { axios, image_base_url } = useAppContext()
    const [upcoming, setUpcoming] = useState([])

    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
    ]

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const { data } = await axios.get('/api/show/upcoming')
                if (data.success) {
                    setUpcoming(
                        data.movies
                            .filter(m => m.poster_path && m.release_date)
                            .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                            .slice(0, 5)
                    )
                }
            } catch {
                // Fetch failed
            }
        }
        fetchUpcoming()
    }, [])

    return (
        <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-6 max-w-13 md:max-w-64 w-full bg-white/[0.02] border-r border-white/[0.06] text-sm overflow-y-auto no-scrollbar' style={{ animation: 'revealLeft 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
            {/* Profile */}
            <div className='relative group'>
                <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto ring-2 ring-primary/20 ring-offset-2 ring-offset-[#09090b] group-hover:ring-primary/40 transition-all duration-300' src={user.imageUrl} alt="Admin avatar" />
                <div className='absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-[#09090b] max-md:hidden' />
            </div>
            <p className='mt-3 text-sm font-medium max-md:hidden text-gray-200'>{user.firstName} {user.lastName}</p>
            <p className='text-[10px] text-gray-500 max-md:hidden'>Administrator</p>

            {/* Navigation links */}
            <div className='w-full mt-5'>
                {adminNavlinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        end={link.path === '/admin'}
                        className={({ isActive }) => `relative flex items-center max-md:justify-center gap-3 w-full py-3 min-md:pl-8 text-gray-400 transition-all duration-300 hover:text-gray-200 hover:bg-white/[0.04] ${isActive ? 'bg-primary/[0.08] text-primary hover:text-primary' : ''}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon className={`w-[18px] h-[18px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                                <p className='max-md:hidden'>{link.name}</p>
                                <span className={`w-[3px] h-8 rounded-l right-0 absolute transition-all duration-300 ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Upcoming movies (desktop only) */}
            {upcoming.length > 0 && (
                <div className='w-full mt-6 px-4 max-md:hidden'>
                    <div className='h-px w-full bg-white/[0.06] mb-4' />
                    <div className='flex items-center gap-2 mb-3'>
                        <CalendarIcon className='w-3.5 h-3.5 text-primary' />
                        <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>Binnenkort</p>
                    </div>
                    <div className='space-y-2.5'>
                        {upcoming.map((movie) => (
                            <div key={movie.id} className='flex items-center gap-2.5 group cursor-pointer hover:bg-white/[0.03] rounded-lg p-1.5 -mx-1.5 transition-all duration-300'>
                                <img
                                    src={image_base_url + movie.poster_path}
                                    alt={movie.title}
                                    className='w-8 h-11 rounded object-cover shrink-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300'
                                />
                                <div className='min-w-0'>
                                    <p className='text-xs text-gray-300 truncate group-hover:text-white transition-colors duration-300'>{movie.title}</p>
                                    <p className='text-[10px] text-gray-600'>
                                        {new Date(movie.release_date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Back to website button */}
            <div className='w-full mt-auto px-4 pb-5 max-md:px-1'>
                <div className='h-px w-full bg-white/[0.06] mb-4 max-md:hidden' />
                <button
                    onClick={() => navigate('/')}
                    className='group flex items-center justify-center md:justify-start gap-2 w-full py-2.5 md:px-4 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all duration-300 cursor-pointer'
                >
                    <ArrowLeftIcon className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300' />
                    <span className='max-md:hidden text-xs'>Terug naar website</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar
