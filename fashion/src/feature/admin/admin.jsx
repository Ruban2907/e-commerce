import React, { useState, useEffect } from 'react';
import { isAdmin } from '../../utils/userUtils';
import { useNavigate, Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingUsers, setDeletingUsers] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [profilePictures, setProfilePictures] = useState({});

  //extra condition not necessary
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await usersAPI.getAllUsers();
        console.log('Users fetched:', response);
        if (response.users) {
          response.users.forEach((user, index) => {
            console.log(`User ${index + 1} (${user.firstname} ${user.lastname}):`, {
              hasPicture: !!user.picture,
              pictureData: user.picture,
              pictureDataType: typeof user.picture,
              pictureDataKeys: user.picture ? Object.keys(user.picture) : null
            });
          });
          setUsers(response.users);
          
          const token = localStorage.getItem('token');
          const pictureUrls = {};
          
          response.users.forEach(user => {
            if (user.picture && user.picture.data) {
              pictureUrls[user._id] = `http://localhost:8002/profile-picture?token=${encodeURIComponent(token)}&userId=${user._id}`;
            }
          });  
          setProfilePictures(pictureUrls);
        } else {
          console.error('No users data in response:', response);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const handleEditUser = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      navigate('/create-user', { 
        state: { 
          editMode: true, 
          userData: user 
        } 
      });
    }
  };
  const handleDeleteUser = (userId) => {
    const user = users.find(u => u._id === userId);
    
    const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    setError(null);
    setSuccess(null);
    
    if (user.role === 'admin') {
      return;
    }
    // if (user._id === currentUserInfo._id) {
    //   setError('Cannot delete your own account.');
    //   return;
    // }
    
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      setDeletingUsers(prev => new Set(prev).add(userToDelete._id));
      const response = await usersAPI.deleteUser(userToDelete._id);
      toast.success("User Deleted Successfully!")
      const updatedResponse = await usersAPI.getAllUsers();
      if (updatedResponse.users) {
        setUsers(updatedResponse.users);
      }
      
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Error deleting user!")
    } finally {
      setDeletingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userToDelete._id);
        return newSet;
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };
  const handleCreateUser = () => {
    navigate('/create-user');
  };

  // const clearError = () => {
  //   setError(null);
  // };

  // const clearSuccess = () => {
  //   setSuccess(null);
  // };
  if (!isAdmin()) {
    return null;
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl font-semibold text-gray-600">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <div className="flex gap-4">
              <Link
                to="/admin/orders"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Orders
              </Link>
              <button
                onClick={handleCreateUser}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
              <div className="flex items-center mb-4">
                                 <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                   {profilePictures[user._id] ? (
                     <img
                       src={profilePictures[user._id]}
                       alt={`${user.firstname} ${user.lastname}`}
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         console.log('Image failed to load for user:', user.firstname, user.lastname);
                         e.target.style.display = 'none';
                         e.target.nextSibling.style.display = 'flex';
                       }}
                       onLoad={() => {
                         console.log('Image loaded successfully for user:', user.firstname, user.lastname);
                       }}
                     />
                   ) : null}
                   <span 
                     className="text-gray-600 font-semibold text-lg" 
                     style={{ 
                       display: profilePictures[user._id] ? 'none' : 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }}
                   >
                     {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                   </span>
                 </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.firstname} {user.lastname}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin'     
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  {user.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {user.contact || 'No contact'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{user.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user.gender || 'Not specified'}
                </div>
              </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEditUser(user._id)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                   onClick={() => handleDeleteUser(user._id)}
                   disabled={deletingUsers.has(user._id) || user.role === 'admin' || user._id === JSON.parse(localStorage.getItem('userInfo') || '{}')._id}
                   className={`flex-1 px-3 py-2 rounded-md transition duration-200 text-sm font-medium ${
                     deletingUsers.has(user._id) || user.role === 'admin' || user._id === JSON.parse(localStorage.getItem('userInfo') || '{}')._id
                       ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                       : 'bg-red-600 text-white hover:bg-red-700'
                   }`}
                   title={
                     user.role === 'admin' 
                       ? 'Cannot delete admin users' 
                       : user._id === JSON.parse(localStorage.getItem('userInfo') || '{}')._id
                       ? 'Cannot delete your own account'
                       : 'Delete user'
                   }
                 >
                   {deletingUsers.has(user._id) ? 'Deleting...' : 'Delete'}
                 </button>
              </div>
            </div>
          ))}
        </div>
        {users.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
          </div>
        )}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete <span className="font-semibold">{userToDelete.firstname} {userToDelete.lastname}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This will permanently remove the user from the system.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  disabled={deletingUsers.has(userToDelete._id)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingUsers.has(userToDelete._id)}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                    deletingUsers.has(userToDelete._id)
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {deletingUsers.has(userToDelete._id) ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 