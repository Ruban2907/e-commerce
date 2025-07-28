import React from 'react';

export default function LandingSection() {
  return (
    <section
      className="w-full min-h-[60vh] h-[60vh] sm:h-[70vh] md:h-screen bg-cover bg-center flex items-center justify-center relative px-2 sm:px-4"
      style={{
        backgroundImage: "url('/assets/footer-image.png')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      <div className="relative z-10 text-white text-center max-w-xl mx-auto px-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-2 sm:mb-4 leading-tight">Your Cozy Era</h1>
        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-100">
          Get peak comfy-chic<br />with new winter essentials.
        </p>
        <button className="bg-white text-black px-4 sm:px-8 py-2 font-medium text-sm sm:text-base rounded-none tracking-wide shadow hover:bg-gray-100 transition">
          SHOP NOW
        </button>
      </div>
    </section>
  );
} 