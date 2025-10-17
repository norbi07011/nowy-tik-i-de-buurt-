import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, BusinessProfile, Analytics, UserSubscription } from '@/types'
import { apiService } from '@/services/api'
import { toast } from 'sonner'

interface AppContextType {
  // User state
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  isAuthenticated: boolean
  
  // Business state
  businessProfile: BusinessProfile | null
  setBusinessProfile: (profile: BusinessProfile | null) => void
  
  // Analytics state
  analytics: Analytics | null
  setAnalytics: (analytics: Analytics | null) => void
  
  // Subscription state
  subscription: UserSubscription | null
  setSubscription: (subscription: UserSubscription | null) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loadBusinessProfile: (businessId?: string) => Promise<void>
  loadAnalytics: (businessId: string, period?: string) => Promise<void>
  loadSubscription: (userId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [businessProfile, setBusinessProfile] = useKV<BusinessProfile | null>('business-profile', null)
  const [analytics, setAnalytics] = useKV<Analytics | null>('analytics-data', null)
  const [subscription, setSubscription] = useKV<UserSubscription | null>('subscription-data', null)
  const [isLoading, setIsLoading] = useKV<boolean>('app-loading', false)

  const isAuthenticated = !!currentUser

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiService.login(email, password)
      
      if (response.success && response.data) {
        setCurrentUser(response.data)
        toast.success('Successfully logged in!')
        
        // Load additional data based on user type
        if (response.data.accountType === 'business') {
          await loadBusinessProfile()
          await loadSubscription(response.data.id)
        }
        
        return true
      } else {
        toast.error(response.error?.message || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await apiService.logout()
      
      // Clear all user data
      setCurrentUser(null)
      setBusinessProfile(null)
      setAnalytics(null)
      setSubscription(null)
      
      toast.success('Successfully logged out')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred during logout')
    } finally {
      setIsLoading(false)
    }
  }

  const loadBusinessProfile = async (businessId?: string): Promise<void> => {
    if (!currentUser || currentUser.accountType !== 'business') return
    
    try {
      setIsLoading(true)
      const id = businessId || currentUser.id
      const response = await apiService.getBusinessProfile(id)
      
      if (response.success && response.data) {
        setBusinessProfile(response.data)
      } else {
        console.error('Failed to load business profile:', response.error)
      }
    } catch (error) {
      console.error('Error loading business profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async (businessId: string, period: string = 'last_30_days'): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await apiService.getAnalytics(businessId, period)
      
      if (response.success && response.data) {
        setAnalytics(response.data)
      } else {
        console.error('Failed to load analytics:', response.error)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSubscription = async (userId: string): Promise<void> => {
    try {
      const response = await apiService.getSubscription(userId)
      
      if (response.success && response.data) {
        setSubscription(response.data)
      } else {
        console.error('Failed to load subscription:', response.error)
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  // Auto-load data when user changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.accountType === 'business') {
        loadBusinessProfile()
        loadSubscription(currentUser.id)
      }
    }
  }, [currentUser?.id])

  const value: AppContextType = {
    currentUser: currentUser || null,
    setCurrentUser,
    isAuthenticated,
    businessProfile: businessProfile || null,
    setBusinessProfile,
    analytics: analytics || null,
    setAnalytics,
    subscription: subscription || null,
    setSubscription,
    isLoading: isLoading || false,
    setIsLoading,
    login,
    logout,
    loadBusinessProfile,
    loadAnalytics,
    loadSubscription
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Additional specialized hooks
export function useAuth() {
  const { currentUser, setCurrentUser, isAuthenticated, login, logout, isLoading } = useApp()
  return { currentUser, setCurrentUser, isAuthenticated, login, logout, isLoading }
}

export function useBusiness() {
  const { 
    businessProfile, 
    setBusinessProfile, 
    loadBusinessProfile, 
    analytics, 
    loadAnalytics,
    subscription,
    loadSubscription,
    currentUser 
  } = useApp()
  
  const updateBusinessProfile = async (updates: Partial<BusinessProfile>) => {
    if (!businessProfile) return
    
    try {
      const response = await apiService.updateBusinessProfile(businessProfile.id, updates)
      if (response.success && response.data) {
        setBusinessProfile(response.data)
        toast.success('Business profile updated!')
      } else {
        toast.error('Error updating profile')
      }
    } catch (error) {
      console.error('Error updating business profile:', error)
      toast.error('An error occurred')
    }
  }

  return {
    businessProfile,
    setBusinessProfile,
    loadBusinessProfile,
    updateBusinessProfile,
    analytics,
    loadAnalytics,
    subscription,
    loadSubscription,
    isBusinessOwner: currentUser?.accountType === 'business'
  }
}

export function useNotifications() {
  const { currentUser } = useApp()
  const [notifications, setNotifications] = useKV<any[]>('user-notifications', [])
  const [unreadCount, setUnreadCount] = useKV<number>('unread-notifications', 0)

  const loadNotifications = async () => {
    if (!currentUser) return
    
    try {
      const response = await apiService.getNotifications(currentUser.id)
      if (response.success && response.data) {
        setNotifications(response.data)
        const unread = response.data.filter(n => !n.isRead).length
        setUnreadCount(unread)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await apiService.markNotificationAsRead(notificationId)
      if (response.success) {
        setNotifications(prev => 
          (prev || []).map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, (prev || 0) - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadNotifications()
    }
  }, [currentUser?.id])

  return {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead
  }
}