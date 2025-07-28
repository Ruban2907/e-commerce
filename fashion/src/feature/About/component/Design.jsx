import React from "react";

const Design = () => {
  return (
    <div className="w-full min-h-[435px] flex flex-col md:flex-row bg-[#f7f4f2]">
      <div className="md:w-1/2 w-full flex items-center justify-center px-6 md:px-16 py-10 md:py-0">
        <div>
          <div className="uppercase text-xs font-semibold tracking-widest mb-2">Our Quality</div>
          <h2 className="text-3xl md:text-4xl font-normal mb-4">Designed<br />to last.</h2>
          <p className="text-base md:text-lg text-black max-w-xl">
            At Everlane, we're not big on trends. We want you to wear our pieces for years, even decades, to come. That’s why we source the finest materials and factories for our timeless products—like our Grade-A cashmere sweaters, Italian shoes, and Peruvian Pima tees.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 w-full h-[250px] md:h-auto flex items-center justify-center">
          <img
            src="public/assets/clothes.png"
            alt="Quality materials"
            className="w-full h-full object-cover object-center"
          />
      </div>
    </div>
  );
};

export default Design; 