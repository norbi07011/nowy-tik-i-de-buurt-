import { BusinessPost } from "@/types/business"

const businessImages = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop", 
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=800&fit=crop"
]

const avatars = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
]

const businesses = [
  { name: "Café Amsterdam", category: "Restaurant", verified: true },
  { name: "Utrecht Bakery", category: "Bakery", verified: false },
  { name: "Rotterdam Flowers", category: "Florist", verified: true },
  { name: "Den Haag Style", category: "Fashion", verified: false },
  { name: "Eindhoven Tech", category: "Electronics", verified: true },
  { name: "Groningen Bikes", category: "Sports", verified: false },
  { name: "Maastricht Books", category: "Bookstore", verified: true },
  { name: "Leiden Gardens", category: "Garden Center", verified: false },
  { name: "Haarlem Art", category: "Art Gallery", verified: true },
  { name: "Delft Pottery", category: "Crafts", verified: false }
]

const descriptions = [
  "Fresh morning pastries baked daily with love! 🥐 Come taste the difference authentic Dutch ingredients make.",
  "New seasonal menu featuring local ingredients from nearby farms. Book your table now! 🌱",
  "Beautiful tulip arrangements perfect for any occasion. Free delivery within 5km! 🌷",
  "Latest fashion trends just arrived! Visit our boutique for exclusive pieces you won't find anywhere else. ✨",
  "Upgraded your tech setup with our latest arrivals. Expert advice and setup included! 💻",
  "Premium bikes for every adventure. From city cruising to mountain trails - we've got you covered! 🚴‍♂️",
  "Rare book collection just added to our inventory. Literature lovers, this one's for you! 📚",
  "Spring garden makeover? We have everything you need to create your perfect outdoor space! 🌺",
  "Local artist exhibition opening this weekend. Come discover amazing talent from our community! 🎨",
  "Handcrafted pottery workshop every Saturday. Learn traditional Dutch techniques! 🏺"
]

const locations = [
  "Amsterdam Centrum",
  "Utrecht Binnenstad", 
  "Rotterdam Zuid",
  "Den Haag West",
  "Eindhoven Centrum",
  "Groningen Noord",
  "Maastricht Wyck",
  "Leiden Centrum",
  "Haarlem Centrum",
  "Delft Oude Stad"
]

function getRandomTimeAgo(): string {
  const options = ["2m ago", "5m ago", "15m ago", "1h ago", "2h ago", "5h ago", "1d ago", "2d ago"]
  return options[Math.floor(Math.random() * options.length)]
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateMockPosts(count: number = 20): BusinessPost[] {
  return Array.from({ length: count }, (_, index) => {
    const businessIndex = index % businesses.length
    const business = businesses[businessIndex]
    
    return {
      id: `post-${index + 1}`,
      businessName: business.name,
      businessAvatar: avatars[businessIndex % avatars.length],
      businessCategory: business.category,
      title: `${business.name} - ${business.category}`,
      description: descriptions[businessIndex % descriptions.length],
      imageUrl: businessImages[index % businessImages.length],
      location: locations[businessIndex % locations.length],
      timestamp: getRandomTimeAgo(),
      likes: getRandomNumber(5, 1250),
      comments: getRandomNumber(0, 89),
      saves: getRandomNumber(0, 156),
      isLiked: Math.random() > 0.7,
      isSaved: Math.random() > 0.8,
      isVerified: business.verified
    }
  })
}