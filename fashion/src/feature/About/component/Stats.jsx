import React from "react";


const Stat = () => {
  return (
    <div className="w-full min-h-[525px] flex flex-col md:flex-row ">
      <div className="md:w-1/2 w-full h-[100px] md:h-auto">

          <img
            src="public/assets/stats.png"
            alt="Factory worker"
            className="w-full h-[600px] object-contain object-center"
          />
      </div>
      <div className="md:w-1/2 w-full flex items-center justify-center px-6 md:px-16 py-10 md:py-0 bg-[#f7f4f2]">
        <div>
          <div className="uppercase text-xs font-semibold tracking-widest mb-2">Our Prices</div>
          <h2 className="text-3xl md:text-4xl font-normal mb-4">Radially Transparent</h2>
          <p className="text-base md:text-lg text-black max-w-xl">
            We believe our customers have a right to know how much their clothes cost to make. We reveal the true costs behind all of our products—from materials to labor to transportation—then offer them to you, minus the traditional retail markup.

          </p>
        </div>
      </div>
    </div>
  );
};

export default Stat; 