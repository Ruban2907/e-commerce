import React, { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState({
    firstname: "Your first name",
    lastname: "Your last name",
    name: "Your name",
    email: "yourname@gmail.com",
    password: "your password",
    gender: "",
    contact: "",
    address: "",
    role: "user"
  });
  const [originalUserData, setOriginalUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [originalProfilePicture, setOriginalProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:8002/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        return res.json();
      })
             .then(data => {
         if (data.user) {
           setUserData(data.user);
           setOriginalUserData(data.user);
           if (data.user.picture) {
             const pictureUrl = `http://localhost:8002/profile-picture?token=${encodeURIComponent(token)}`;
             setProfilePicture(pictureUrl);
             setOriginalProfilePicture(pictureUrl);
           }
         }
         setLoading(false);
       })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
        if (err.message === 'Failed to fetch profile') {
          localStorage.removeItem('token');
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    // Store current data as original when entering edit mode
    setOriginalUserData({...userData});
    setOriginalProfilePicture(profilePicture);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
      setProfilePicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('firstname', userData.firstname);
    formData.append('lastname', userData.lastname);
    formData.append('email', userData.email);
    formData.append('gender', userData.gender);
    formData.append('contact', userData.contact);
    formData.append('address', userData.address);
    if (userData.password) formData.append('password', userData.password);
    if (newProfilePicture) formData.append('picture', newProfilePicture);

    try {
      const res = await fetch('http://localhost:8002/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await res.json();
      setUserData(data.user);
      setOriginalUserData(data.user);
      setEditMode(false);
      setNewProfilePicture(null);
      if (newProfilePicture) {
        const newPictureUrl = `http://localhost:8002/profile-picture?token=${encodeURIComponent(token)}&t=${Date.now()}`;
        setProfilePicture(newPictureUrl);
        setOriginalProfilePicture(newPictureUrl);
      }
      
      alert(data.message || 'Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      alert(err.message || 'Error updating profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (originalUserData) {
      setUserData({...originalUserData});
    }
    if (originalProfilePicture) {
      setProfilePicture(originalProfilePicture);
    }
    setNewProfilePicture(null);
    setEditMode(false);
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//         <div className="text-lg">Loading profile...</div>
//       </div>
//     );
//   }

     return (
     <div className="min-h-screen flex items-center justify-center py-10 md:py-20 bg-gray-50 px-4">
       <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
                 <div className="w-full lg:max-w-md bg-white rounded-xl shadow-lg py-12 md:py-20 px-6 md:px-8 relative border-2 border-black">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={profilePicture || "/assets/avatar.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = "/assets/profile.png";
                }}
              />
              {editMode && (
                <input type="file" accept="image/*" onChange={handlePictureChange} className="mt-2" />
              )}
            </div>
                         <div className="mt-3 text-center">
               {editMode ? (
                 <>
                   <input
                     name="firstname"
                     value={userData.firstname}
                     onChange={handleInputChange}
                     className="border rounded px-2 py-1 mb-2 w-full"
                     placeholder="First Name"
                   />
                   <input
                     name="lastname"
                     value={userData.lastname}
                     onChange={handleInputChange}
                     className="border rounded px-2 py-1 mb-2 w-full"
                     placeholder="Last Name"
                   />
                   <input
                     name="email"
                     value={userData.email}
                     onChange={handleInputChange}
                     className="border rounded px-2 py-1 mb-2 w-full"
                     placeholder="Email"
                   />
                   <select
                     name="gender"
                     value={userData.gender}
                     onChange={handleInputChange}
                     className="border rounded px-2 py-1 mb-2 w-full"
                   >
                     <option value="">Select Gender</option>
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                     <option value="other">Other</option>
                   </select>
                   <input
                     name="contact"
                     value={userData.contact}
                     onChange={handleInputChange}
                     className="border rounded px-2 py-1 mb-2 w-full"
                     placeholder="Contact Number"
                   />
                   <textarea
                     name="address"
                     value={userData.address}
                     onChange={handleInputChange}
                     className="border rounded px-2 py-1 mb-2 w-full"
                     placeholder="Address"
                     rows="3"
                   />
                   {/* <input
                     name="Role"
                     value={userData.role}
                     onChange={handleInputChange}
                     className="border rounded px-2 py-1 mb-2 w-full"
                     placeholder="New password (optional)"
                   /> */}
                 </>
               ) : (
                 <>
                   <div className="font-semibold text-lg">{userData.name}</div>
                   <div className="text-gray-400 text-sm">{userData.email}</div>
                 </>
               )}
             </div>
          </div>
                     <div className="space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-400 text-sm">First Name</span>
               <span className="text-gray-700 text-sm">{userData.firstname}</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-400 text-sm">Last Name</span>
               <span className="text-gray-700 text-sm">{userData.lastname}</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-400 text-sm">Email</span>
               <span className="text-gray-700 text-sm">{userData.email}</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-400 text-sm">Gender</span>
               <span className="text-gray-700 text-sm capitalize">{userData.gender || 'Not specified'}</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-400 text-sm">Contact</span>
               <span className="text-gray-700 text-sm">{userData.contact || 'Not specified'}</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-400 text-sm">Address</span>
               <span className="text-gray-700 text-sm">{userData.address || 'Not specified'}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-400 text-sm">Role</span>
               <span className="text-gray-700 text-sm capitalize">{userData.role}</span>
             </div>
           </div>
                     {editMode ? (
             <div className="flex gap-3 mt-6">
               <button
                 onClick={handleSave}
                 className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
               >
                 Save
               </button>
               <button
                 onClick={handleCancel}
                 className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded transition"
               >
                 Cancel
               </button>
             </div>
           ) : (
             <button
               onClick={handleEdit}
               className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
             >
               Edit
             </button>
           )}
        </div>
                 <div className="flex-1 flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
           <div className="bg-gray-200 rounded-xl w-full h-full max-w-2xl aspect-[4/3] md:aspect-[3/2] lg:aspect-[2/1] flex items-center justify-center border-2 overflow-hidden relative">
             <img 
               src="/assets/profile.png" 
               alt="Profile Image" 
               className="w-full h-full object-cover rounded-xl"
             />
             <div className="absolute top-2 left-2 md:top-4 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               E
             </div>
             <div className="absolute top-6 left-2 md:top-12 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               V
             </div>
             <div className="absolute top-10 left-2 md:top-20 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               E
             </div>
             <div className="absolute top-14 left-2 md:top-28 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               R
             </div>
             <div className="absolute top-18 left-2 md:top-36 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               L
             </div>
             <div className="absolute top-22 left-2 md:top-44 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               A
             </div>
             <div className="absolute top-26 left-2 md:top-52 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               N
             </div>
             <div className="absolute top-30 left-2 md:top-60 md:left-4 text-black text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg">
               E
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
