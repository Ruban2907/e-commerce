import React from "react";

const Final = () => {
  return (
    <footer className="bg-gray-50 border-t-2 border-purple-400 pt-8 pb-2 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 w-full md:w-2/3">
            <div className="min-w-[140px] flex-1">
              <h3 className="font-semibold mb-3">Acount</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Log In</li>
                <li>Sign Up</li>
                <li>Redeem a Gift Card</li>
              </ul>
            </div>
            <div className="min-w-[140px] flex-1">
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About</li>
                <li>Environmental Initiatives</li>
                <li>Factories</li>
                <li>DEI</li>
                <li>Careers</li>
                <li>International</li>
                <li>Accessibility</li>
              </ul>
            </div>
            <div className="min-w-[140px] flex-1">
              <h3 className="font-semibold mb-3">Get Help</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Return Policy</li>
                <li>Shipping Info</li>
                <li>Bulk Orders</li>
              </ul>
            </div>
            <div className="min-w-[140px] flex-1">
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Affiliates</li>
                <li>Out Stores</li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-end justify-end mt-4 md:mt-0">
            <form className="flex w-full max-w-xs">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none bg-white text-sm"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-r hover:bg-gray-800 transition"
              >
                <span className="text-xl">→</span>
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 border-t pt-4 gap-2">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center md:justify-start text-center md:text-left">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Do Not Sell or Share My Personal Information</span>
            <span>CS Supply Chain Transparency</span>
            <span>Vendor Code of Conduct</span>
            <span>Sitemap Pages</span>
            <span>Sitemap Products</span>
          </div>
          <div className="text-center md:text-right w-full md:w-auto">
            © 2023 All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Final; 