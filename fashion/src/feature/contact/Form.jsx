import React from "react";


const Form = () => {
  return (
    <div className="w-full min-h-[525px] flex flex-col md:flex-row py-20">
      <div className="md:w-1/2 w-full h-[100px] md:h-auto">

          <img
            src="public/assets/contact.png"
            alt="Factory worker"
            className="w-full h-[600px] object-contain object-center"
          />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-5xl font-bold text-center mb-2">EverLane</h1>
          <h2 className="text-2xl text-center mb-8 text-gray-600">Complaints and Suggestions Box</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Form submitted'); }}>
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Value"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Surname</label>
              <input
                type="text"
                placeholder="Value"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Value"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Message</label>
              <textarea
                placeholder="Value"
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form; 