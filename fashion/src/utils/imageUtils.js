export const convertImageBufferToUrl = (imageBuffer) => {
  console.log("Converting image buffer:", imageBuffer); 
  
  if (!imageBuffer || !imageBuffer.data) {
    console.log("No image buffer or data found"); 
    return null;
  }
  
  try {
    const blob = new Blob([imageBuffer.data], { type: imageBuffer.contentType });
    const url = URL.createObjectURL(blob);
    console.log("Created blob URL:", url);
    return url;
  } catch (error) {
    console.error("Error creating blob URL:", error); 
    return null;
  }
};

export const getImageByIndex = (images, index) => {
  console.log(`Getting image at index ${index} from images:`, images);
  
  if (!images || images.length === 0 || index < 0 || index >= images.length) {
    console.log("Invalid images array or index"); 
    return null;
  }
  
  const imageBuffer = images[index];
  console.log(`Image buffer at index ${index}:`, imageBuffer);
  
  return convertImageBufferToUrl(imageBuffer);
};

export const revokeImageUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}; 