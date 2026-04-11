import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import useScrollReveal from '../library/useScrollReveal'

const Footer = () => {
    const ref = useScrollReveal()

    return (
        <footer ref={ref} className="px-6 md:px-16 lg:px-36 mt-32 w-full">
            <div className='h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-14' />

            {/* Top section */}
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 pb-14">
                <div className="md:max-w-96 reveal reveal-left">
                    <img alt="BetaTickets" className="h-11" src={assets.logo} />
                    <p className="mt-5 text-sm text-gray-400 leading-relaxed">
                        Your go-to platform for booking movie tickets online.
                        Browse the latest shows, pick your seats, and enjoy the cinema experience.
                    </p>
                    <div className="flex items-center gap-2 mt-5">
                        <img src={assets.googlePlay} alt="Google Play" className="h-9 w-auto opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer" />
                        <img src={assets.appStore} alt="App Store" className="h-9 w-auto opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer" />
                    </div>
                </div>

                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40 reveal reveal-right">
                    <div>
                        <h2 className="font-semibold text-white mb-5">Company</h2>
                        <ul className="text-sm space-y-3 text-gray-400">
                            <li><Link to="/" onClick={() => scrollTo(0, 0)} className="hover:text-white hover:pl-1 transition-all duration-300">Home</Link></li>
                            <li><Link to="/about" onClick={() => scrollTo(0, 0)} className="hover:text-white hover:pl-1 transition-all duration-300">About us</Link></li>
                            <li><Link to="/contact" onClick={() => scrollTo(0, 0)} className="hover:text-white hover:pl-1 transition-all duration-300">Contact us</Link></li>
                            <li><Link to="/privacy" onClick={() => scrollTo(0, 0)} className="hover:text-white hover:pl-1 transition-all duration-300">Privacy policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white mb-5">Get in touch</h2>
                        <div className="text-sm space-y-3 text-gray-400">
                            <p className="hover:text-gray-300 transition-colors">+31-6-154-839-98</p>
                            <p className="hover:text-gray-300 transition-colors">adilharhour@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className='h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent' />
            <p className="py-5 text-center text-xs text-gray-500 reveal">
                Copyright {new Date().getFullYear()} &copy; <a href="https://github.com/Aharhour" className="text-gray-400 hover:text-primary transition-colors duration-300">AHCORP</a>. All Rights Reserved.
            </p>
        </footer>
    )
}

export default Footer
