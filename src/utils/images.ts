// Map of image names to their imported paths
const imageMap: { [key: string]: string } = {
  'keyboard1.jpg': '/images/keyboard1.jpg',
  'keyboard2.jpg': '/images/keyboard2.jpg',
  'mouse1.jpg': '/images/mouse1.jpg',
  'book1.jpg': '/images/book1.jpg',
};

export const getImageUrl = (imageName: string): string => {
  // First try to get from our map
  if (imageMap[imageName]) {
    return imageMap[imageName];
  }
  
  // Fallback to public/images directory
  return `/images/${imageName}`;
};

// Function to check if image exists (useful for error handling)
export const checkImageExists = async (imageName: string): Promise<boolean> => {
  try {
    const response = await fetch(getImageUrl(imageName), {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
};