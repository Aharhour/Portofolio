import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()

    return (
        <div className='relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/background.png")] bg-cover bg-center h-screen overflow-hidden'>
            {/* Overlay gradient for depth */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none' />
            <div className='absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent pointer-events-none' />

            <div className='relative z-10 flex flex-col items-start gap-4'>
                <img src={assets.marvelLogo} alt="Marvel" className="max-h-11 lg:h-11 mt-20 animate-fade-in" />

                <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110' style={{ animation: 'revealBlur 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                    Avengers <br /> Endgame
                </h1>

                <div className='flex items-center gap-4 text-gray-300' style={{ animation: 'revealUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}>
                    <span>Action | Adventure | Sci-Fi</span>
                    <div className='flex items-center gap-1'>
                        <CalendarIcon className='w-4.5 h-4.5' /> 2019
                    </div>
                    <div className='flex items-center gap-1'>
                        <ClockIcon className='w-4.5 h-4.5' /> 3h 1m
                    </div>
                </div>

                <p className='max-w-md text-gray-300' style={{ animation: 'revealUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both' }}>
                    After the devastating events of Avengers: Infinity War (2018),
                    the universe is in ruins. With the help of remaining allies,
                    the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.
                </p>

                <button
                    onClick={() => navigate('/movies')}
                    className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer btn-press glow-primary'
                    style={{ animation: 'revealUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s both' }}
                >
                    Explore Movies
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default HeroSection
