import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddItems = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    colors: '',
    stock: '',
    description: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('description', formData.description);

      const colorsArray = formData.colors.split(',').map(color => color.trim()).filter(color => color);
      formDataToSend.append('colors', JSON.stringify(colorsArray));
      
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await itemsAPI.createItem(formDataToSend);

      if (response.success) {
        navigate('/listing');
        toast.success('Item Added Successfully!');
      }
    } catch (error) {
      toast.error('Error adding item:', error);
      setError(error.response?.data?.message || error.message || 'Error adding item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-5xl font-bold text-center mb-2">Add Item</h1>
          <h2 className="text-2xl text-center mb-8 text-gray-600">Add New Product to Inventory</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter item name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Colors *</label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleInputChange}
                required
                placeholder="Red, Blue, Green"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="Enter stock quantity"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Images *</label>
              <input
                type="file"
                name="images"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Adding Item...' : 'Add Item'}
            </button>
          </form>
        </div>
      </div>
        <div className="w-full md:w-1/2 flex items-center justify-center py-4 md:p-8 bg-gray-50">
          <div className="w-full max-w-lg">
            <img
              src="public/assets/additems.png"
              alt="Add items illustration"
              className="w-full h-auto object-contain object-center rounded-xl shadow-xl"
            />
          </div>
        </div>
    </div>
  );
};

export default AddItems; 