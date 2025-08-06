import React from 'react'
import SignInPage from '../../feature/sign-up/signup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Sign = () => (
  <div>
    <ToastContainer/>
    <SignInPage />
  </div>
);


export default Sign
