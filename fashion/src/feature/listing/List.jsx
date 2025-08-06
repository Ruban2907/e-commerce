import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { itemsAPI } from "../../services/api";
import { getImageByIndex, revokeImageUrl } from "../../utils/imageUtils";
import { isAdmin, clearUserInfo } from "../../utils/userUtils";
import { toast } from "react-toastify";

const List = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColorIndexes, setSelectedColorIndexes] = useState({});
  const [imageCache, setImageCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemCounters, setItemCounters] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingItem, setDeletingItem] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editingItem, setEditingItem] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    colors: [],
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [imageToRemove, setImageToRemove] = useState(null);
  const [newColor, setNewColor] = useState('');

  // Memoized function to get cached image URL
  const getCachedImageUrl = useCallback((itemId, colorIndex, images) => {
    const cacheKey = `${itemId}-${colorIndex}`;
    
    if (imageCache[cacheKey]) {
      console.log(`Using cached image URL for ${cacheKey}:`, imageCache[cacheKey]);
      return imageCache[cacheKey];
    }

    // Debug: Check if images array is valid
    if (!images || !Array.isArray(images) || images.length === 0) {
      console.log(`No images found for item ${itemId}, colorIndex ${colorIndex}`);
      return null;
    }

    console.log(`Processing image for ${cacheKey}, images array:`, images);
    const imageUrl = getImageByIndex(images, colorIndex);
    if (imageUrl) {
      console.log(`Created image URL for ${cacheKey}:`, imageUrl);
      setImageCache(prev => ({ ...prev, [cacheKey]: imageUrl }));
      return imageUrl;
    } else {
      console.log(`Failed to get image for item ${itemId}, colorIndex ${colorIndex}, images:`, images);
    }
    
    return null;
  }, [imageCache]);

  // Memoized function to get current image
  const getCurrentImage = useCallback((item, itemIndex) => {
    const selectedIndex = selectedColorIndexes[item._id] || 0;
    
    // Check if item has images and they're properly structured
    if (item.images && item.images.length > 0) {
      console.log(`Getting image for item ${item._id}, selectedIndex: ${selectedIndex}, total images: ${item.images.length}`);
      const imageUrl = getCachedImageUrl(item._id, selectedIndex, item.images);
      
      if (imageUrl) {
        console.log(`Successfully got image URL for item ${item._id}:`, imageUrl);
        return imageUrl;
      } else {
        console.log(`Failed to get image URL for item ${item._id}, selectedIndex: ${selectedIndex}`);
      }
    } else {
      console.log(`No images found for item ${item._id}`);
    }
    
    // No database images available
    return "No image uploaded";
  }, [selectedColorIndexes, getCachedImageUrl]);

  // Memoized function to get current color
  const getCurrentColor = useCallback((item) => {
    const selectedIndex = selectedColorIndexes[item._id] || 0;
    return item.colors[selectedIndex] || "Black";
  }, [selectedColorIndexes]);

  const fetchItems = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      const response = await itemsAPI.getAllItems(page, 6);
      
      if (response.success) {
        // Debug: Check the structure of received data
        console.log('Received items data:', response.data);
        if (response.data.length > 0) {
          console.log('First item structure:', response.data[0]);
          console.log('First item images:', response.data[0].images);
          console.log('First item images length:', response.data[0].images?.length);
          if (response.data[0].images && response.data[0].images.length > 0) {
            console.log('First image structure:', response.data[0].images[0]);
            console.log('First image has data:', !!response.data[0].images[0].data);
            console.log('First image contentType:', response.data[0].images[0].contentType);
          }
        }
        
        if (append) {
          setItems(prev => [...prev, ...response.data]);
        } else {
          setItems(response.data);
        }
        
        setTotalPages(response.totalPages);
        setHasMore(page < response.totalPages);
        
        const initialColors = {};
        const initialCounters = {};
        response.data.forEach(item => {
          initialColors[item._id] = 0;
          initialCounters[item._id] = 0;
        });
        setSelectedColorIndexes(prev => ({ ...prev, ...initialColors }));
        setItemCounters(prev => ({ ...prev, ...initialCounters }));
      } else {
        setError('Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(1, false);
  }, [fetchItems]);

  // Cleanup image URLs on unmount
  useEffect(() => {
    return () => {
      // Only revoke URLs when component is actually unmounting, not on re-renders
      console.log('Component unmounting, revoking image URLs');
      Object.values(imageCache).forEach(url => {
        if (url && url !== "No image uploaded") {
          revokeImageUrl(url);
        }
      });
    };
  }, []); // Empty dependency array - only run on unmount

  // Separate effect for managing image cache
  useEffect(() => {
    // Clean up any invalid URLs from cache
    const validCache = {};
    Object.entries(imageCache).forEach(([key, url]) => {
      if (url && url !== "No image uploaded") {
        validCache[key] = url;
      }
    });
    
    if (Object.keys(validCache).length !== Object.keys(imageCache).length) {
      setImageCache(validCache);
    }
  }, [imageCache]);

  const handleColorSelect = useCallback((itemId, colorIndex) => {
    console.log(`Color selected for item ${itemId}: index ${colorIndex}`);
    setSelectedColorIndexes(prev => {
      const newIndexes = { ...prev, [itemId]: colorIndex };
      console.log('Updated color indexes:', newIndexes);
      return newIndexes;
    });
  }, []);

  const handleCounterChange = useCallback((itemId, change) => {
    setItemCounters(prev => {
      const currentCount = prev[itemId] || 0;
      const newCount = Math.max(0, currentCount + change);
      return { ...prev, [itemId]: newCount };
    });
  }, []);

  const handleAddToCart = useCallback(async (item) => {
    // Check if user is admin and prevent adding to cart
    if (isAdmin()) {
      alert('Admin users cannot add items to cart. Please use a regular user account.');
      return;
    }

    const quantity = itemCounters[item._id] || 0;
    const selectedColor = getCurrentColor(item);
    
    if (quantity <= 0) {
      alert('Please select a quantity greater than 0');
      return;
    }
    
    if (quantity > item.stock) {
      alert('Selected quantity exceeds available stock');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [item._id]: true }));

    try {
      const response = await itemsAPI.addToCart(item._id, quantity, selectedColor);
      
      if (response.success) {
        setItems(prev => prev.map(prevItem => 
          prevItem._id === item._id 
            ? { ...prevItem, stock: prevItem.stock - quantity }
            : prevItem
        ));
        
        setItemCounters(prev => ({ ...prev, [item._id]: 0 }));
        
        alert('Item added to cart successfully!');
      } else {
        alert(response.message || 'Failed to add item to cart');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [item._id]: false }));
    }
  }, [itemCounters, getCurrentColor]);

  const handleEditItem = useCallback((item) => {
    setItemToEdit(item);
    setEditForm({
      name: item.name || '',
      price: item.price || '',
      stock: item.stock || '',
      description: item.description || '',
      colors: item.colors || [],
      images: item.images || []
    });
    setNewImages([]);
    setImageToRemove(null);
    setShowEditModal(true);
  }, []);

  const handleDeleteItem = useCallback(async (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    setDeletingItem(true);
    try {
      const response = await itemsAPI.deleteItem(itemToDelete._id);
      
      if (response.success) {
        setItems(prev => prev.filter(prevItem => prevItem._id !== itemToDelete._id));
        setShowDeleteModal(false);
        setItemToDelete(null);
      } else {
        console.log(response.message || 'Failed to delete item');
      }
    } catch (err) {
      console.log(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setDeletingItem(false);
      toast.success("Item deleted Successfully!");
    }
  }, [itemToDelete]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const handleEditFormChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    setNewImages(prev => [...prev, ...files]);
  }, []);

  const removeNewImage = useCallback((index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const removeCurrentImage = useCallback((index) => {
    setImageToRemove(index);
  }, []);

  const restoreCurrentImage = useCallback((index) => {
    setImageToRemove(null);
  }, []);

  const handleAddColor = useCallback(() => {
    if (newColor.trim() && !editForm.colors.includes(newColor.trim())) {
      setEditForm(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor('');
    }
  }, [newColor, editForm.colors]);

  const handleRemoveColor = useCallback((colorToRemove) => {
    setEditForm(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  }, []);

  const handleUpdateItem = useCallback(async () => {
    if (!itemToEdit) return;

    setEditingItem(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('price', editForm.price);
      formData.append('stock', editForm.stock);
      formData.append('description', editForm.description);
      
      // Add colors
      editForm.colors.forEach(color => {
        formData.append('colors', color);
      });

      // Add new images
      newImages.forEach(image => {
        formData.append('images', image);
      });

      // Add image to remove
      formData.append('imageToRemove', JSON.stringify(imageToRemove));

      const response = await itemsAPI.updateItem(itemToEdit._id, formData);
      
      if (response.success) {
        // Update the item in the local state
        setItems(prev => prev.map(prevItem => 
          prevItem._id === itemToEdit._id 
            ? { ...prevItem, ...response.data }
            : prevItem
        ));
        setShowEditModal(false);
        setItemToEdit(null);
        setEditForm({
          name: '',
          price: '',
          stock: '',
          description: '',
          colors: [],
          images: []
        });
        setNewImages([]);
        setImageToRemove(null);
      } else {
        console.log(response.message || 'Failed to update item');
      }
    } catch (err) {
      console.log(err.response?.data?.message || 'Failed to update item');
    } finally {
      setEditingItem(false);
    }
  }, [itemToEdit, editForm, newImages, imageToRemove]);

  const cancelEdit = useCallback(() => {
    setShowEditModal(false);
    setItemToEdit(null);
    setEditForm({
      name: '',
      price: '',
      stock: '',
      description: '',
      colors: [],
      images: []
    });
    setNewImages([]);
    setImageToRemove(null);
    setNewColor('');
  }, []);

  const loadMoreItems = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchItems(nextPage, true);
    }
  }, [hasMore, loading, currentPage, fetchItems]);

  const renderItem = useCallback((item, itemIndex) => {
    const currentImage = getCurrentImage(item, itemIndex);
    const currentColor = getCurrentColor(item);
    const selectedIndex = selectedColorIndexes[item._id] || 0;
    const counter = itemCounters[item._id] || 0;
    const isAddingToCart = addingToCart[item._id] || false;
    const isItemAvailable = item.stock > 0;
    
    // Debug: Log raw image data for this item
    console.log(`Rendering item ${item._id}:`, {
      name: item.name,
      imagesCount: item.images?.length || 0,
      currentImage: currentImage,
      hasImages: !!item.images,
      rawImages: item.images
    });
    
    return (
      <div
        key={item._id}
        className="flex flex-col w-full overflow-hidden rounded-md shadow group gap-5"
      >
        <div className="relative">
          {currentImage && currentImage !== "No image uploaded" ? (
            <img
              src={currentImage}
              alt={`${item.name} - ${currentColor}`}
              className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                console.log(`Image failed to load for item ${item._id}, color ${currentColor}:`, currentImage);
                // Remove the failed URL from cache
                const cacheKey = `${item._id}-${selectedColorIndexes[item._id] || 0}`;
                setImageCache(prev => {
                  const newCache = { ...prev };
                  delete newCache[cacheKey];
                  return newCache;
                });
                // Show placeholder
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              onLoad={(e) => {
                console.log(`Image loaded successfully for item ${item._id}, color ${currentColor}:`, currentImage);
              }}
            />
          ) : null}
          
          {/* Fallback placeholder - always present but hidden when image is shown */}
          <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center" style={{ display: currentImage && currentImage !== "No image uploaded" ? 'none' : 'flex' }}>
            <span className="text-gray-500">
              {currentImage === "No image uploaded" ? "No image uploaded" : "Loading image..."}
            </span>
          </div>
          
          {/* Admin Contls*/}
          {isAdmin() && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
              <button
                onClick={() => handleEditItem(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg  transition-colors duration-200"
                title="Edit Item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteItem(item)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                title="Delete Item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col w-full">
          <h2 className="text-black text-3xl font-semibold mb-1 drop-shadow-lg px-4">
            {item.name}
          </h2>
          {item.description && (
            <p className="text-gray-600 text-sm px-4 mb-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex flex-col w-full px-4">
          <h2 className="text-black text-lg mb-1 drop-shadow-lg">
            {currentColor}
          </h2>
          <h3 className="text-black text-lg drop-shadow-lg font-semibold">
            ${item.price}
          </h3>
          <p className={`text-sm ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {item.stock} in stock
          </p>
        </div>

        <div className="flex gap-2 items-start justify-start mb-4 px-4">
          {item.colors && item.colors.length > 0 ? (
            item.colors.map((color, index) => {
              // Create a comprehensive color mapping for button styling
              const getColorStyle = (colorName) => {
                const colorMap = {
                  // Basic colors
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
                
                // Try exact match first
                if (colorMap[colorName]) {
                  return colorMap[colorName];
                }
                
                // Try case-insensitive match
                const lowerColorName = colorName.toLowerCase();
                for (const [key, value] of Object.entries(colorMap)) {
                  if (key.toLowerCase() === lowerColorName) {
                    return value;
                  }
                }
                
                // If no match found, return a default color
                console.log(`No color mapping found for: "${colorName}", using default gray`);
                return '#CCCCCC';
              };

              const colorStyle = getColorStyle(color);
              console.log(`Rendering color button for ${item.name}:`, { 
                color, 
                index, 
                colorStyle,
                originalColor: color,
                mappedColor: colorStyle
              });

              return (
                <button
                  key={`${item._id}-${color}-${index}`}
                  onClick={() => handleColorSelect(item._id, index)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedIndex === index 
                      ? 'border-black scale-110 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ 
                    backgroundColor: colorStyle,
                    minWidth: '32px',
                    minHeight: '32px'
                  }}
                  title={`${color} (${colorStyle})`}
                />
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No colors available</p>
          )}
        </div>

        {/* Only show add to cart UI for non-admin users */}
        {!isAdmin() && (
          <div className="px-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleAddToCart(item)}
                disabled={!isItemAvailable || counter <= 0 || isAddingToCart}
                className={`flex-1 py-3 px-6 rounded-md font-semibold transition-colors duration-200 ${
                  isItemAvailable && counter > 0 && !isAddingToCart
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAddingToCart ? 'Adding...' : isItemAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Counter */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleCounterChange(item._id, -1)}
                  disabled={counter <= 0 || !isItemAvailable}
                  className="px-3 py-2 text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                  {counter}
                </span>
                <button
                  onClick={() => handleCounterChange(item._id, 1)}
                  disabled={counter >= item.stock || !isItemAvailable}
                  className="px-3 py-2 text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [getCurrentImage, getCurrentColor, selectedColorIndexes, handleColorSelect, itemCounters, addingToCart, handleCounterChange, handleAddToCart, handleEditItem, handleDeleteItem]);

  const itemsGrid = useMemo(() => {
    return items.map((item, itemIndex) => renderItem(item, itemIndex));
  }, [items, renderItem]);

  if (loading && items.length === 0) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="text-2xl font-semibold">Loading items...</div>
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

  if (items.length === 0) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="text-2xl font-semibold">No items available</div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <h2 className="text-4xl font-bold px-8 mb-4">Men's Clothing & Apparel - New Arrivals</h2>
      {isAdmin() && (
        <div className="flex justify-end px-8 ">
          <button
            onClick={() => navigate('/add-items')}
            className="px-12 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Items
          </button>
        </div>
      )}
      <p className="text-4xl font-bold px-8 mb-4">Featured</p>
      
      

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center gap-4 px-8">
        {itemsGrid}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreItems}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Items'}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Item</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{itemToDelete?.name}"</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deletingItem}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingItem}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deletingItem ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Edit Item</h3>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                />
              </div>

              {/* Price and Stock Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => handleEditFormChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => handleEditFormChange('stock', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item description"
                />
              </div>

              {/* Colors Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colors
                </label>
                
                {/* Current Colors */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Current colors:</p>
                  <div className="flex flex-wrap gap-1">
                    {editForm.colors.map((color, index) => (
                      <div key={color} className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                        <span className="text-xs mr-1">{color}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                          title="Remove color"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {editForm.colors.length === 0 && (
                      <p className="text-xs text-gray-500">No colors selected</p>
                    )}
                  </div>
                </div>

                {/* Add New Color */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Add new color:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddColor();
                        }
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter color name (e.g., Red, Blue, Green)"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      disabled={!newColor.trim() || editForm.colors.includes(newColor.trim())}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {newColor.trim() && editForm.colors.includes(newColor.trim()) && (
                    <p className="text-xs text-red-600 mt-1">This color already exists</p>
                  )}
                </div>

                {/* Available Colors from Original Item */}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Available colors from original item:</p>
                  <div className="flex flex-wrap gap-2">
                    {itemToEdit?.colors.map((color, index) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.colors.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleEditFormChange('colors', [...editForm.colors, color]);
                            } else {
                              handleEditFormChange('colors', editForm.colors.filter(c => c !== color));
                            }
                          }}
                          className="mr-1"
                        />
                        <span className="text-xs">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Images */}
              {itemToEdit?.images && itemToEdit.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Images
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {itemToEdit.images.map((image, index) => {
                      const isMarkedForRemoval = imageToRemove === index;
                      return (
                        <div key={index} className={`relative ${isMarkedForRemoval ? 'opacity-50' : ''}`}>
                          <img
                            src={getImageByIndex([image], 0)}
                            alt={`Current ${index + 1}`}
                            className="w-full h-16 object-cover rounded border"
                          />
                          <span className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {index + 1}
                          </span>
                          {isMarkedForRemoval ? (
                            <button
                              onClick={() => restoreCurrentImage(index)}
                              className="absolute top-0 right-0 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-green-600"
                              title="Keep this image"
                            >
                              ✓
                            </button>
                          ) : (
                            <button
                              onClick={() => removeCurrentImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              title="Remove this image"
                            >
                              ×
                            </button>
                          )}
                          {isMarkedForRemoval && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                              <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                                Remove
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {imageToRemove !== null && (
                    <p className="text-xs text-red-600 mt-1">
                      Image {imageToRemove + 1} marked for removal. Upload a new image below to replace it, or click the checkmark (✓) to keep it.
                    </p>
                  )}
                </div>
              )}

              {/* New Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {imageToRemove !== null ? 'Upload Replacement Image' : 'Add New Images'}
                </label>
                <input
                  type="file"
                  multiple={imageToRemove === null}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">
                      {imageToRemove !== null ? 'Replacement image:' : 'New images to upload:'}
                    </p>
                    <div className="grid grid-cols-4 gap-1">
                      {newImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`New ${index + 1}`}
                            className="w-full h-16 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeNewImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-0 left-0 bg-blue-500 bg-opacity-50 text-white text-xs px-1 rounded">
                            {imageToRemove !== null ? 'New' : `N${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelEdit}
                disabled={editingItem}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                disabled={editingItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingItem ? 'Updating...' : 'Update Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;