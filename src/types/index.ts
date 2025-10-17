export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string
  accountType: 'personal' | 'business'
  phoneNumber?: string
  phone?: string
  location?: string
  city?: string
  bio?: string
  profileImage?: string
  language: 'nl' | 'en'
  createdAt: string
  isVerified: boolean
  subscription?: UserSubscription
  preferences: UserPreferences
  favoriteBusinesses?: string[]
  interests?: string[]
}

export interface UserSubscription {
  id: string
  planType: 'free' | 'business'
  status: 'active' | 'canceled' | 'expired' | 'past_due'
  startDate: string
  endDate?: string
  price: number
  currency: string
  paymentMethod?: PaymentMethod
}

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    showProfile: boolean
    showLocation: boolean
    allowMessages: boolean
  }
  language: 'nl' | 'en'
  theme: 'light' | 'dark' | 'auto'
}

export interface BusinessProfile {
  id: string
  userId: string
  businessName: string
  description: string
  category: BusinessCategory
  contactInfo: ContactInfo
  location: BusinessLocation
  operatingHours: OperatingHours
  socialMedia: SocialMediaLinks
  gallery: MediaFile[]
  verified: boolean
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface ContactInfo {
  email: string
  phone: string
  website?: string
  whatsapp?: string
}

export interface BusinessLocation {
  address: string
  city: string
  postalCode: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface OperatingHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  isOpen: boolean
  openTime?: string
  closeTime?: string
  breaks?: TimeBreak[]
}

export interface TimeBreak {
  startTime: string
  endTime: string
  reason: string
}

export interface SocialMediaLinks {
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
  tiktok?: string
  youtube?: string
}

export interface MediaFile {
  id: string
  url: string
  type: 'image' | 'video' | 'document'
  title?: string
  description?: string
  uploadedAt: string
  size: number
  mimeType: string
}

export interface Post {
  id: string
  businessId: string
  businessName: string
  businessAvatar?: string
  category: BusinessCategory
  type: PostType
  title: string
  content: string
  media: MediaFile[]
  location?: string
  tags: string[]
  price?: Price
  eventDetails?: EventDetails
  jobDetails?: JobDetails
  propertyDetails?: PropertyDetails
  createdAt: string
  updatedAt: string
  engagement: PostEngagement
  isPromoted: boolean
  expiresAt?: string
}

export interface PostEngagement {
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  contacts: number
  isLiked: boolean
  isSaved: boolean
}

export interface Price {
  amount: number
  currency: string
  isNegotiable: boolean
}

export interface EventDetails {
  startDate: string
  endDate?: string
  location: string
  capacity?: number
  registeredCount?: number
  price?: Price
  isOnline: boolean
}

export interface JobDetails {
  position: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  salary?: {
    min?: number
    max?: number
    currency: string
    period: 'hour' | 'month' | 'year'
  }
  requirements: string[]
  applicationDeadline?: string
}

export interface PropertyDetails {
  type: 'apartment' | 'house' | 'commercial' | 'land'
  listingType: 'sale' | 'rent'
  price: Price
  size: number
  rooms?: number
  bathrooms?: number
  features: string[]
  availableFrom?: string
}

export interface Review {
  id: string
  businessId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  photos?: MediaFile[]
  helpful: number
  isVerified: boolean
  businessResponse?: {
    content: string
    respondedAt: string
  }
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: 'text' | 'image' | 'file' | 'location'
  attachments?: MediaFile[]
  readAt?: string
  createdAt: string
}

export interface Conversation {
  id: string
  participants: ConversationParticipant[]
  lastMessage?: Message
  unreadCount: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface ConversationParticipant {
  userId: string
  name: string
  avatar?: string
  accountType: 'personal' | 'business'
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export interface Campaign {
  id: string
  businessId: string
  name: string
  type: CampaignType
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: {
    total: number
    spent: number
    currency: string
  }
  targeting: CampaignTargeting
  content: CampaignContent
  schedule: CampaignSchedule
  metrics: CampaignMetrics
  createdAt: string
  updatedAt: string
}

export interface CampaignTargeting {
  location: {
    cities: string[]
    radius: number
  }
  demographics: {
    ageRange?: {
      min: number
      max: number
    }
    interests: string[]
  }
}

export interface CampaignContent {
  headline: string
  description: string
  media: MediaFile[]
  callToAction: string
  landingUrl?: string
}

export interface CampaignSchedule {
  startDate: string
  endDate?: string
  isAlwaysOn: boolean
  dayparting?: {
    hours: number[]
    days: number[]
  }
}

export interface CampaignMetrics {
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  cpm: number
  roas: number
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'ideal' | 'paypal'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface Analytics {
  businessId: string
  period: AnalyticsPeriod
  overview: {
    profileViews: number
    postViews: number
    contactClicks: number
    websiteClicks: number
    phoneClicks: number
    directionClicks: number
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    saves: number
  }
  demographics: {
    ageGroups: AgeGroupData[]
    locations: LocationData[]
    devices: DeviceData[]
  }
  trends: TrendData[]
  topPosts: TopPostData[]
}

export interface AgeGroupData {
  range: string
  count: number
  percentage: number
}

export interface LocationData {
  city: string
  count: number
  percentage: number
}

export interface DeviceData {
  type: 'mobile' | 'desktop' | 'tablet'
  count: number
  percentage: number
}

export interface TrendData {
  date: string
  views: number
  engagement: number
}

export interface TopPostData {
  postId: string
  title: string
  views: number
  engagement: number
}

// Enums and Type Unions
export type BusinessCategory = 
  | 'restaurant'
  | 'retail'
  | 'services'
  | 'healthcare'
  | 'fitness'
  | 'beauty'
  | 'automotive'
  | 'construction'
  | 'education'
  | 'entertainment'
  | 'real-estate'
  | 'technology'
  | 'other'

export type PostType = 
  | 'standard'
  | 'promotion'
  | 'event'
  | 'job'
  | 'property'
  | 'product'
  | 'service'
  | 'announcement'

export type NotificationType = 
  | 'new_message'
  | 'new_review'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_expiring'
  | 'campaign_approved'
  | 'campaign_rejected'
  | 'post_approved'
  | 'post_rejected'
  | 'business_verified'
  | 'new_follower'
  | 'system_announcement'

export type CampaignType = 
  | 'awareness'
  | 'traffic'
  | 'engagement'
  | 'leads'
  | 'conversions'
  | 'app_promotion'

export type AnalyticsPeriod = 
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'custom'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface SearchParams extends PaginationParams {
  query?: string
  category?: BusinessCategory
  location?: string
  radius?: number
  priceRange?: {
    min?: number
    max?: number
  }
  rating?: number
  verified?: boolean
  openNow?: boolean
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber?: string
  accountType: 'personal' | 'business'
  acceptTerms: boolean
  marketingConsent?: boolean
}

export interface BusinessRegistrationForm {
  businessName: string
  category: BusinessCategory
  description: string
  address: string
  city: string
  postalCode: string
  phone: string
  email: string
  website?: string
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  businessId: string
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean
  currentView: string
  selectedPost?: Post
  selectedBusiness?: BusinessProfile
  isLoading: boolean
  error?: string
}

// Error Types
export interface AppError {
  code: string
  message: string
  field?: string
  timestamp: string
}

// Storage Types
export interface StorageKeys {
  'current-user': User | null
  'app-language': 'nl' | 'en'
  'ui-theme': 'light' | 'dark' | 'auto'
  'sidebar-collapsed': boolean
  'draft-posts': Partial<Post>[]
  'saved-searches': SearchParams[]
  'notification-preferences': UserPreferences['notifications']
  'viewed-businesses': string[]
  'conversation-drafts': Record<string, string>
}

// Re-export payment types
export * from './payment'