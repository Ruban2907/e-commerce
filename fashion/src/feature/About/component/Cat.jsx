import React from "react";

const categories =  [
    {Pname: "Our Products",  img: "public/assets/fashion.png"},
    {Pname: "Our Stores",  img: "public/assets/store.png"},
    {Pname: "Careers",  img: "public/assets/setup.png"},
    
]

const Cat = () => {
    return (
        <div className="py-20 bg-white">
            <h2 className="text-2xl font-medium text-center mb-10">More To Explore</h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center items-center gap-4 px-8">
                {categories.map((cat) => (
                    <div key={cat.Pname} className="flex flex-col items center w-full" >
                        <img src = {cat.img} alt={cat.Pname}
                            className="w-full h-86 object-cover rounded-md shadow-sm mb-3" />
                        <span className="text-sm text-center tracking-widest font-medium  cursor-pointer">
                            {cat.Pname}
                        </span>  
                    </div>
                ))}
            </div>
    </div>
    );
};

export default Cat;