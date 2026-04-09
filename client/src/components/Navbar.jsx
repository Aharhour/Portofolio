import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/react'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { user } = useUser()
    const { openSignIn } = useClerk()
    const navigate = useNavigate()
    const { favoriteMovies } = useAppContext()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const linkClass = ({ isActive }) =>
        `relative py-1 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-300 hover:text-white'}`

    return (
        <div className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-4 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg shadow-black/20' : ''}`}>
            <Link to='/' className='max-md:flex-1'>
                <img src={assets.logo} alt="BetaTickets" className='w-36 h-auto' />
            </Link>

            {/* Nav links */}
            <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:gap-1 md:rounded-full backdrop-blur bg-black/70 md:bg-white/[0.06] md:border border-white/[0.08] overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full max-md:h-screen' : 'max-md:w-0 max-md:h-screen'}`}>

                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(false)} />

                <NavLink onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/' end className={linkClass}>
                    <span className='md:px-4 md:py-2'>Home</span>
                </NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/movies' className={linkClass}>
                    <span className='md:px-4 md:py-2'>Movies</span>
                </NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/theaters' className={linkClass}>
                    <span className='md:px-4 md:py-2'>Zalen</span>
                </NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/releases' className={linkClass}>
                    <span className='md:px-4 md:py-2'>Releases</span>
                </NavLink>
                {favoriteMovies.length > 0 && (
                    <NavLink onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/favorite' className={linkClass}>
                        <span className='md:px-4 md:py-2'>Favorites</span>
                    </NavLink>
                )}
            </div>

            {/* Auth section */}
            <div className='flex items-center gap-6'>
                <SearchIcon className='max-md:hidden w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition' />
                {!user ? (
                    <button onClick={openSignIn} className='px-5 py-2 bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full text-sm font-medium cursor-pointer'>
                        Login
                    </button>
                ) : (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action
                                label="My Bookings"
                                labelIcon={<TicketPlus width={15} />}
                                onClick={() => navigate('/my-bookings')}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                )}
            </div>

            <MenuIcon className='max-md:ml-4 md:hidden w-7 h-7 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
        </div>
    )
}

export default Navbar
