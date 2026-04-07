import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            {/* Top section: brand info, links, and contact */}
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <img alt="BetaTickets" className="h-11" src={assets.logo} />
                    <p className="mt-6 text-sm">
                        Your go-to platform for booking movie tickets online.
                        Browse the latest shows, pick your seats, and enjoy the cinema experience.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={assets.googlePlay} alt="Google Play" className="h-9 w-auto" />
                        <img src={assets.appStore} alt="App Store" className="h-9 w-auto" />
                    </div>
                </div>

                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+31-6-154-839-98</p>
                            <p>adilharhour@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} &copy; <a href="https://github.com/Aharhour">AHCORP</a>. All Rights Reserved.
            </p>
        </footer>
    )
}

export default Footer
