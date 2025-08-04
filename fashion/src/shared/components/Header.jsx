import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { isAdmin, clearUserInfo } from '../../utils/userUtils'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        clearUserInfo();
        console.log("Token and user info removed from localStorage");
        navigate("/");
    };
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm">
            <nav className="px-4 md:px-8 py-3 md:py-4">
                <div className="flex justify-between items-center w-full">


                    <div className="hidden md:flex items-center gap-4 md:gap-6">
                        <NavLink to="/contact" className={({isActive}) => `text-xs md:text-sm font-medium ${isActive ? 'text-orange-700' : 'text-amber-900'} hover:text-orange-700 transition`}>Contact Us</NavLink>
                        <NavLink to="/about" className={({isActive}) => `text-xs md:text-sm font-medium ${isActive ? 'text-orange-700' : 'text-amber-900'} hover:text-orange-700 transition`}>About</NavLink>
                        <NavLink to="/stories" className={({isActive}) => `text-xs md:text-sm font-medium ${isActive ? 'text-orange-700' : 'text-amber-900'} hover:text-orange-700 transition`}>Evenworld Stories</NavLink>
                        {isAdmin() && (
                            <NavLink to="/admin" className={({isActive}) => `text-xs md:text-sm font-medium ${isActive ? 'text-orange-700' : 'text-amber-900'} hover:text-orange-700 transition`}>Admin Panel</NavLink>
                        )}
                    </div>
                    


                    <button
                        className="md:hidden p-2 text-white focus:outline-none"
                        aria-label="Open menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link to="/home" className="flex items-center">
                        <span className="text-xl md:text-2xl font-bold tracking-widest text-amber-900">EVERLANE</span>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-4 ">
                        <NavLink to= "/listing">
                        <button className="bg-trasparent text-amber-900 px-2 sm:px-6 py-1 font-medium text-sm sm:text-base rounded-lg tracking-wide shadow hover:bg-gray-300 transition">
                            SHOP NOW
                        </button>
                        </NavLink>
                        <NavLink to= "/profile">
                        <button className="p-2 hover:bg-white/20 rounded-full" aria-label="Account">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-900">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
                            </svg>
                        </button>
                        </NavLink>
                        <button className="p-2 hover:bg-white/20 rounded-full" aria-label="Cart">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-900">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0A48.108 48.108 0 0112 6.75c2.885 0 5.725.21 8.394.622l.383-1.437A1.125 1.125 0 0020.364 3H21.75M6.75 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="text-xs md:text-sm font-medium text-amber-900 hover:text-orange-700 transition cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2 bg-white/90 rounded-lg shadow-lg py-4 px-6 flex flex-col gap-4 absolute left-4 right-4 top-16 z-50">
                        <NavLink to="/contact" className={({isActive}) => `text-base font-medium ${isActive ? 'text-orange-700' : 'text-black'} hover:text-orange-700 transition`} onClick={() => setMobileMenuOpen(false)}>Contact Us</NavLink>
                        <NavLink to="/about" className={({isActive}) => `text-base font-medium ${isActive ? 'text-orange-700' : 'text-black'} hover:text-orange-700 transition`} onClick={() => setMobileMenuOpen(false)}>About</NavLink>
                        <NavLink to="/stories" className={({isActive}) => `text-base font-medium ${isActive ? 'text-orange-700' : 'text-black'} hover:text-orange-700 transition`} onClick={() => setMobileMenuOpen(false)}>Evenworld Stories</NavLink>
                        {isAdmin() && (
                            <NavLink to="/admin" className={({isActive}) => `text-base font-medium ${isActive ? 'text-orange-700' : 'text-black'} hover:text-orange-700 transition`} onClick={() => setMobileMenuOpen(false)}>Admin Panel</NavLink>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}