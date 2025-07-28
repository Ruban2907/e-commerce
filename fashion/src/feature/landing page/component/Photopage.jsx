import React from "react";

const categories = [
    {
        welcome: "Our Holiday Gift Picks",
        Pname: "The best presenter for everyone on your list",
        lm: "Read More",
        img: "public/assets/hp.png"
    },
    {
        welcome: "Cleaner Fashion",
        Pname: "See the sustainability effors behind each of our products",
        lm: "Learn More",
        img: "public/assets/cf.png"
    },
];

const Photopage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col justify-between bg-white">
            <div className="border-b-2 w-full border-gray-950 pt-6 sm:pt-8 mb-8 sm:mb-12"></div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-6 sm:gap-8 px-2 sm:px-8 md:px-16 lg:px-32 flex-1">
                {categories.map((cat) => (
                    <div key={cat.Pname} className="flex flex-col items-center w-full mb-8 sm:mb-12">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4 text-center">{cat.welcome}</h2>
                        <img
                            src={cat.img}
                            alt={cat.Pname}
                            className="h-48 sm:h-64 md:h-80 lg:h-[400px] xl:h-[600px] object-cover rounded-md mb-3 sm:mb-5 w-full max-w-xs sm:max-w-md shadow"
                        />
                        <h1 className="text-xs sm:text-sm md:text-base tracking-widest font-medium underline underline-offset-4 cursor-pointer mb-4 sm:mb-6 text-center">
                            {cat.Pname}
                        </h1>
                        <p className="text-black text-xs sm:text-sm text-center tracking-widest font-medium underline cursor-pointer">{cat.lm}</p>
                    </div>
                ))}
            </div>
            <div className="border-b-2 w-full border-gray-950 mt-8 sm:mt-12"></div>
        </div>
    );
};

export default Photopage;