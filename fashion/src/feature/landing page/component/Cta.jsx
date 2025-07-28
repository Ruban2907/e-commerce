import React from "react";
import { NavLink } from "react-router-dom";
const Cta = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white w-full">
      <div className="w-full relative h-56 sm:h-64 md:h-80 flex items-center justify-center px-2 sm:px-6 md:px-8">
        <img src="public/assets/cta.png" alt="please forgive me" className="rounded-lg w-full h-full object-cover" />
        <div className="w-full absolute inset-0 flex flex-col items-center justify-center px-2 sm:px-6">
          <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-center drop-shadow-lg">Special Offer Just For You!</h2>
          <p className="text-white text-xs sm:text-base mb-4 sm:mb-6 text-center drop-shadow-lg max-w-xl">Discover our latest collection and enjoy exclusive discounts. Don't miss out on this limited-time opportunity to upgrade your style!</p>
          <NavLink to={'/listing'}>
            <button className="bg-black text-white px-4 sm:px-6 py-2 rounded hover:bg-gray-800 transition text-xs sm:text-base">Shop Now</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Cta; 