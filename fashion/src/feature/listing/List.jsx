import React, { useState, useEffect } from "react";
import { itemsAPI } from "../../services/api";
import { getImageByIndex, revokeImageUrl } from "../../utils/imageUtils";

const List = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColorIndexes, setSelectedColorIndexes] = useState({}); 

  const colorNames = ["Black", "Blue", "Green"];

  const fallbackImages = {
    0: [
      "/assets/01.png",
      "/assets/02.png", 
      "/assets/03.png",
      "/assets/04.png",
      "/assets/05.png",
      "/assets/06.png",
      "/assets/07.png",
      "/assets/08.png",
      "/assets/09.png"
    ],
    1: [ 
      "/assets/01-blue.jpg",
      "/assets/02-lue.jpg",
      "/assets/03-blue.jpg",
      "/assets/04-blue.jpg",
      "/assets/05-blue.jpg",
      "/assets/06-blue.jpg",
      "/assets/07-blue.jpg",
      "/assets/08-blue.jpg",
      "/assets/09-blue.jpg"
    ],
    2: [ 
      "/assets/01-green.jpg", 
      "/assets/02-green.jpg",
      "/assets/03-green.jpg",
      "/assets/04-gree.jpg",
      "/assets/05-green.jpg",
      "/assets/06-green.jpg",
      "/assets/07-green.jpg",
      "/assets/08-gree.jpg",
      "/assets/09-green.jpg"
    ]
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await itemsAPI.getAllItems();
        
        console.log("Backend response:", response); 
        
        if (response.success) {
          console.log("Items received:", response.data); 
          
          response.data.forEach((item, index) => {
            console.log(`Item ${item.name}:`, {
              hasImages: !!item.images,
              imageCount: item.images?.length || 0,
              firstImage: item.images?.[0],
              itemData: item
            });
          });
          
          setItems(response.data);
          const initialColors = {};
          response.data.forEach(item => {
            initialColors[item._id] = 0; 
            console.log(`Item ${item.name} has ${item.images?.length || 0} images`); 
          });
          setSelectedColorIndexes(initialColors);
        } else {
          setError('Failed to fetch items');
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.response?.data?.message || 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    return () => {
      items.forEach(item => {
        if (item.images) {
          item.images.forEach(image => {
            const url = getImageByIndex([image], 0);
            if (url) revokeImageUrl(url);
          });
        }
      });
    };
  }, [items]);

  const handleColorSelect = (itemId, colorIndex) => {
    console.log(`Color selected for item ${itemId}: ${colorNames[colorIndex]} (index ${colorIndex})`);
    setSelectedColorIndexes(prev => ({
      ...prev,
      [itemId]: colorIndex
    }));
  };

  const getCurrentImage = (item, itemIndex) => {
    const selectedIndex = selectedColorIndexes[item._id] || 0;
    console.log(`Getting image for ${item.name} at index ${selectedIndex}`); 
    console.log(`Item images:`, item.images); 
    
    const imageUrl = getImageByIndex(item.images, selectedIndex);
    console.log(`Generated image URL:`, imageUrl);   
    
    if (!imageUrl) {
      console.log(`Using fallback image for ${item.name} - color: ${colorNames[selectedIndex]}`);
      const fallbackArray = fallbackImages[selectedIndex] || fallbackImages[0];
      return fallbackArray[itemIndex % fallbackArray.length];
    }
    
    return imageUrl;
  };

  const getCurrentColor = (item) => {
    const selectedIndex = selectedColorIndexes[item._id] || 0;
    return colorNames[selectedIndex] || "Black";
  };

  if (loading) {
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
      <p className="text-4xl font-bold px-8 mb-4">Featured</p>
      
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center gap-4 px-8">
        {items.map((item, itemIndex) => {
          const currentImage = getCurrentImage(item, itemIndex);
          const currentColor = getCurrentColor(item);
          const selectedIndex = selectedColorIndexes[item._id] || 0;
          
          return (
            <div
              key={item._id}
              className="flex flex-col w-full overflow-hidden rounded-md shadow group gap-5"
            >
              <div className="relative">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${item.name} - ${currentColor}`}
                    className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error(`Failed to load image for ${item.name}:`, e);
                      console.log("Image src that failed:", currentImage);
                      const fallbackArray = fallbackImages[selectedIndex] || fallbackImages[0];
                      e.target.src = fallbackArray[itemIndex % fallbackArray.length];
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded image for ${item.name} (${currentColor}):`, currentImage);
                    }}
                  />
                ) : (
                  <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
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
                {item.stock > 0 && (
                  <p className="text-green-600 text-sm">
                    {item.stock} in stock
                  </p>
                )}
              </div>

              <div className="flex gap-2 items-start justify-start mb-4 px-4">
                <button
                  onClick={() => handleColorSelect(item._id, 0)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedIndex === 0 
                      ? 'border-black scale-110 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: '#000000' }}
                  title="Black"
                />
                
                <button
                  onClick={() => handleColorSelect(item._id, 1)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedIndex === 1 
                      ? 'border-black scale-110 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: '#0000FF' }}
                  title="Blue"
                />
                
                <button
                  onClick={() => handleColorSelect(item._id, 2)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedIndex === 2 
                      ? 'border-black scale-110 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: '#008000' }}
                  title="Green"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;