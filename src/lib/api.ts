import { BusinessPost } from "@/types/business"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  hasNextPage: boolean
}

export interface BusinessProfile {
  id: string
  name: string
  category: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  businessHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  photos: string[]
  verified: boolean
  subscriptionStatus: 'active' | 'inactive' | 'trial'
  subscriptionExpiry: string
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  accountType: 'personal' | 'business'
  businessId?: string
  avatar?: string
  preferences: {
    language: 'nl' | 'en'
    notifications: boolean
    location?: string
  }
  createdAt: string
  lastActive: string
}

export interface Review {
  id: string
  businessId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  photos?: string[]
  helpful: number
  reported: boolean
  response?: {
    text: string
    timestamp: string
  }
  createdAt: string
}

export interface Subscription {
  id: string
  businessId: string
  planType: 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due' | 'trial'
  currentPeriodStart: string
  currentPeriodEnd: string
  amount: number
  currency: string
  paymentMethodId?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'paypal'
  last4?: string
  brand?: string
  accountName?: string
  isDefault: boolean
  expiryMonth?: number
  expiryYear?: number
}

export interface Analytics {
  businessId: string
  period: string
  metrics: {
    views: number
    contacts: number
    reviews: number
    averageRating: number
    profileViews: number
    postEngagement: number
    searchAppearances: number
    websiteClicks: number
    phoneClicks: number
    directionClicks: number
  }
  trends: {
    viewsGrowth: number
    contactsGrowth: number
    ratingGrowth: number
  }
  topPosts: string[]
  demographics: {
    ageGroups: { [key: string]: number }
    locations: { [key: string]: number }
    devices: { [key: string]: number }
  }
}

export interface Campaign {
  id: string
  businessId: string
  title: string
  type: 'promotion' | 'event' | 'announcement'
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate: string
  endDate: string
  targetAudience: {
    location?: string
    ageRange?: [number, number]
    interests?: string[]
  }
  budget: number
  spent: number
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cost_per_click: number
  }
  content: {
    title: string
    description: string
    imageUrl?: string
    callToAction: string
  }
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderType: 'user' | 'business'
  content: string
  type: 'text' | 'image' | 'file'
  attachments?: string[]
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  businessId: string
  userId: string
  userName: string
  userAvatar?: string
  businessName: string
  businessAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'active' | 'archived'
}

// Simulated API class for local development
export class LocalAPI {
  private static instance: LocalAPI
  private storage = {
    businesses: new Map<string, BusinessProfile>(),
    users: new Map<string, User>(),
    posts: new Map<string, BusinessPost>(),
    reviews: new Map<string, Review[]>(),
    subscriptions: new Map<string, Subscription>(),
    analytics: new Map<string, Analytics>(),
    campaigns: new Map<string, Campaign[]>(),
    conversations: new Map<string, Conversation[]>(),
    messages: new Map<string, Message[]>()
  }

  public static getInstance(): LocalAPI {
    if (!LocalAPI.instance) {
      LocalAPI.instance = new LocalAPI()
    }
    return LocalAPI.instance
  }

  // Business API
  async getBusinessProfile(businessId: string): Promise<ApiResponse<BusinessProfile>> {
    const business = this.storage.businesses.get(businessId)
    if (!business) {
      return { success: false, error: "Business not found" }
    }
    return { success: true, data: business }
  }

  async updateBusinessProfile(businessId: string, updates: Partial<BusinessProfile>): Promise<ApiResponse<BusinessProfile>> {
    const business = this.storage.businesses.get(businessId)
    if (!business) {
      return { success: false, error: "Business not found" }
    }
    
    const updated = { ...business, ...updates, updatedAt: new Date().toISOString() }
    this.storage.businesses.set(businessId, updated)
    return { success: true, data: updated }
  }

  // Posts API
  async getBusinessPosts(businessId: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<BusinessPost>>> {
    const allPosts = Array.from(this.storage.posts.values())
    const businessPosts = allPosts.filter(post => post.id.includes(businessId))
    const startIndex = (page - 1) * limit
    const items = businessPosts.slice(startIndex, startIndex + limit)
    
    return {
      success: true,
      data: {
        items,
        totalCount: businessPosts.length,
        page,
        pageSize: limit,
        hasNextPage: startIndex + limit < businessPosts.length
      }
    }
  }

  async createPost(businessId: string, postData: Omit<BusinessPost, 'id' | 'timestamp'>): Promise<ApiResponse<BusinessPost>> {
    const post: BusinessPost = {
      ...postData,
      id: `${businessId}-post-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    
    this.storage.posts.set(post.id, post)
    return { success: true, data: post }
  }

  // Reviews API
  async getBusinessReviews(businessId: string): Promise<ApiResponse<Review[]>> {
    const reviews = this.storage.reviews.get(businessId) || []
    return { success: true, data: reviews }
  }

  async addReview(businessId: string, review: Omit<Review, 'id' | 'createdAt'>): Promise<ApiResponse<Review>> {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    const reviews = this.storage.reviews.get(businessId) || []
    reviews.unshift(newReview)
    this.storage.reviews.set(businessId, reviews)
    
    return { success: true, data: newReview }
  }

  // Analytics API
  async getBusinessAnalytics(businessId: string, period: string): Promise<ApiResponse<Analytics>> {
    let analytics = this.storage.analytics.get(`${businessId}-${period}`)
    
    if (!analytics) {
      // Generate mock analytics
      analytics = {
        businessId,
        period,
        metrics: {
          views: Math.floor(Math.random() * 1000) + 100,
          contacts: Math.floor(Math.random() * 50) + 5,
          reviews: Math.floor(Math.random() * 20) + 1,
          averageRating: 3.5 + Math.random() * 1.5,
          profileViews: Math.floor(Math.random() * 500) + 50,
          postEngagement: Math.floor(Math.random() * 300) + 30,
          searchAppearances: Math.floor(Math.random() * 200) + 20,
          websiteClicks: Math.floor(Math.random() * 100) + 10,
          phoneClicks: Math.floor(Math.random() * 80) + 8,
          directionClicks: Math.floor(Math.random() * 150) + 15
        },
        trends: {
          viewsGrowth: (Math.random() - 0.5) * 50,
          contactsGrowth: (Math.random() - 0.5) * 30,
          ratingGrowth: (Math.random() - 0.5) * 1
        },
        topPosts: [`${businessId}-post-1`, `${businessId}-post-2`],
        demographics: {
          ageGroups: {
            "18-24": Math.floor(Math.random() * 30),
            "25-34": Math.floor(Math.random() * 40),
            "35-44": Math.floor(Math.random() * 35),
            "45-54": Math.floor(Math.random() * 25),
            "55+": Math.floor(Math.random() * 20)
          },
          locations: {
            "Amsterdam": Math.floor(Math.random() * 40),
            "Utrecht": Math.floor(Math.random() * 30),
            "Rotterdam": Math.floor(Math.random() * 25),
            "Den Haag": Math.floor(Math.random() * 20)
          },
          devices: {
            "Mobile": Math.floor(Math.random() * 60) + 40,
            "Desktop": Math.floor(Math.random() * 40) + 20,
            "Tablet": Math.floor(Math.random() * 20) + 10
          }
        }
      }
      this.storage.analytics.set(`${businessId}-${period}`, analytics)
    }
    
    return { success: true, data: analytics }
  }

  // Subscription API
  async getSubscription(businessId: string): Promise<ApiResponse<Subscription>> {
    let subscription = this.storage.subscriptions.get(businessId)
    
    if (!subscription) {
      subscription = {
        id: `sub-${businessId}`,
        businessId,
        planType: 'basic',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 14.00,
        currency: 'EUR'
      }
      this.storage.subscriptions.set(businessId, subscription)
    }
    
    return { success: true, data: subscription }
  }

  // Campaign API
  async getBusinessCampaigns(businessId: string): Promise<ApiResponse<Campaign[]>> {
    const campaigns = this.storage.campaigns.get(businessId) || []
    return { success: true, data: campaigns }
  }

  async createCampaign(businessId: string, campaignData: Omit<Campaign, 'id' | 'createdAt' | 'metrics'>): Promise<ApiResponse<Campaign>> {
    const campaign: Campaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      createdAt: new Date().toISOString(),
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cost_per_click: 0
      }
    }
    
    const campaigns = this.storage.campaigns.get(businessId) || []
    campaigns.unshift(campaign)
    this.storage.campaigns.set(businessId, campaigns)
    
    return { success: true, data: campaign }
  }

  // Messages API
  async getConversations(businessId: string): Promise<ApiResponse<Conversation[]>> {
    const conversations = this.storage.conversations.get(businessId) || []
    return { success: true, data: conversations }
  }

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    const messages = this.storage.messages.get(conversationId) || []
    return { success: true, data: messages }
  }

  async sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<ApiResponse<Message>> {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    
    const messages = this.storage.messages.get(conversationId) || []
    messages.push(newMessage)
    this.storage.messages.set(conversationId, messages)
    
    return { success: true, data: newMessage }
  }
}

export const api = LocalAPI.getInstance()