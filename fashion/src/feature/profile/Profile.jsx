import React, { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "Your name",
    email: "yourname@gmail.com",
    password: "your password",
    role: "user"
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

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
          if (data.user.picture) {
            setProfilePicture(`http://localhost:8002/profile-picture?token=${encodeURIComponent(token)}`);
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

  const handleSave = async () => {
    
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//         <div className="text-lg">Loading profile...</div>
//       </div>
//     );
//   }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-6xl w-full flex gap-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg py-20 px-8 relative border-2 border-black">
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
            </div>
            <div className="mt-3 text-center">
              <div className="font-semibold text-lg">{userData.name}</div>
              <div className="text-gray-400 text-sm">{userData.email}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-400 text-sm">Name</span>
              <span className="text-gray-700 text-sm">{userData.name}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-400 text-sm">Email account</span>
              <span className="text-gray-700 text-sm">{userData.email}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-400 text-sm">password</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Role</span>
              <span className="text-gray-700 text-sm capitalize">{userData.role}</span>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
          >
            Edit
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-gray-200 rounded-xl w-full h-full flex items-center justify-center border-2 overflow-hidden relative">
            <img 
              src="/assets/profile.png" 
              alt="Profile Image" 
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-4 left-4 text-black text-2xl font-bold drop-shadow-lg">
              E
            </div>
            <div className="absolute top-12 left-4 text-black text-2xl font-bold drop-shadow-lg">
              V
            </div>
            <div className="absolute top-20 left-4 text-black text-2xl font-bold drop-shadow-lg">
              E
            </div>
            <div className="absolute top-28 left-4 text-black text-2xl font-bold drop-shadow-lg">
              R
            </div>
            <div className="absolute top-36 left-4 text-black text-2xl font-bold drop-shadow-lg">
              L
            </div>
            <div className="absolute top-44 left-4 text-black text-2xl font-bold drop-shadow-lg">
              A
            </div>
            <div className="absolute top-52 left-4 text-black text-2xl font-bold drop-shadow-lg">
              N
            </div>
            <div className="absolute top-60 left-4 text-black text-2xl font-bold drop-shadow-lg">
              E
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
