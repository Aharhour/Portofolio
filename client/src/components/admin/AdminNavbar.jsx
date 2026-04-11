import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
    return (
        <div className='flex items-center justify-between px-6 md:px-10 h-16 bg-black/40 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300' style={{ animation: 'revealDown 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            <Link to="/" className='hover:opacity-80 transition-opacity'>
                <img src={assets.logo} alt="logo" className='w-36 h-auto' />
            </Link>
            <div className='flex items-center gap-3'>
                <div className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
                <span className='text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full'>
                    Admin Panel
                </span>
            </div>
        </div>
    )
}

export default AdminNavbar
