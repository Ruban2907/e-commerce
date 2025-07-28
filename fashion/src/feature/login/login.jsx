import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    fetch("http://localhost:8002/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('login failed');
        }
        return res.json();
      })
      .then((data) => {
        console.log("Response: ", data);
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error: ", err);
        setError("login failed. Please try again.");
      });
    
  };

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    navigate("/sign");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full md:max-w-md px-4 sm:px-8 py-8 sm:py-12 order-1 md:order-none">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Log In</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
              >
                Continue
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Are you a Newbie?{' '}
              <span
                className="font-semibold text-gray-800 cursor-pointer hover:underline"
                onClick={handleGetStartedClick}
                tabIndex={0}
                role="button"
              >
               Sign Up
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:flex-1 bg-gray-100 flex items-center justify-center order-2 md:order-none">
          <img
            src="/assets/login.png"
            alt="Login visual"
            className="object-cover w-full h-48 sm:h-64 md:h-full md:min-h-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 