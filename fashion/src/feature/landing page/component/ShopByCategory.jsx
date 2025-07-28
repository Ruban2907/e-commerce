import React from "react";
import { NavLink } from "react-router-dom";

const categories =  [
    {Pname: "SHIRTS",  img: "public/assets/shirts.png"},
    {Pname: "DENIM",  img: "public/assets/denim.png"},
    {Pname: "TEES",  img: "public/assets/tees.png"},
    {Pname: "PANTS",  img: "public/assets/pants.png"},
    {Pname: "SWEATERS",  img: "public/assets/sweater.png"},
    {Pname: "OUTWEARS",  img: "public/assets/jacket.png"},
]
const featured = [
    {
        title: "New Arrivals",
        img: "public/assets/someday.png",
        button: "SHOP THE LATEST",
    },
    {
        title: "Best-Sellers",
        img: "public/assets/everyday.png",
        button: "SHOP YOUR FAVOURITES",
    },
    {
        title: "The Holiday Outfit",
        img: "public/assets/holiday.png",
        button: "SHOP OCCASION",
    },
]

const ShopByCategory = () => {
    return (
        <div className="py-10 sm:py-14 md:py-20 bg-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center mb-6 sm:mb-10">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-8">
                {categories.map((cat) => (
                    <div key={cat.Pname} className="flex flex-col items-center w-full">
                        <NavLink to="/listing" className="w-full flex flex-col items-center">
                        <img src={cat.img} alt={cat.Pname}
                            className="w-full max-w-[120px] sm:max-w-[140px] md:max-w-none h-32 sm:h-40 md:h-48 object-cover rounded-md shadow-sm mb-2 sm:mb-3 transition-transform duration-200 hover:scale-105" />
                        <span className="text-xs sm:text-sm md:text-base tracking-widest font-medium underline underline-offset-4 cursor-pointer text-center">
                            {cat.Pname}
                        </span>  
                        </NavLink>
                    </div>
                ))}
            </div>
        <div className="py-10 sm:py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-8">
          {featured.map((item) => (
            <div
              key={item.title}
              className="relative flex flex-col items-center w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-md shadow group"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center px-2">
                <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-6 drop-shadow-lg text-center">
                  {item.title}
                </h2>
                <NavLink to="/listing">
                <button className="bg-white text-black px-4 sm:px-8 py-2 font-medium text-xs sm:text-base rounded-none tracking-wide shadow hover:bg-gray-100 transition">
                  {item.button}
                </button>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
};

export default ShopByCategory;