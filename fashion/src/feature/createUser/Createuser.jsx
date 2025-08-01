import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usersAPI } from "../../services/api";


const Create = () => {
  const navigate = useNavigate();
  const editMode = location.state?.editMode || false;
  const userData = location.state?.userData || null;
  
  const [form, setForm] = useState({ 
    firstname: "", 
    lastname: "", 
    email: "", 
    password: "", 
    gender: "", 
    contact: "", 
    address: "" 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [currentProfilePicture, setCurrentProfilePicture] = useState(null);

  useEffect(() => {
    if (editMode && userData) {
      setForm({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        password: "", 
        gender: userData.gender || "",
        contact: userData.contact || "",
        address: userData.address || ""
      });
      
      if (userData.picture && userData.picture.data) {
        const token = localStorage.getItem('token');
        setCurrentProfilePicture(`http://localhost:8002/profile-picture?token=${encodeURIComponent(token)}&userId=${userData._id}`);
      }
    }
  }, [editMode, userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file.");
        return;
      }
      
      setSelectedFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.firstname || !form.lastname || !form.email || !form.address) {
      setError("First name, last name, email, and address are required.");
      return;
    }
    
    if (!editMode && !form.password) {
      setError("Password is required for new users.");
      return;
    }
    
    if (form.password && form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    if (form.password) {
      const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!4@$%^&*-]).{8,}$/;
      if (!regex.test(form.password)) {
        setError("Password must contain at least one capital letter and one special character.");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('firstname', form.firstname);
      formData.append('lastname', form.lastname);
      formData.append('email', form.email);
      if (form.password) {
        formData.append('password', form.password);
      }
      formData.append('gender', form.gender);
      formData.append('contact', form.contact);
      formData.append('address', form.address);
      if (selectedFile) {
        formData.append('picture', selectedFile);
      }

      let response;
      if (editMode) {
        response = await usersAPI.updateUser(userData._id, formData);
        console.log("User updated successfully:", response);
        alert("User updated successfully!");
      } else {
        response = await usersAPI.createUser(formData);
        console.log("User created successfully:", response);
        alert("User created successfully!");
      }
      
      navigate("/admin");
    } catch (err) {
      console.error(editMode ? "Error updating user:" : "Error creating user:", err);
      setError(err.response?.data?.message || (editMode ? "Update failed. Please try again." : "Creation failed. Please try again."));
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/admin");
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8 py-20">
      <div className="flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full md:max-w-md px-4 sm:px-8 py-8 sm:py-12 order-1 md:order-none">
          <div className="w-full max-w-sm h-full flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">{editMode ? 'Edit User' : 'Create User'}</h2>
            <div className="flex-1 overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-5 pb-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={form.lastname}
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
                <label className="block text-gray-700 mb-1" htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="contact">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your contact number"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="password">
                  Password {editMode && <span className="text-gray-500">(Leave blank to keep current password)</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required={!editMode}
                  placeholder={editMode ? "Leave blank to keep current password" : "Enter password"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long and contain at least one capital letter and at least one special character.
                </p>
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="picture">Profile Picture (Optional)</label>
                {editMode && currentProfilePicture && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">Current profile picture:</p>
                    <img 
                      src={currentProfilePicture} 
                      alt="Current profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="picture"
                  name="picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: JPG, PNG, GIF. Max size: 5MB
                </p>
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">Selected: {selectedFile.name}</p>
                  </div>
                )}
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-950 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                <h2 className="text-2xl sm:text-1xl font-bold mb-1 ">{editMode ? 'Edit User' : 'Create User'}</h2>
              </button>
            </form>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              cancel?{' '}
              <span
                className="font-semibold text-gray-800 cursor-pointer hover:underline"
                onClick={handleLoginClick}
                tabIndex={0}
                role="button"
              >
                admin panel
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:flex-1 bg-gray-100 flex items-center justify-center order-2 md:order-none">
          <img
            src="/assets/create.png"
            alt="Sign in visual"
            className="object-cover w-full h-48 sm:h-64 md:h-full md:min-h-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Create; 