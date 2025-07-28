import React from "react";

const Open = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden mb-5">
      
        <img
          src="public/assets/Open.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0 "
        />
    
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="rounded-md px-8 py-10 bg-transparent text-center max-w-xl mx-auto">
          <div className="text-white text-4xl md:text-5xl font-normal leading-tight mb-6">
            We believe<br />
            we can all<br />
            make<br />
            a difference.
          </div>
          <div className="text-white text-lg font-light mt-2">
            Our way: Exceptional quality.<br />
            Ethical factories. Radical Transparency.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Open; 