export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

export const isAdmin = () => {
  const userInfo = getUserInfo();
  return userInfo && userInfo.role === 'admin';
};

export const setUserInfo = (userData) => {
  try {
    localStorage.setItem('userInfo', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user info:', error);
  }
};

export const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
}; 