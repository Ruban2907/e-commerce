import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sign from './page/sign-up/index.jsx';
import Login from './page/login/index.jsx';
import Index from './page/home';
import About from './page/about';
import Blog from './page/blog';
import Header from './shared/components/Header';
import Final from './shared/components/Final';
import Contact from './page/contact/index.jsx';
import Lust from './page/listing/index.jsx';
import Profilepage from './page/profile/Profile.jsx';
import Admin from './page/admin/index.jsx';
import Createuser from './page/createUser/Createuser.jsx';
import AddItemsPage from './page/addItems/index.jsx';
import CartPage from './page/cart/index.jsx';
import AdminOrdersPage from './page/admin/orders.jsx';
import MyOrdersPage from './page/myOrders/index.jsx';
import ForgotPassword from './page/forgotPassword/index.jsx';
import Error from './page/Error/index.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserInfo } from './utils/userUtils';
import React from 'react';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const withLayout = (Component) => {
  return function WrappedComponent() {
    return (
      <>
        <Header />
        <Component />
        <Final />
      </>
    );
  };
};

const HomePage = withLayout(Index);
const AboutPage = withLayout(About);
const BlogPage = withLayout(Blog);
const ContactPage = withLayout(Contact);
const ListingPage = withLayout(Lust);
const ProfilePage = withLayout(Profilepage);
const AdminPage = withLayout(Admin);
const CreateUser  = withLayout(Createuser);
const AddItemsPageWithLayout = withLayout(AddItemsPage);
const CartPageWithLayout = withLayout(CartPage);
const AdminOrdersPageWithLayout = withLayout(AdminOrdersPage);
const MyOrdersPageWithLayout = withLayout(MyOrdersPage);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
        <Route path="/stories" element={<PrivateRoute><BlogPage /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
        <Route path="/listing" element={<PrivateRoute><ListingPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/create-user" element={<PrivateRoute><CreateUser /></PrivateRoute>} />
        <Route path="/add-items" element={<PrivateRoute><AddItemsPageWithLayout /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPageWithLayout /></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute><MyOrdersPageWithLayout /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute><AdminOrdersPageWithLayout /></PrivateRoute>} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}