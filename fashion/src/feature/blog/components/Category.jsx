import React from "react";

const categories =  [
    {title: "HOW TO STYLE WINTER WHITES",
    button: "Style", 
    img: "public/assets/pic1.png"},
    {title: "WE WON A GLOSSY AWARD", 
    button: "Transparency",  
    img: "public/assets/pic2.png"},
    {title: "CO-ORDINATE YOUR STYLE: MATCHING OUTFITES FOR EVERYONE", 
    button: "Style",  
    img: "public/assets/pic3.png"},
    {title: "BLACK FRIDAY FUND 2023", 
    button: "Transparency",  
    img: "public/assets/pic4.png"},
    {title: "WHAT TO WEAR THIS SEASON: HOLIDAY OUTFITS AND IDEAS", 
    button: "Style",  
    img: "public/assets/pic5.png"},
    {title: "THANKSGIVING OUTFIT IDEAS", 
    button: "Style",  
    img: "public/assets/pic6.png"},
    
]

const Category = () => {
    return (
        <div className="py-20">
        <h2 className="text-4xl  font-bold px-8 mb-4">The Latest</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center gap-4 px-8">
          {categories.map((item) => (
            <div
              key={item.title}
              className=" flex flex-col items-center w-full overflow-hidden rounded-md shadow group gap-5"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col items center w-full">
                <h2 className="text-black text-3xl font-semibold mb-6 drop-shadow-lg text-center">
                  {item.title}
                </h2>
                <button className=" text-black px-8 py-2 border-b-black font-medium text-base rounded-lg tracking-wide shadow hover:bg-slate-200 transition">
                  {item.button}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center py-8">  
          <button className=" flex  text-white  bg-black justify-center items-center py-4 px-20 border-b-black font-medium text-base rounded-lg tracking-wide shadow hover:bg-gray-900 transition">Load more activities</button>
          </div>
      
      </div>
    );
};


export default Category;