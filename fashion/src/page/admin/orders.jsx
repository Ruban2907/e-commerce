import React from 'react';
import AdminOrders from '../../feature/admin/AdminOrders';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminOrdersPage = () => (
  <div>
    <ToastContainer/>
    <AdminOrders />
  </div>
);

export default AdminOrdersPage; 