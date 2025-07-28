import React from "react";

const categories =  [
    {Pname: "The Waffle Long-Sleeve Crew", price:"$60", color:"Bone",  img: "public/assets/kameez.png"},
    {Pname: "The Bomber Jacket | Uniform", price:"$198", color:"Toased Coconut", img: "public/assets/shalwar.png"},
    {Pname: "The Slim 4-Way Stretch Organic Jean | Uniform", price:"$240", color:"Dark Indigo", img: "public/assets/vest.png"},
    {Pname: "The Essential Organic Crew", price:"$Muft", color:"Vintage Black", img: "public/assets/long-sleeve.png"},
]

const Category = () => {
    return (
        <div className="py-10 sm:py-14 md:py-20 bg-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center mb-4 sm:mb-6 md:mb-10">Everlane Favourites </h2>
            <p className="text-base sm:text-lg md:text-2xl font-medium text-center mb-4 sm:mb-8 md:mb-10">Beautifully Functional. Purposefully Designed. Consciously Crafted.</p>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-8">
                {categories.map((cat) => (
                    <div key={cat.Pname} className="flex flex-col items-center w-full mb-6">
                        <img src={cat.img} alt={cat.Pname}
                            className="h-56 sm:h-72 md:h-96 lg:h-[500px] w-full max-w-xs sm:max-w-sm md:max-w-md object-cover rounded-md mb-2 sm:mb-3" />
                        <h1 className="text-xs sm:text-sm md:text-base tracking-widest font-medium underline underline-offset-4 cursor-pointer text-center">
                            {cat.Pname}
                        </h1> 
                        <p className="text-green-600 text-xs sm:text-sm tracking-widest font-medium cursor-pointer text-center">{cat.price}</p> 
                        <p className="text-red-700 text-xs sm:text-sm text-center">{cat.color}</p> 
                    </div>
                ))}
            </div>
    </div>
    );
};

export default Category;