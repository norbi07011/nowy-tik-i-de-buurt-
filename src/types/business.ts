export interface BusinessPost {
  id: string
  businessName: string
  businessAvatar: string
  businessCategory: string
  title: string
  description: string
  imageUrl: string
  location: string
  timestamp: string
  likes: number
  comments: number
  saves: number
  isLiked: boolean
  isSaved: boolean
  isVerified: boolean
}