import React from "react";


const Ethical = () => {
  return (
    <div className="w-full min-h-[525px] flex flex-col md:flex-row bg-[#f7f4f2]">
      <div className="md:w-1/2 w-full h-[300px] md:h-auto">

          <img
            src="public/assets/aunty.png"
            alt="Factory worker"
            className="w-full h-full object-cover object-center"
          />
      </div>
      <div className="md:w-1/2 w-full flex items-center justify-center px-6 md:px-16 py-10 md:py-0">
        <div>
          <div className="uppercase text-xs font-semibold tracking-widest mb-2">Our Factories</div>
          <h2 className="text-3xl md:text-4xl font-normal mb-4">Our ethical approach.</h2>
          <p className="text-base md:text-lg text-black max-w-xl">
            We spend months finding the best factories around the world—the same ones that produce your favorite designer labels. We visit them often and build strong personal relationships with the owners. Each factory is given a compliance audit to evaluate factors like fair wages, reasonable hours, and environment. Our goal? A score of 90 or above for every factory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ethical; 