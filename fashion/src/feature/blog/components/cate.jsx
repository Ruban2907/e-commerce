import React from "react";

const categories =  [
    {Pname: "Carbon Commitment",  img: "public/assets/cat03.png"},
    {Pname: "Environmental Initiatives",  img: "public/assets/cat02.png"},
    {Pname: "Better Factories",  img: "public/assets/cat01.png"},
    
]

const Cate = () => {
    return (
        <div className="py-20 bg-white">
            <h2 className="text-3xl font-bold text-start mb-8 px-8">Our Progress</h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center items-center gap-4 px-8">
                {categories.map((cat) => (
                    <div key={cat.Pname} className="flex flex-col items center w-full" >
                        <img src = {cat.img} alt={cat.Pname}
                            className="w-full h-86 object-cover rounded-md shadow-sm mb-3" />
                        <span className="text-lg text-start tracking-widest font-medium  cursor-pointer">
                            {cat.Pname}
                        </span>  
                    </div>
                ))}
            </div>
    </div>
    );
};

export default Cate;