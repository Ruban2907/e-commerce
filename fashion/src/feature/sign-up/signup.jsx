import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";


const SignInPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    const regex= /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$"/;
    if (regex.test(form.password)) {
      //console.log(regex);
      setError("Password must contain at least one capital letter and one special character.");
      return;
    }
    fetch("http://localhost:8002/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Signup failed');
        }
        return res.json();
      })
      .then((data) => {
        console.log("Response: ", data);
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log("Token stored successfully");
        }
        navigate("/");
      }) 
      .catch((err) => {
        console.error("Error: ", err);
        setError("Signup failed. Please try again.");
      });
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/");
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left: Form */}
        <div className="flex flex-col justify-center items-center w-full md:max-w-md px-4 sm:px-8 py-8 sm:py-12 order-1 md:order-none">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
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
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long and contain at least one capital letter and at least one special character.
                </p>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
              >
                Sign In
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already a member?{' '}
              <span
                className="font-semibold text-gray-800 cursor-pointer hover:underline"
                onClick={handleLoginClick}
                tabIndex={0}
                role="button"
              >
                Log in
              </span>
            </div>
          </div>
        </div>
        {/* Right: Image */}
        <div className="w-full md:flex-1 bg-gray-100 flex items-center justify-center order-2 md:order-none">
          <img
            src="/assets/signup.png"
            alt="Sign in visual"
            className="object-cover w-full h-48 sm:h-64 md:h-full md:min-h-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 