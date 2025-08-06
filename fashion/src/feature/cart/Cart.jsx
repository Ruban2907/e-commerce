import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../../services/api';
import { getImageByIndex, revokeImageUrl } from '../../utils/imageUtils';
import { isAdmin } from '../../utils/userUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);
  const [imageCache, setImageCache] = useState({});

  // Memoized function to get cached image URL
  const getCachedImageUrl = useCallback((itemId, images) => {
    const cacheKey = `${itemId}`;
    
    if (imageCache[cacheKey]) {
      return imageCache[cacheKey];
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return null;
    }

    const imageUrl = getImageByIndex(images, 0); // Use first image for cart display
    if (imageUrl) {
      setImageCache(prev => ({ ...prev, [cacheKey]: imageUrl }));
      return imageUrl;
    }
    
    return null;
  }, [imageCache]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      
      if (response.success) {
        setCart(response.data);
      } else {
        setError('Failed to fetch cart');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is admin and redirect if so
    if (isAdmin()) {
      navigate('/admin/orders');
      return;
    }
    
    fetchCart();
  }, [fetchCart, navigate]);

  // Cleanup image URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imageCache).forEach(url => {
        if (url && url !== "No image uploaded") {
          revokeImageUrl(url);
        }
      });
    };
  }, []);

  const handleQuantityChange = useCallback(async (cartItemId, newQuantity) => {
    setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));

    try {
      const response = await cartAPI.updateCartItem(cartItemId, newQuantity);
      
      if (response.success) {
        // Refresh cart data
        await fetchCart();
      } else {
        alert(response.message || 'Failed to update quantity');
      }
    } catch (err) {
      toast.error("Failed to update quantity!")
      alert(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      toast.success("Item updated successfully!");
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
    }
  }, [fetchCart]);

  const handleRemoveItem = useCallback(async (cartItemId) => {
    setRemovingItems(prev => ({ ...prev, [cartItemId]: true }));

    try {
      const response = await cartAPI.removeFromCart(cartItemId);
      
      if (response.success) {
        // Refresh cart data
        await fetchCart();
      } else {
        alert(response.message || 'Failed to remove item');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setRemovingItems(prev => ({ ...prev, [cartItemId]: false }));
    }
  }, [fetchCart]);

  const handleConfirmOrder = useCallback(async () => {
    if (!cart || cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setConfirmingOrder(true);

    try {
      const response = await cartAPI.confirmOrder();
      
      if (response.success) {
        alert(`Order confirmed successfully! Order ID: ${response.data.orderId}`);
        setCart(null);
        navigate('/listing');
      } else {
        alert(response.message || 'Failed to confirm order');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm order');
    } finally {
      setConfirmingOrder(false);
    }
  }, [cart, navigate]);

  const handleClearCart = useCallback(async () => {
    if (!cart || cart.items.length === 0) {
      alert('Cart is already empty');
      return;
    }

    const confirmClear = window.confirm('Are you sure you want to clear your cart? This action cannot be undone.');
    if (!confirmClear) return;

    setClearingCart(true);

    try {
      const response = await cartAPI.clearCart();
      
      if (response.success) {
        alert('Cart cleared successfully');
        setCart(null);
      } else {
        alert(response.message || 'Failed to clear cart');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear cart');
    } finally {
      setClearingCart(false);
    }
  }, [cart]);

  const renderCartItem = useCallback((item) => {
    const currentImage = getCachedImageUrl(item._id, item.images);
    const isUpdating = updatingItems[item.cartItemId] || false;
    const isRemoving = removingItems[item.cartItemId] || false;

    return (
      <div
        key={item.cartItemId}
        className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
      >
        {/* Image Section */}
        <div className="w-full md:w-48 h-48 md:h-auto relative">
          {currentImage && currentImage !== "No image uploaded" ? (
            <img
              src={currentImage}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback placeholder */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: currentImage && currentImage !== "No image uploaded" ? 'none' : 'flex' }}>
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
            
            {item.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Color:</span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: getColorStyle(item.selectedColor)
                    }}
                    title={item.selectedColor}
                  />
                  <span className="text-sm font-medium">{item.selectedColor}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="text-lg font-semibold text-gray-900">${item.price}</span>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(item.cartItemId, Math.max(0, item.quantity - 1))}
                  disabled={isUpdating || isRemoving}
                  className="px-3 py-2 text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                  {isUpdating ? '...' : item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                  disabled={isUpdating || isRemoving}
                  className="px-3 py-2 text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <span className="text-sm text-gray-600">Total:</span>
                <div className="text-lg font-bold text-gray-900">${item.totalPrice}</div>
              </div>
            </div>

            <button
              onClick={() => handleRemoveItem(item.cartItemId)}
              disabled={isUpdating || isRemoving}
              className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              title="Remove item"
            >
              {isRemoving ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }, [getCachedImageUrl, updatingItems, removingItems, handleQuantityChange, handleRemoveItem]);

  // Helper function to get color style
  const getColorStyle = (colorName) => {
    const colorMap = {
      'Black': '#000000',
      'Blue': '#0000FF', 
      'Green': '#008000',
      'Red': '#FF0000',
      'White': '#FFFFFF',
      'Yellow': '#FFFF00',
      'Purple': '#800080',
      'Orange': '#FFA500',
      'Pink': '#FFC0CB',
      'Brown': '#A52A2A',
      'Gray': '#808080',
      'Grey': '#808080',
    };
    
    if (colorMap[colorName]) {
      return colorMap[colorName];
    }
    
    const lowerColorName = colorName.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (key.toLowerCase() === lowerColorName) {
        return value;
      }
    }
    
    return '#CCCCCC';
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="text-2xl font-semibold">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="text-2xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-8">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => navigate('/listing')}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={handleClearCart}
              disabled={clearingCart}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {clearingCart ? 'Clearing...' : 'Clear Cart'}
            </button>
            
            <button
              onClick={() => navigate('/listing')}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="grid gap-6 mb-8">
          {cart.items.map(renderCartItem)}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Subtotal ({cart.itemCount} items):</span>
              <span className="font-semibold">${cart.totalAmount}</span>
            </div>
            
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${cart.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Confirm Order Button */}
          <button
            onClick={handleConfirmOrder}
            disabled={confirmingOrder || cart.items.length === 0}
            className="w-full bg-black text-white py-4 rounded-md font-semibold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {confirmingOrder ? 'Confirming Order...' : 'Confirm Order'}
          </button>
          
          <p className="text-sm text-gray-500 text-center mt-4">
            By clicking "Confirm Order", you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart; 