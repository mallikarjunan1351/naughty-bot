// Array of image categories for variety
const imageCategories = [
  'nature', 'technology', 'people', 'animals', 'food', 
  'architecture', 'travel', 'business', 'sports', 'arts'
];

// Get a random image URL with a specific seed for consistency
export const getRandomImageUrl = (id: string) => {
  // Using Picsum Photos as an alternative to Unsplash
  return `https://picsum.photos/seed/${id}/800/600`;
}; 