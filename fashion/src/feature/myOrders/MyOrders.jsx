import React, { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../../services/api';
import { getImageByIndex } from '../../utils/imageUtils';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageCache, setImageCache] = useState({});

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getUserOrders();
            if (response.success) {
                console.log('Orders data received:', response.data);
                // Debug: Log the first order's items to see the structure
                if (response.data.length > 0 && response.data[0].items.length > 0) {
                    console.log('First item structure:', response.data[0].items[0]);
                    console.log('Item images:', response.data[0].items[0].itemId?.images);
                }
                setOrders(response.data);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Error fetching orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to get cached image URL
    const getCachedImageUrl = useCallback((itemId, colorIndex, images) => {
        const cacheKey = `${itemId}-${colorIndex}`;
        
        console.log(`Getting image for item ${itemId}, colorIndex ${colorIndex}, images:`, images);
        
        if (imageCache[cacheKey]) {
            console.log(`Using cached image for ${cacheKey}`);
            return imageCache[cacheKey];
        }

        if (!images || !Array.isArray(images) || images.length === 0) {
            console.log(`No images found for item ${itemId}`);
            return null;
        }

        const imageUrl = getImageByIndex(images, colorIndex);
        if (imageUrl) {
            console.log(`Created image URL for ${cacheKey}:`, imageUrl);
            setImageCache(prev => ({ ...prev, [cacheKey]: imageUrl }));
            return imageUrl;
        }
        
        console.log(`Failed to create image URL for ${cacheKey}`);
        return null;
    }, [imageCache]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="text-red-600 text-lg mb-4">{error}</div>
                        <button 
                            onClick={fetchUserOrders}
                            className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track your order history and current status</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                        <a 
                            href="/listing" 
                            className="bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition"
                        >
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Placed on {formatDate(order.orderDate)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                ${order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item, index) => {
                                            // Get the first image for this item (assuming color index 0)
                                            console.log(`Processing item ${index}:`, item.itemId);
                                            const itemImage = getCachedImageUrl(item.itemId?._id, 0, item.itemId?.images);
                                            console.log(`Item image result:`, itemImage);
                                            
                                            return (
                                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    {itemImage ? (
                                                        <img 
                                                            src={itemImage} 
                                                            alt={item.itemId?.name || 'Product'} 
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                console.log(`Image failed to load for item ${item.itemId?._id}`);
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    {/* Fallback placeholder */}
                                                    <div 
                                                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
                                                        style={{ display: itemImage ? 'none' : 'flex' }}
                                                    >
                                                        <span className="text-gray-500 text-xs">No image</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.itemId?.name || 'Product Name'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    {item.selectedColor && (
                                                        <p className="text-sm text-gray-500">
                                                            Color: {item.selectedColor}
                                                        </p>
                                                    )}
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center ">
                                            {/* <div className="text-sm text-gray-500">
                                                <p>Shipping Address: {order.shippingAddress}</p>
                                                {order.phoneNumber && (
                                                    <p>Phone: {order.phoneNumber}</p>
                                                )}
                                            </div> */}
                                            <div>
                                                <p className="text-sm text-gray-500">Total Items: {order.items.length}</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    Total: ${order.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 