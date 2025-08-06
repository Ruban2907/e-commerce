import React from "react";
import Form from "../../feature/contact/Form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Contact = () => (
  <div>
    <ToastContainer/>
   <Form />
  </div>
);

export default Contact