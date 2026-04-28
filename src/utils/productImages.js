/**
 * This utility maps product names to their specific images.
 * It automatically imports all images from the src/assets/products/ directory.
 * If you want to add an image for a product, save it in src/assets/products/ 
 * with the name matching the product (e.g. 'tomato.jpg' or 'sweet-potato.png').
 */

// import.meta.glob is a Vite feature to dynamically import multiple files at build time
const images = import.meta.glob('../assets/products/*.{jpg,jpeg,png,webp,svg}', { eager: true, import: 'default' });

/**
 * Get the specific image for a given product name.
 * @param {string} productName - The exact name of the product (e.g. 'Tomato')
 * @returns {string} The path to the image, or a fallback default image
 */
export function getProductImage(productName) {
  if (!productName) return '/placeholder-product.svg';

  // Convert "Cherry Tomato" to "cherry-tomato"
  const cleanName = productName.toLowerCase().replace(/\s+/g, '-');
  
  // Search through all imported image paths to find a match
  for (const path in images) {
    // path looks like '../assets/products/tomato.svg'
    const filename = path.split('/').pop();
    const nameWithoutExt = filename.split('.')[0];
    
    if (nameWithoutExt === cleanName) {
      return images[path];
    }
  }

  // Fallback to default product image if specific one is not found
  for (const path in images) {
    if (path.includes('default.')) {
      return images[path];
    }
  }
  
  return '/placeholder-product.svg';
}
