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
import './App.css';

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

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/stories" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/listing" element={<ListingPage />} />
      </Routes>
    </BrowserRouter>
  );
}