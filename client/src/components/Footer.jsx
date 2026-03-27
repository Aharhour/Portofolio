import React from 'react'
import { assets } from '../assets/assets'


// Footer - The website footer with company info, links, and contact details
const Footer = () => {
  return (
       <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            {/* Main footer content divided into left (logo/description) and right (links/contact) */}
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                {/* Left side: logo, description, and app store links */}
                <div className="md:max-w-96">
                    <img alt="" class="h-11" src={assets.logo} />
                    <p className="mt-6 text-sm">
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    {/* App download badges */}
                    <div className="flex items-center gap-2 mt-4">
                        <img src={assets.googlePlay} alt="google play" className="h-9 w-auto" />
                        <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
                    </div>
                </div>
                {/* Right side: company links and contact info */}
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    {/* Company navigation links */}
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    {/* Contact information */}
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+31-6-154-839-98</p>
                            <p>adilharhour@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Copyright notice at the bottom */}
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © <a href="https://github.com/Aharhour">AHCORP</a>. All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer
