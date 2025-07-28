import React from "react";
import LandingSection from "../../feature/landing page/component/Footer";
import Category from "../../feature/landing page/component/Category";
import Cta from "../../feature/landing page/component/Cta";
import TestimonialPage from "../../feature/landing page/component/CtaPage";
import Everlane from "../../feature/landing page/component/Everlane";
import Photopage from "../../feature/landing page/component/Photopage";
import ShopByCategory from "../../feature/landing page/component/ShopByCategory";

const Index = () => (
  <div>
   <LandingSection />
   <ShopByCategory />
   <Cta />
   <Category />
   
   <TestimonialPage />
   <Photopage />
   <Everlane />
   
   
  </div>
);

export default Index