import React from "react";

const content = { image: "public/assets/kala.png" };

const TestimonialPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white px-2 sm:px-4 md:px-8 py-8">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-2 sm:px-6 md:px-10 py-6 md:py-16">
        <div>
          <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg text-center md:text-left">People Are Talking</p>
          <div className="flex items-center justify-center md:justify-start mb-2 sm:mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-black text-lg sm:text-xl mr-1">★</span>
            ))}
          </div>
          <blockquote className="text-lg sm:text-2xl md:text-3xl font-light mb-4 sm:mb-8 text-black text-center md:text-left">
            “Love this shirt! Fits perfectly and the fabric is thick without being stiff.”
          </blockquote>
          <p className="text-gray-700 text-xs sm:text-base text-center md:text-left">
            -- JonSnSF,{' '}
            <a href="#" className="underline">The Heavyweight Overshirt</a>
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center py-4 md:py-0">
        <div className="w-full flex items-center justify-center">
          <img 
            src={content.image} 
            alt="Testimonial" 
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto max-h-48 sm:max-h-72 md:max-h-[400px] lg:max-h-[550px] object-contain rounded shadow mx-auto" 
            style={{ aspectRatio: '4/5' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage; 