export interface NotificationData {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion' | 'message' | 'review' | 'payment'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionText?: string
  userId?: string
  businessId?: string
  metadata?: Record<string, any>
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  categories: {
    messages: boolean
    reviews: boolean
    payments: boolean
    marketing: boolean
    analytics: boolean
    system: boolean
  }
}

export class NotificationService {
  private static instance: NotificationService
  private notifications = new Map<string, NotificationData[]>()
  private preferences = new Map<string, NotificationPreferences>()

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Get notifications for a user/business
  async getNotifications(userId: string, unreadOnly = false): Promise<NotificationData[]> {
    const userNotifications = this.notifications.get(userId) || []
    
    if (unreadOnly) {
      return userNotifications.filter(n => !n.read)
    }
    
    return userNotifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  // Send a notification
  async sendNotification(userId: string, notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): Promise<NotificationData> {
    const newNotification: NotificationData = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    }

    const userNotifications = this.notifications.get(userId) || []
    userNotifications.unshift(newNotification)
    this.notifications.set(userId, userNotifications)

    // Check user preferences and send via appropriate channels
    const prefs = this.preferences.get(userId)
    if (prefs) {
      await this.deliverNotification(userId, newNotification, prefs)
    }

    // Trigger real-time update
    this.broadcastNotification(userId, newNotification)

    return newNotification
  }

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || []
    const notification = userNotifications.find(n => n.id === notificationId)
    
    if (notification) {
      notification.read = true
      this.notifications.set(userId, userNotifications)
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || []
    userNotifications.forEach(n => n.read = true)
    this.notifications.set(userId, userNotifications)
  }

  // Delete notification
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || []
    const filtered = userNotifications.filter(n => n.id !== notificationId)
    this.notifications.set(userId, filtered)
  }

  // Get notification preferences
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    return this.preferences.get(userId) || {
      email: true,
      push: true,
      sms: false,
      categories: {
        messages: true,
        reviews: true,
        payments: true,
        marketing: false,
        analytics: false,
        system: true
      }
    }
  }

  // Update notification preferences
  async updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    this.preferences.set(userId, preferences)
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || []
    return userNotifications.filter(n => !n.read).length
  }

  // Send bulk notifications (e.g., marketing campaigns)
  async sendBulkNotification(userIds: string[], notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const promises = userIds.map(userId => this.sendNotification(userId, notification))
    await Promise.all(promises)
  }

  // Business-specific notification helpers
  async notifyNewReview(businessId: string, reviewerName: string, rating: number): Promise<void> {
    await this.sendNotification(businessId, {
      type: 'review',
      title: 'Nieuwe review ontvangen',
      message: `${reviewerName} heeft een ${rating}-ster review achtergelaten`,
      actionUrl: '/dashboard/reviews',
      actionText: 'Bekijk review'
    })
  }

  async notifyNewMessage(userId: string, senderName: string, businessName: string): Promise<void> {
    await this.sendNotification(userId, {
      type: 'message',
      title: 'Nieuw bericht',
      message: `${senderName} heeft een bericht gestuurd over ${businessName}`,
      actionUrl: '/dashboard/messages',
      actionText: 'Bekijk bericht'
    })
  }

  async notifyPaymentSuccess(businessId: string, amount: number): Promise<void> {
    await this.sendNotification(businessId, {
      type: 'payment',
      title: 'Betaling succesvol',
      message: `Uw betaling van €${(amount / 100).toFixed(2)} is succesvol verwerkt`,
      actionUrl: '/dashboard/payments',
      actionText: 'Bekijk betalingen'
    })
  }

  async notifyPaymentFailed(businessId: string, amount: number): Promise<void> {
    await this.sendNotification(businessId, {
      type: 'error',
      title: 'Betaling mislukt',
      message: `Uw betaling van €${(amount / 100).toFixed(2)} kon niet worden verwerkt`,
      actionUrl: '/dashboard/payments',
      actionText: 'Controleer betaalgegevens'
    })
  }

  async notifySubscriptionExpiring(businessId: string, daysLeft: number): Promise<void> {
    await this.sendNotification(businessId, {
      type: 'warning',
      title: 'Abonnement verloopt binnenkort',
      message: `Uw abonnement verloopt over ${daysLeft} dagen`,
      actionUrl: '/dashboard/account',
      actionText: 'Verlengen'
    })
  }

  // Private methods for delivery
  private async deliverNotification(userId: string, notification: NotificationData, preferences: NotificationPreferences): Promise<void> {
    const categoryEnabled = this.isCategoryEnabled(notification.type, preferences)
    
    if (!categoryEnabled) return

    // Email delivery
    if (preferences.email) {
      await this.sendEmail(userId, notification)
    }

    // Push notification delivery
    if (preferences.push) {
      await this.sendPushNotification(userId, notification)
    }

    // SMS delivery
    if (preferences.sms && notification.type === 'payment') {
      await this.sendSMS(userId, notification)
    }
  }

  private isCategoryEnabled(type: NotificationData['type'], preferences: NotificationPreferences): boolean {
    switch (type) {
      case 'message':
        return preferences.categories.messages
      case 'review':
        return preferences.categories.reviews
      case 'payment':
        return preferences.categories.payments
      case 'promotion':
        return preferences.categories.marketing
      case 'info':
      case 'error':
        return preferences.categories.system
      default:
        return true
    }
  }

  private async sendEmail(userId: string, notification: NotificationData): Promise<void> {
    // Simulate email sending
    console.log(`📧 Email sent to ${userId}:`, notification.title)
  }

  private async sendPushNotification(userId: string, notification: NotificationData): Promise<void> {
    // Browser push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  private async sendSMS(userId: string, notification: NotificationData): Promise<void> {
    // Simulate SMS sending
    console.log(`📱 SMS sent to ${userId}:`, notification.message)
  }

  private broadcastNotification(userId: string, notification: NotificationData): void {
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('newNotification', {
      detail: { userId, notification }
    }))
  }

  // Initialize sample notifications for demo
  initializeSampleNotifications(userId: string): void {
    const sampleNotifications: Omit<NotificationData, 'id' | 'timestamp' | 'read'>[] = [
      {
        type: 'success',
        title: 'Welkom bij Tik in de Buurt!',
        message: 'Uw account is succesvol aangemaakt. Begin met het opzetten van uw bedrijfsprofiel.',
        actionUrl: '/dashboard/profile',
        actionText: 'Profiel instellen'
      },
      {
        type: 'info',
        title: 'Nieuwe functies beschikbaar',
        message: 'Ontdek onze nieuwe analytics tools om uw bedrijfsprestaties te volgen.',
        actionUrl: '/dashboard/analytics',
        actionText: 'Bekijk analytics'
      },
      {
        type: 'review',
        title: 'Nieuwe review ontvangen',
        message: 'Maria S. heeft een 5-ster review achtergelaten voor uw bedrijf.',
        actionUrl: '/dashboard/reviews',
        actionText: 'Bekijk review'
      }
    ]

    sampleNotifications.forEach(notification => {
      this.sendNotification(userId, notification)
    })
  }
}

// Utility function to request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
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

// Export singleton instance
export const notificationService = NotificationService.getInstance()