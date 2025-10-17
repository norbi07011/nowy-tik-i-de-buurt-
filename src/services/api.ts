import { 
  User, 
  BusinessProfile, 
  Post, 
  Review, 
  Analytics, 
  Campaign, 
  Message, 
  Conversation,
  ApiResponse, 
  PaginationParams, 
  SearchParams,
  PaymentMethod,
  UserSubscription,
  Notification
} from '@/types'

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    accountType: 'personal',
    language: 'nl',
    createdAt: new Date().toISOString(),
    isVerified: true,
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false
      },
      privacy: {
        showProfile: true,
        showLocation: true,
        allowMessages: true
      },
      language: 'nl',
      theme: 'light'
    }
  }
]

const mockBusinessProfiles: BusinessProfile[] = [
  {
    id: '1',
    userId: '2',
    businessName: 'Café Central',
    description: 'Gezellig café in het centrum van Amsterdam',
    category: 'restaurant',
    contactInfo: {
      email: 'info@cafecentral.nl',
      phone: '+31 20 123 4567',
      website: 'https://cafecentral.nl'
    },
    location: {
      address: 'Damrak 123',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Nederland',
      coordinates: {
        lat: 52.3676,
        lng: 4.9041
      }
    },
    operatingHours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '09:00', closeTime: '22:00' }
    },
    socialMedia: {
      facebook: 'https://facebook.com/cafecentral',
      instagram: 'https://instagram.com/cafecentral'
    },
    gallery: [],
    verified: true,
    rating: 4.5,
    reviewCount: 127,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// API Service Class
export class ApiService {
  private baseUrl = '/api'

  // User Authentication
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    // Mock implementation
    await this.delay(1000)
    const user = mockUsers.find(u => u.email === email)
    if (user) {
      return { success: true, data: user }
    }
    return { 
      success: false, 
      error: { code: 'AUTH_FAILED', message: 'Invalid credentials' }
    }
  }

  async register(userData: Partial<User>): Promise<ApiResponse<User>> {
    await this.delay(1000)
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      accountType: userData.accountType || 'personal',
      language: userData.language || 'nl',
      createdAt: new Date().toISOString(),
      isVerified: false,
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false
        },
        privacy: {
          showProfile: true,
          showLocation: true,
          allowMessages: true
        },
        language: userData.language || 'nl',
        theme: 'light'
      }
    }
    return { success: true, data: newUser }
  }

  async logout(): Promise<ApiResponse> {
    await this.delay(500)
    return { success: true }
  }

  // Business Profiles
  async getBusinessProfile(businessId: string): Promise<ApiResponse<BusinessProfile>> {
    await this.delay(800)
    const business = mockBusinessProfiles.find(b => b.id === businessId)
    if (business) {
      return { success: true, data: business }
    }
    return { 
      success: false, 
      error: { code: 'NOT_FOUND', message: 'Business not found' }
    }
  }

  async updateBusinessProfile(businessId: string, data: Partial<BusinessProfile>): Promise<ApiResponse<BusinessProfile>> {
    await this.delay(1000)
    const businessIndex = mockBusinessProfiles.findIndex(b => b.id === businessId)
    if (businessIndex !== -1) {
      mockBusinessProfiles[businessIndex] = { ...mockBusinessProfiles[businessIndex], ...data }
      return { success: true, data: mockBusinessProfiles[businessIndex] }
    }
    return { 
      success: false, 
      error: { code: 'NOT_FOUND', message: 'Business not found' }
    }
  }

  async searchBusinesses(params: SearchParams): Promise<ApiResponse<BusinessProfile[]>> {
    await this.delay(1200)
    let businesses = [...mockBusinessProfiles]
    
    if (params.query) {
      businesses = businesses.filter(b => 
        b.businessName.toLowerCase().includes(params.query!.toLowerCase()) ||
        b.description.toLowerCase().includes(params.query!.toLowerCase())
      )
    }
    
    if (params.category) {
      businesses = businesses.filter(b => b.category === params.category)
    }
    
    return {
      success: true,
      data: businesses,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: businesses.length,
        pages: Math.ceil(businesses.length / (params.limit || 10))
      }
    }
  }

  // Posts
  async getPosts(params: PaginationParams = {}): Promise<ApiResponse<Post[]>> {
    await this.delay(1000)
    const mockPosts: Post[] = [
      {
        id: '1',
        businessId: '1',
        businessName: 'Café Central',
        category: 'restaurant',
        type: 'promotion',
        title: 'Happy Hour 2+1 Gratis!',
        content: 'Kom langs tussen 17:00-19:00 voor onze geweldige happy hour deal!',
        media: [],
        tags: ['happy-hour', 'drinks', 'aanbieding'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        engagement: {
          views: 234,
          likes: 45,
          comments: 12,
          shares: 8,
          saves: 23,
          contacts: 5,
          isLiked: false,
          isSaved: false
        },
        isPromoted: true
      }
    ]

    return {
      success: true,
      data: mockPosts,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: mockPosts.length,
        pages: 1
      }
    }
  }

  async createPost(postData: Partial<Post>): Promise<ApiResponse<Post>> {
    await this.delay(1500)
    const newPost: Post = {
      id: Date.now().toString(),
      businessId: postData.businessId!,
      businessName: postData.businessName!,
      category: postData.category!,
      type: postData.type || 'standard',
      title: postData.title!,
      content: postData.content!,
      media: postData.media || [],
      tags: postData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      engagement: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        contacts: 0,
        isLiked: false,
        isSaved: false
      },
      isPromoted: false
    }
    return { success: true, data: newPost }
  }

  // Reviews
  async getReviews(businessId: string, params: PaginationParams = {}): Promise<ApiResponse<Review[]>> {
    await this.delay(800)
    const mockReviews: Review[] = [
      {
        id: '1',
        businessId: businessId,
        userId: '1',
        userName: 'Maria van der Berg',
        rating: 5,
        title: 'Fantastische ervaring!',
        content: 'Geweldige service en heerlijk eten. Zeker een aanrader!',
        helpful: 12,
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ]

    return {
      success: true,
      data: mockReviews,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: mockReviews.length,
        pages: 1
      }
    }
  }

  async createReview(reviewData: Partial<Review>): Promise<ApiResponse<Review>> {
    await this.delay(1000)
    const newReview: Review = {
      id: Date.now().toString(),
      businessId: reviewData.businessId!,
      userId: reviewData.userId!,
      userName: reviewData.userName!,
      rating: reviewData.rating!,
      title: reviewData.title!,
      content: reviewData.content!,
      helpful: 0,
      isVerified: false,
      createdAt: new Date().toISOString()
    }
    return { success: true, data: newReview }
  }

  // Analytics
  async getAnalytics(businessId: string, period: string = 'last_30_days'): Promise<ApiResponse<Analytics>> {
    await this.delay(1200)
    const mockAnalytics: Analytics = {
      businessId: businessId,
      period: period as any,
      overview: {
        profileViews: 1234,
        postViews: 5678,
        contactClicks: 89,
        websiteClicks: 156,
        phoneClicks: 67,
        directionClicks: 234
      },
      engagement: {
        likes: 456,
        comments: 123,
        shares: 78,
        saves: 234
      },
      demographics: {
        ageGroups: [
          { range: '18-24', count: 145, percentage: 23.2 },
          { range: '25-34', count: 287, percentage: 45.8 },
          { range: '35-44', count: 123, percentage: 19.6 },
          { range: '45+', count: 71, percentage: 11.4 }
        ],
        locations: [
          { city: 'Amsterdam', count: 456, percentage: 72.8 },
          { city: 'Utrecht', count: 89, percentage: 14.2 },
          { city: 'Rotterdam', count: 67, percentage: 10.7 },
          { city: 'Den Haag', count: 14, percentage: 2.3 }
        ],
        devices: [
          { type: 'mobile', count: 456, percentage: 72.8 },
          { type: 'desktop', count: 123, percentage: 19.6 },
          { type: 'tablet', count: 47, percentage: 7.6 }
        ]
      },
      trends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 100) + 50,
        engagement: Math.floor(Math.random() * 50) + 10
      })),
      topPosts: [
        { postId: '1', title: 'Happy Hour Aanbieding', views: 234, engagement: 45 },
        { postId: '2', title: 'Nieuwe Menukaart', views: 189, engagement: 32 },
        { postId: '3', title: 'Weekend Special', views: 156, engagement: 28 }
      ]
    }
    return { success: true, data: mockAnalytics }
  }

  // Campaigns
  async getCampaigns(businessId: string): Promise<ApiResponse<Campaign[]>> {
    await this.delay(1000)
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        businessId: businessId,
        name: 'Zomer Promotie 2024',
        type: 'awareness',
        status: 'active',
        budget: {
          total: 500,
          spent: 234,
          currency: 'EUR'
        },
        targeting: {
          location: {
            cities: ['Amsterdam', 'Utrecht'],
            radius: 25
          },
          demographics: {
            ageRange: { min: 25, max: 45 },
            interests: ['eten', 'drinken', 'uitgaan']
          }
        },
        content: {
          headline: 'Ontdek onze zomer specials!',
          description: 'Geniet van onze verfrissende zomerdrankjes en gerechten.',
          media: [],
          callToAction: 'Reserveer nu'
        },
        schedule: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isAlwaysOn: false
        },
        metrics: {
          impressions: 12456,
          clicks: 234,
          conversions: 23,
          ctr: 1.88,
          cpc: 1.02,
          cpm: 18.79,
          roas: 3.45
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    return { success: true, data: mockCampaigns }
  }

  async createCampaign(campaignData: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    await this.delay(1500)
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      businessId: campaignData.businessId!,
      name: campaignData.name!,
      type: campaignData.type!,
      status: 'draft',
      budget: campaignData.budget!,
      targeting: campaignData.targeting!,
      content: campaignData.content!,
      schedule: campaignData.schedule!,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roas: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return { success: true, data: newCampaign }
  }

  // Messages
  async getConversations(userId: string): Promise<ApiResponse<Conversation[]>> {
    await this.delay(800)
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: [
          { userId: '1', name: 'John Doe', accountType: 'personal' },
          { userId: '2', name: 'Café Central', accountType: 'business' }
        ],
        lastMessage: {
          id: '1',
          conversationId: '1',
          senderId: '2',
          senderName: 'Café Central',
          content: 'Bedankt voor je interesse! We zijn open van 8:00-22:00.',
          type: 'text',
          createdAt: new Date().toISOString()
        },
        unreadCount: 1,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    return { success: true, data: mockConversations }
  }

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    await this.delay(600)
    const mockMessages: Message[] = [
      {
        id: '1',
        conversationId: conversationId,
        senderId: '1',
        senderName: 'John Doe',
        content: 'Hallo, wat zijn jullie openingstijden?',
        type: 'text',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        conversationId: conversationId,
        senderId: '2',
        senderName: 'Café Central',
        content: 'Bedankt voor je interesse! We zijn open van 8:00-22:00.',
        type: 'text',
        createdAt: new Date().toISOString()
      }
    ]
    return { success: true, data: mockMessages }
  }

  async sendMessage(messageData: Partial<Message>): Promise<ApiResponse<Message>> {
    await this.delay(500)
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: messageData.conversationId!,
      senderId: messageData.senderId!,
      senderName: messageData.senderName!,
      content: messageData.content!,
      type: messageData.type || 'text',
      createdAt: new Date().toISOString()
    }
    return { success: true, data: newMessage }
  }

  // Notifications
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    await this.delay(600)
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: userId,
        type: 'new_message',
        title: 'Nieuw bericht',
        message: 'Je hebt een nieuw bericht ontvangen van Café Central',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: userId,
        type: 'new_review',
        title: 'Nieuwe review',
        message: 'Je bedrijf heeft een nieuwe 5-sterren review ontvangen!',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    return { success: true, data: mockNotifications }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    await this.delay(300)
    return { success: true }
  }

  // Subscription
  async getSubscription(userId: string): Promise<ApiResponse<UserSubscription>> {
    await this.delay(500)
    const mockSubscription: UserSubscription = {
      id: '1',
      planType: 'business',
      status: 'active',
      startDate: new Date().toISOString(),
      price: 14,
      currency: 'EUR',
      paymentMethod: {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      }
    }
    return { success: true, data: mockSubscription }
  }

  // Utility method for mocking delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export individual API functions for convenience
export const {
  login,
  register,
  logout,
  getBusinessProfile,
  updateBusinessProfile,
  searchBusinesses,
  getPosts,
  createPost,
  getReviews,
  createReview,
  getAnalytics,
  getCampaigns,
  createCampaign,
  getConversations,
  getMessages,
  sendMessage,
  getNotifications,
  markNotificationAsRead,
  getSubscription
} = apiService