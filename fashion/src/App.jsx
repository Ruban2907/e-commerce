import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    <ToastContainer/  >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/stories" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/listing" element={<ListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/add-items" element={<AddItemsPageWithLayout />} />
        <Route path="/cart" element={<CartPageWithLayout />} />
        <Route path="/my-orders" element={<MyOrdersPageWithLayout />} />
        <Route path="/admin/orders" element={<AdminOrdersPageWithLayout />} />
      </Routes>
    </BrowserRouter>
  );
}