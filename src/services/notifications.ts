import type { Notification, NotificationType } from '@/types'
import { toast } from 'sonner'

// Notification service class
export class NotificationService {
  private static instance: NotificationService
  private subscribers: Set<(notification: Notification) => void> = new Set()
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Subscribe to real-time notifications
  subscribe(callback: (notification: Notification) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // Send notification to all subscribers
  private broadcast(notification: Notification) {
    this.subscribers.forEach(callback => callback(notification))
  }

  // Create and send notification
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
    actionUrl?: string
  ): Promise<Notification> {
    const notification: Notification = {
      id: Date.now().toString(),
      userId,
      type,
      title,
      message,
      data,
      actionUrl,
      isRead: false,
      createdAt: new Date().toISOString()
    }

    // Store notification (in real app this would be saved to database)
    const existingNotifications = this.getStoredNotifications(userId)
    existingNotifications.unshift(notification)
    this.storeNotifications(userId, existingNotifications.slice(0, 50)) // Keep last 50

    // Broadcast to subscribers
    this.broadcast(notification)

    // Show browser notification if permission granted
    this.showBrowserNotification(notification)

    // Show toast notification
    this.showToastNotification(notification)

    return notification
  }

  // Browser push notification
  private async showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new globalThis.Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: true
      })

      browserNotification.onclick = () => {
        if (notification.actionUrl) {
          window.open(notification.actionUrl, '_blank')
        }
        browserNotification.close()
      }
    }
  }

  // Toast notification
  private showToastNotification(notification: Notification) {
    const icon = this.getNotificationIcon(notification.type)
    
    switch (notification.type) {
      case 'payment_failed':
      case 'campaign_rejected':
      case 'post_rejected':
        toast.error(notification.message, {
          description: notification.title
        })
        break
      case 'payment_success':
      case 'campaign_approved':
      case 'post_approved':
      case 'business_verified':
        toast.success(notification.message, {
          description: notification.title
        })
        break
      case 'subscription_expiring':
        toast.warning(notification.message, {
          description: notification.title
        })
        break
      default:
        toast.info(notification.message, {
          description: notification.title
        })
    }
  }

  // Get notification icon
  private getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case 'new_message':
        return '💬'
      case 'new_review':
        return '⭐'
      case 'payment_success':
        return '✅'
      case 'payment_failed':
        return '❌'
      case 'subscription_expiring':
        return '⏰'
      case 'campaign_approved':
        return '🎯'
      case 'campaign_rejected':
        return '❌'
      case 'post_approved':
        return '📝'
      case 'post_rejected':
        return '❌'
      case 'business_verified':
        return '✅'
      case 'new_follower':
        return '👥'
      case 'system_announcement':
        return '📢'
      default:
        return '🔔'
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // Email notification (mock - in real app would call email service)
  async sendEmailNotification(
    email: string,
    subject: string,
    content: string,
    template?: string
  ): Promise<boolean> {
    // Mock implementation
    console.log('Sending email notification:', {
      to: email,
      subject,
      content,
      template
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return Math.random() > 0.1 // 90% success rate
  }

  // SMS notification (mock - in real app would call SMS service)
  async sendSMSNotification(
    phoneNumber: string,
    message: string
  ): Promise<boolean> {
    // Mock implementation
    console.log('Sending SMS notification:', {
      to: phoneNumber,
      message
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return Math.random() > 0.05 // 95% success rate
  }

  // Get stored notifications for user
  private getStoredNotifications(userId: string): Notification[] {
    try {
      const stored = localStorage.getItem(`notifications_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading notifications:', error)
      return []
    }
  }

  // Store notifications for user
  private storeNotifications(userId: string, notifications: Notification[]) {
    try {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications))
    } catch (error) {
      console.error('Error storing notifications:', error)
    }
  }

  // Get notifications for user
  getNotifications(userId: string): Notification[] {
    return this.getStoredNotifications(userId)
  }

  // Mark notification as read
  markAsRead(userId: string, notificationId: string): boolean {
    try {
      const notifications = this.getStoredNotifications(userId)
      const notification = notifications.find(n => n.id === notificationId)
      
      if (notification) {
        notification.isRead = true
        this.storeNotifications(userId, notifications)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }

  // Mark all notifications as read
  markAllAsRead(userId: string): boolean {
    try {
      const notifications = this.getStoredNotifications(userId)
      notifications.forEach(n => n.isRead = true)
      this.storeNotifications(userId, notifications)
      return true
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }
  }

  // Delete notification
  deleteNotification(userId: string, notificationId: string): boolean {
    try {
      const notifications = this.getStoredNotifications(userId)
      const filtered = notifications.filter(n => n.id !== notificationId)
      this.storeNotifications(userId, filtered)
      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      return false
    }
  }

  // Get unread count
  getUnreadCount(userId: string): number {
    const notifications = this.getStoredNotifications(userId)
    return notifications.filter(n => !n.isRead).length
  }

  // Business notification helpers
  async notifyNewReview(businessUserId: string, reviewerName: string, rating: number) {
    await this.createNotification(
      businessUserId,
      'new_review',
      'Nieuwe review ontvangen!',
      `${reviewerName} heeft een ${rating}-sterren review achtergelaten`,
      { reviewerName, rating }
    )

    // Send email notification
    // In real app, get business email from database
    // await this.sendEmailNotification(businessEmail, 'Nieuwe Review', content)
  }

  async notifyNewMessage(userId: string, senderName: string, messagePreview: string) {
    await this.createNotification(
      userId,
      'new_message',
      'Nieuw bericht',
      `${senderName}: ${messagePreview.substring(0, 50)}...`,
      { senderName, messagePreview }
    )
  }

  async notifyPaymentSuccess(userId: string, amount: number, currency: string) {
    await this.createNotification(
      userId,
      'payment_success',
      'Betaling gelukt',
      `Je betaling van ${currency} ${amount} is succesvol verwerkt`,
      { amount, currency }
    )
  }

  async notifyPaymentFailed(userId: string, amount: number, currency: string, reason?: string) {
    await this.createNotification(
      userId,
      'payment_failed',
      'Betaling mislukt',
      `Je betaling van ${currency} ${amount} is mislukt. ${reason || 'Probeer het opnieuw.'}`,
      { amount, currency, reason }
    )
  }

  async notifySubscriptionExpiring(userId: string, daysLeft: number) {
    await this.createNotification(
      userId,
      'subscription_expiring',
      'Abonnement verloopt binnenkort',
      `Je abonnement verloopt over ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagen'}`,
      { daysLeft }
    )
  }

  async notifyBusinessVerified(userId: string) {
    await this.createNotification(
      userId,
      'business_verified',
      'Bedrijf geverifieerd!',
      'Je bedrijf is succesvol geverifieerd en krijgt nu een verificatie badge',
      {}
    )
  }

  async notifyCampaignStatusChange(userId: string, campaignName: string, status: 'approved' | 'rejected', reason?: string) {
    await this.createNotification(
      userId,
      status === 'approved' ? 'campaign_approved' : 'campaign_rejected',
      `Campagne ${status === 'approved' ? 'goedgekeurd' : 'afgekeurd'}`,
      status === 'approved' 
        ? `Je campagne "${campaignName}" is goedgekeurd en zal binnenkort live gaan`
        : `Je campagne "${campaignName}" is afgekeurd. ${reason || 'Neem contact op voor meer informatie.'}`,
      { campaignName, status, reason }
    )
  }

  async notifyPostStatusChange(userId: string, postTitle: string, status: 'approved' | 'rejected', reason?: string) {
    await this.createNotification(
      userId,
      status === 'approved' ? 'post_approved' : 'post_rejected',
      `Post ${status === 'approved' ? 'goedgekeurd' : 'afgekeurd'}`,
      status === 'approved'
        ? `Je post "${postTitle}" is goedgekeurd en is nu zichtbaar`
        : `Je post "${postTitle}" is afgekeurd. ${reason || 'Controleer de community richtlijnen.'}`,
      { postTitle, status, reason }
    )
  }

  async notifySystemAnnouncement(userIds: string[], title: string, message: string, actionUrl?: string) {
    for (const userId of userIds) {
      await this.createNotification(
        userId,
        'system_announcement',
        title,
        message,
        {},
        actionUrl
      )
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()

// Utility functions for notification preferences
export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
  newMessages: boolean
  newReviews: boolean
  paymentUpdates: boolean
  campaignUpdates: boolean
  systemAnnouncements: boolean
}

export const defaultNotificationPreferences: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  marketing: false,
  newMessages: true,
  newReviews: true,
  paymentUpdates: true,
  campaignUpdates: true,
  systemAnnouncements: true
}

export function shouldSendNotification(
  type: NotificationType,
  preferences: NotificationPreferences,
  channel: 'email' | 'push' | 'sms'
): boolean {
  // Check if channel is enabled
  if (!preferences[channel]) return false

  // Check if notification type is enabled
  switch (type) {
    case 'new_message':
      return preferences.newMessages
    case 'new_review':
      return preferences.newReviews
    case 'payment_success':
    case 'payment_failed':
    case 'subscription_expiring':
      return preferences.paymentUpdates
    case 'campaign_approved':
    case 'campaign_rejected':
      return preferences.campaignUpdates
    case 'system_announcement':
      return preferences.systemAnnouncements
    default:
      return true
  }
}