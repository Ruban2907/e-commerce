export const convertImageBufferToUrl = (imageBuffer) => {
  console.log('convertImageBufferToUrl called with:', imageBuffer);
  
  if (!imageBuffer) {
    console.log('No imageBuffer provided');
    return null;
  }
  
  // Handle different possible formats of image data
  let imageData = null;
  let contentType = null;
  
  if (imageBuffer.data) {
    // Check if data is base64 string (from backend) or Buffer
    if (typeof imageBuffer.data === 'string') {
      // Base64 string from backend
      imageData = imageBuffer.data;
      contentType = imageBuffer.contentType;
      console.log('Processing base64 image data, length:', imageData.length);
      
      try {
        // Convert base64 to blob
        const byteCharacters = atob(imageData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const url = URL.createObjectURL(blob);
        console.log('Created image URL from base64:', url);
        return url;
      } catch (error) {
        console.error('Error converting base64 to URL:', error);
        return null;
      }
    } else {
      // Standard format: { data: Buffer, contentType: string }
      imageData = imageBuffer.data;
      contentType = imageBuffer.contentType;
    }
  } else if (imageBuffer.buffer) {
    // Alternative format: { buffer: Buffer, mimetype: string }
    imageData = imageBuffer.buffer;
    contentType = imageBuffer.mimetype;
  } else if (imageBuffer instanceof ArrayBuffer) {
    // Direct ArrayBuffer
    imageData = imageBuffer;
    contentType = 'image/jpeg'; // Default
  } else {
    console.log('Unknown imageBuffer format:', imageBuffer);
    return null;
  }
  
  if (!imageData) {
    console.log('No image data found in imageBuffer');
    return null;
  }
  
  try {
    console.log('Creating blob with data length:', imageData.length, 'contentType:', contentType);
    const blob = new Blob([imageData], { type: contentType });
    const url = URL.createObjectURL(blob);
    console.log('Created image URL:', url, 'for content type:', contentType);
    return url;
  } catch (error) {
    console.error('Error converting image buffer to URL:', error);
    return null;
  }
};

export const getImageByIndex = (images, index) => {
  console.log('getImageByIndex called with:', { images, index });
  
  if (!images || images.length === 0 || index < 0 || index >= images.length) {
    console.log('Invalid images array or index:', { images, index });
    return null;
  }
  
  const imageBuffer = images[index];
  console.log('Processing image at index:', index, 'imageBuffer:', imageBuffer);
  return convertImageBufferToUrl(imageBuffer);
};

export const revokeImageUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}; 