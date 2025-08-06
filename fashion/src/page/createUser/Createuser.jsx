import React from "react";
import Create from "../../feature/createUser/Createuser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Createuser = () => (
  <div>
    <ToastContainer/>
   <Create />
  </div>
);

export default Createuser