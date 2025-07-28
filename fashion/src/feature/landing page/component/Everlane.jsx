import React from "react";

const categories =  [
    {img: "public/assets/ayp1.png"},
    {img: "public/assets/ayp2.png"},
    {img: "public/assets/ayp3.png"},
    {img: "public/assets/ayp4.png"},
    {img: "public/assets/ayp5.png"},
]
const featured = [
    {
        title: "Complimentary SHipping",
        img: "public/assets/dice.png",
        button: "Enjoy free shipping on U.S. orders over $100.",
    },
    {
        title: "Conciously Crafted",
        img: "public/assets/hanger.png",
        button: "Designed with you and the planet in mind.",
    },
    {
        title: "Come say HI",
        img: "public/assets/loc.png",
        button: "We have 11 stores across the U.S.",
    },
]

const Everlane = () => {
    return (
        <div className="py-10 sm:py-14 md:py-20 bg-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center mb-4 sm:mb-6 md:mb-10">EverLane On You</h2>
            <p className="text-base sm:text-lg md:text-2xl font-medium text-center mb-1 sm:mb-2">Share your latest look with #EverlaneOnYou for a chance to be featured.</p>
            <p className="text-base sm:text-lg md:text-2xl font-medium text-center underline mb-4 sm:mb-8 md:mb-10">Add Photo</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-8 mb-8 md:mb-12">
                {categories.map((cat, idx) => (
                    <div key={idx} className="flex flex-col items-center w-full">
                        <img src={cat.img} alt={cat.Pname}
                            className="w-full max-w-[120px] sm:max-w-[140px] md:max-w-none h-32 sm:h-40 md:h-48 object-cover rounded-md shadow-sm mb-2 sm:mb-3 transition-transform duration-200 hover:scale-105" />  
                    </div>
                ))}
            </div>
        <div className="py-10 sm:py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-8">
          {featured.map((item) => (
            <div
              key={item.title}
              className="relative flex flex-col items-center w-full h-56 sm:h-64 md:h-80 lg:h-80 rounded-md px-2 sm:px-6 md:px-10 bg-gray-50 shadow"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover transition-transform duration-300 group-hover:scale-105 mb-2 mt-4"
              />
              <div className="flex flex-col text-center items-center w-full px-2">
                <h2 className="text-xs sm:text-sm md:text-base tracking-widest font-medium underline underline-offset-4 cursor-pointer mb-1 mt-2">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base tracking-widest font-medium">
                  {item.button}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
};

export default Everlane; 