import React from "react";

const categories =  [
    {title: "The Cloud Relaxed Cardigan",
    button: "Black", 
    img: "public/assets/09.png",
    price: "$133"},
    {title: "Long-Sleeve Turtleneck", 
    button: "Black",  
    img: "public/assets/08.png",
    price: "$133"},
    {title: "The Wool Flannel Pant", 
    button: "Heather Charcoal",  
    img: "public/assets/07.png",
    price: "$133"},
    {title: "The Cloud Relaxed Cardigan", 
    button: "Black",  
    img: "public/assets/06.png",
    price: "$133"},
    {title: "Long-Sleeve Turtleneck", 
    button: "Black",  
    img: "public/assets/05.png",
    price: "$133"},
    {title: "The Wool Flannel Pant", 
    button: "Heather Charcoal",  
    img: "public/assets/04.png",
    price: "$133"},
    {title: "The Cloud Relaxed Cardigan", 
    button: "Black",  
    img: "public/assets/03.png",
    price: "$133"},
    {title: "Long-Sleeve Turtleneck", 
    button: "Black",  
    img: "public/assets/02.png",
    price: "$133"},
    {title: "The Wool Flannel Pant", 
    button: "Heather Charcoal",  
    img: "public/assets/01.png",
    price: "$133"},
    
]

const List = () => {
    return (
        <div className="py-20">
        <h2 className="text-4xl  font-bold px-8 mb-4">Men’s Clothing & Apparel - New Arrivals</h2>
        <p className="text-4xl  font-bold px-8 mb-4">Featured</p>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center gap-4 px-8">
          {categories.map((item) => (
            <div
              key={item.title}
              className=" flex flex-col w-full overflow-hidden rounded-md shadow group gap-5"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col w-full">
                <h2 className="text-black text-3xl font-semibold mb-1 drop-shadow-lg px-4">
                  {item.title}
                </h2>
              </div>
              <div className="flex flex-col w-full px-4">
                <h2 className="text-black text-lg mb-1 drop-shadow-lg">
                  {item.button}
                </h2>
                <h3 className="text-black text-lg drop-shadow-lg">
                  {item.price}
                </h3>
              </div>
              <div  className="flex gap-1 items-start justify-start mb-4 px-4">
                <div className="bg-black p-3 w-fit rounded-full"></div>
                <div className="bg-lime-950 p-3 w-fit rounded-full"></div>
                <div className="bg-orange-950 p-3 w-fit rounded-full"></div> </div>
            </div>
          ))}
        </div>
      </div>
    );
};


export default List;